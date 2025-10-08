import { watchlistApi } from "@/lib/hooks/watchlistApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Types
export interface WatchlistItem {
  _id: string;
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

export interface WatchlistResponse {
  success: boolean;
  data: WatchlistItem[];
  count: number;
}

export interface WatchlistItemResponse {
  success: boolean;
  data: WatchlistItem;
  message?: string;
}

export interface WatchlistCheckResponse {
  success: boolean;
  isInWatchlist: boolean;
  data: WatchlistItem | null;
}

interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

interface CompanyMetrics {
  marketCapitalization?: number;
  peBasicExclExtraTTM?: number; // P/E ratio
}

// Fetch all watchlist items
export const useWatchlist = () => {
  return useQuery<WatchlistResponse>({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const response = await fetch("/api/watchlist");
      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }
      return response.json();
    },
  });
};

// Check if a stock is in the watchlist
export const useWatchlistCheck = (symbol: string) => {
  return useQuery<WatchlistCheckResponse>({
    queryKey: ["watchlist", symbol],
    queryFn: async () => {
      const response = await fetch(`/api/watchlist/${symbol}`);
      if (!response.ok) {
        throw new Error("Failed to check watchlist status");
      }
      return response.json();
    },
    enabled: !!symbol,
  });
};

// Add a stock to the watchlist
export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchlistApi.addWatchlist,
    onSuccess: (data, variables) => {
      // Invalidate and refetch watchlist queries
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({
        queryKey: ["watchlist", variables.symbol],
      });
    },
  });
};

// Remove a stock from the watchlist
export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchlistApi.removeFromWatchlist,
    onSuccess: (data, symbol) => {
      // Invalidate and refetch watchlist queries
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist", symbol] });
    },
  });
};

// Clear all watchlist items
export const useClearWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to clear watchlist");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch all watchlist queries
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
};

// Toggle watchlist status (add or remove)
export const useToggleWatchlist = () => {
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  return {
    toggle: async (symbol: string, company: string, isInWatchlist: boolean) => {
      if (isInWatchlist) {
        return removeMutation.mutateAsync(symbol);
      } else {
        return addMutation.mutateAsync({ symbol, company });
      }
    },
    isLoading: addMutation.isPending || removeMutation.isPending,
    error: addMutation.error || removeMutation.error,
  };
};

const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

export const useGetQuotes = (watchlistData: WatchlistItem[]) =>
  useQuery({
    queryKey: ["quotes", watchlistData],
    enabled: !!watchlistData && watchlistData.length > 0,
    queryFn: async () => {
      try {
        // Fetch quotes
        const quotePromises = watchlistData.map(async (item) => {
          try {
            const response = await axios.get(
              `https://finnhub.io/api/v1/quote?symbol=${item.symbol}&token=${apiKey}`
            );
            if (response.status !== 200)
              throw new Error("Failed to fetch quote");
            const data = response.data;
            return { symbol: item.symbol, data };
          } catch (err) {
            console.error(`Error fetching quote for ${item.symbol}:`, err);
            return { symbol: item.symbol, data: null };
          }
        });

        // Fetch company metrics (market cap and P/E ratio)
        const metricsPromises = watchlistData.map(async (item) => {
          try {
            const response = await fetch(
              `https://finnhub.io/api/v1/stock/metric?symbol=${item.symbol}&metric=all&token=${apiKey}`
            );
            if (!response.ok) throw new Error("Failed to fetch metrics");
            const data = await response.json();
            return { symbol: item.symbol, data: data.metric };
          } catch (err) {
            console.error(`Error fetching metrics for ${item.symbol}:`, err);
            return { symbol: item.symbol, data: null };
          }
        });

        const [quoteResults, metricsResults] = await Promise.all([
          Promise.all(quotePromises),
          Promise.all(metricsPromises),
        ]);

        const quotesMap: Record<string, StockQuote> = {};
        quoteResults.forEach(({ symbol, data }) => {
          if (data) quotesMap[symbol] = data;
        });

        const metricsMap: Record<string, CompanyMetrics> = {};
        metricsResults.forEach(({ symbol, data }) => {
          if (data) metricsMap[symbol] = data;
        });

        return { quotesMap, metricsMap };
      } catch (err) {
        console.error("Error fetching quotes:", err);
        return { quotesMap: {}, metricsMap: {} };
      }
    },
  });
