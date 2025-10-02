import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    mutationFn: async ({
      symbol,
      company,
    }: {
      symbol: string;
      company: string;
    }) => {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol, company }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add to watchlist");
      }

      return response.json();
    },
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
    mutationFn: async (symbol: string) => {
      const response = await fetch(`/api/watchlist/${symbol}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove from watchlist");
      }

      return response.json();
    },
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
