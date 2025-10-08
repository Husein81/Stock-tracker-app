"use client";
import { useDeleteAlert, useGetAlerts } from "@/hooks/alerts";
import { toast } from "sonner";
import AlertCommand from "./alert-command";
import { Icon, Spinner } from "./ui";
import { useEffect, useState } from "react";

interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
}

const AlertList = () => {
  const { data: alerts, isLoading } = useGetAlerts();
  const deleteAlert = useDeleteAlert();
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  const handleDelete = async (alertId: string) => {
    try {
      await deleteAlert.mutateAsync(alertId);
      toast.success("Alert deleted successfully");
    } catch (error) {
      toast.error("Failed to delete alert");
    }
  };

  const parseStockSymbol = (stockIdentifier: string) => {
    // Extract symbol from "Apple Inc. (AAPL)" format
    const match = stockIdentifier.match(/\(([^)]+)\)/);
    return match ? match[1] : stockIdentifier;
  };

  const parseCompanyName = (stockIdentifier: string) => {
    // Extract company name from "Apple Inc. (AAPL)" format
    const match = stockIdentifier.match(/^([^(]+)/);
    return match ? match[1].trim() : stockIdentifier;
  };

  const getConditionSymbol = (condition: string) => {
    return condition === "greater_than" ? ">" : "<";
  };

  const formatFrequency = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      once_per_minute: "Once per minute",
      once_per_hour: "Once per hour",
      once_per_day: "Once per day",
    };
    return frequencyMap[frequency] || frequency;
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!alerts || alerts.length === 0) return;

      setLoadingQuotes(true);
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

      try {
        const quotePromises = alerts.map(async (alert) => {
          const symbol = parseStockSymbol(alert.stockIdentifier);
          try {
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
            );
            if (!response.ok) throw new Error("Failed to fetch quote");
            const data = await response.json();
            return { symbol, data };
          } catch (err) {
            console.error(`Error fetching quote for ${symbol}:`, err);
            return { symbol, data: null };
          }
        });

        const results = await Promise.all(quotePromises);
        const quotesMap: Record<string, StockQuote> = {};
        results.forEach(({ symbol, data }) => {
          if (data) quotesMap[symbol] = data;
        });
        setQuotes(quotesMap);
      } catch (err) {
        console.error("Error fetching quotes:", err);
      } finally {
        setLoadingQuotes(false);
      }
    };

    fetchQuotes();
    // Refresh quotes every 30 seconds
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, [alerts]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Alerts</h2>
          <AlertCommand />
        </div>
        <div className="flex items-center justify-center h-40">
          <Spinner className="size-8 text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 md:px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Alerts</h2>
        <AlertCommand />
      </div>

      {!alerts || alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-lg border border-gray-700">
          <Icon name="Bell" className="size-12 text-gray-600 mb-3" />
          <p className="text-gray-400 text-lg mb-4">No alerts set up yet</p>
          <p className="text-gray-500 text-sm mb-4">
            Create price or volume alerts to stay informed
          </p>
          <AlertCommand />
        </div>
      ) : (
        <div className="space-y-4 max-h-[800px] bg-gray-800 overflow-y-auto p-4 rounded-lg">
          {alerts.map((alert) => {
            const symbol = parseStockSymbol(alert.stockIdentifier);
            const companyName = parseCompanyName(alert.stockIdentifier);
            const quote = quotes[symbol];
            const isPositive = quote ? quote.dp >= 0 : false;
            const currentPrice = quote?.c;
            const percentChange = quote?.dp;

            return (
              <div
                key={alert._id}
                className="bg-gray-700 rounded-lg p-3 border transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Stock Info */}
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                      <Icon
                        name="TrendingUp"
                        className="size-6 text-yellow-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{companyName}</h3>
                      <p className="text-sm text-gray-400">
                        {loadingQuotes || !currentPrice
                          ? "Loading..."
                          : `$${currentPrice.toFixed(2)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-gray-300">
                        {symbol}
                      </p>
                      {loadingQuotes || !percentChange ? (
                        <p className="text-sm text-gray-500">-</p>
                      ) : (
                        <p
                          className={`text-sm font-semibold ${
                            isPositive ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {percentChange.toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-px w-full border my-4 border-gray-600" />
                {/* Alert Details */}
                <div className="flex flex-col ">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Alert:</span>
                    <div className="flex items-center gap-2">
                      <AlertCommand alert={alert} />
                      <button
                        onClick={() => handleDelete(alert._id!)}
                        disabled={deleteAlert.isPending}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                        title="Delete alert"
                        aria-label="Delete alert"
                      >
                        <Icon name="Trash2" className="size-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white font-mono text-sm">
                      {alert.type === "price" ? "Price" : "Volume"}{" "}
                      {getConditionSymbol(alert.condition)} $
                      {alert.threshold.toFixed(2)}
                    </span>
                    {/* Frequency Badge */}

                    <span className="inline-block mt-1 px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-md border border-yellow-500/30">
                      {formatFrequency(alert.frequency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertList;
