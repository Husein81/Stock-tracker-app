"use client";
import { Button, Icon, Shad } from "./ui";
import {
  useWatchlist,
  useRemoveFromWatchlist,
  useGetQuotes,
} from "@/hooks/useWatchlist";
import Link from "next/link";
import { toast } from "sonner";
import AlertCommand from "./alert-command";

const WatchlistTable = () => {
  const { data: watchlistData, isLoading, error } = useWatchlist();
  const { data, isLoading: loadingQuotes } = useGetQuotes(
    watchlistData?.data ?? []
  );
  const removeFromWatchlist = useRemoveFromWatchlist();

  const quotes = data?.quotesMap ?? {};

  const metrics = data?.metricsMap ?? {};

  const header: string[] = [
    "",
    "Company",
    "Symbol",
    "Price",
    "Change",
    "Market Cap",
    "P/E Ratio",
    "Alert",
  ];

  const handleRemove = async (symbol: string) => {
    try {
      await removeFromWatchlist.mutateAsync(symbol);
      toast.success(`${symbol} removed from watchlist`);
    } catch (err) {
      toast.error("Failed to remove from watchlist");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${formatPrice(change).replace("$", "")}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1_000_000_000) {
      return `$${(cap / 1_000_000_000).toFixed(2)}B`;
    } else if (cap >= 1_000_000) {
      return `$${(cap / 1_000_000).toFixed(2)}M`;
    } else if (cap >= 1_000) {
      return `$${(cap / 1_000).toFixed(2)}K`;
    }
    return `$${cap}`;
  };

  const formatPERatio = (peRatio: number | undefined) => {
    if (!peRatio || peRatio <= 0) return "N/A";
    return peRatio.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">My Watchlist</h2>
        </div>
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">My Watchlist</h2>
        </div>
        <div className="flex items-center justify-center h-40">
          <p className="text-red-400">Error loading watchlist</p>
        </div>
      </div>
    );
  }

  const watchlistItems = watchlistData?.data || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">
          My Watchlist{" "}
          {watchlistItems.length > 0 && `(${watchlistItems.length})`}
        </h2>
      </div>

      {watchlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 bg-gray-800 rounded-lg border border-gray-700">
          <Icon name="Star" className="size-12 text-gray-600 mb-2" />
          <p className="text-gray-400 mb-4">Your watchlist is empty</p>
        </div>
      ) : (
        <div>
          <Shad.Table className="rounded-lg overflow-hidden md:max-h-[600px]">
            <Shad.TableHeader>
              <Shad.TableRow className="bg-gray-700 hover:bg-gray-700 rounded-lg">
                {header.map((title) => (
                  <Shad.TableHead key={title} className="text-center">
                    {title}
                  </Shad.TableHead>
                ))}
              </Shad.TableRow>
            </Shad.TableHeader>
            <Shad.TableBody>
              {watchlistItems.map((item) => {
                const quote = quotes[item.symbol];
                const isPositive = quote ? quote.d >= 0 : true;

                return (
                  <Shad.TableRow
                    key={item._id}
                    className="bg-gray-800 hover:bg-gray-800/75"
                  >
                    <Shad.TableCell className="text-center">
                      <button
                        onClick={() => handleRemove(item.symbol)}
                        className="transition-colors hover:text-red-500"
                        disabled={removeFromWatchlist.isPending}
                        title={`Remove ${item.symbol} from watchlist`}
                        aria-label={`Remove ${item.symbol} from watchlist`}
                      >
                        <Icon
                          name="Star"
                          onClick={() => handleRemove(item.symbol)}
                          className="fill-current size-5 text-yellow-500"
                        />
                      </button>
                    </Shad.TableCell>
                    <Shad.TableCell className="font-medium">
                      <Link
                        href={`/stocks/${item.symbol}`}
                        className="hover:text-yellow-500 transition-colors"
                      >
                        {item.company}
                      </Link>
                    </Shad.TableCell>
                    <Shad.TableCell className="text-center">
                      <Link
                        href={`/stocks/${item.symbol}`}
                        className="font-mono hover:text-yellow-500 transition-colors"
                      >
                        {item.symbol}
                      </Link>
                    </Shad.TableCell>
                    <Shad.TableCell className="text-center">
                      {loadingQuotes || !quote ? (
                        <span className="text-gray-500">Loading...</span>
                      ) : (
                        <span className="font-mono">
                          {formatPrice(quote.c)}
                        </span>
                      )}
                    </Shad.TableCell>
                    <Shad.TableCell
                      className={`text-center ${
                        isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {loadingQuotes || !quote ? (
                        <span className="text-gray-500">-</span>
                      ) : (
                        <span className="font-mono">
                          {formatChange(quote.d)}
                        </span>
                      )}
                    </Shad.TableCell>
                    <Shad.TableCell className="text-center">
                      {loadingQuotes || !metrics[item.symbol] ? (
                        <span className="text-gray-500">-</span>
                      ) : (
                        <span className="font-mono">
                          {formatMarketCap(
                            metrics[item.symbol].marketCapitalization || 0
                          )}
                        </span>
                      )}
                    </Shad.TableCell>
                    <Shad.TableCell className="text-center">
                      {loadingQuotes || !metrics[item.symbol] ? (
                        <span className="text-gray-500">-</span>
                      ) : (
                        <span className="font-mono">
                          {formatPERatio(
                            metrics[item.symbol].peBasicExclExtraTTM
                          )}
                        </span>
                      )}
                    </Shad.TableCell>
                    <Shad.TableCell className="text-center w-[120px]">
                      <AlertCommand watchlist={item} />
                    </Shad.TableCell>
                  </Shad.TableRow>
                );
              })}
            </Shad.TableBody>
          </Shad.Table>
        </div>
      )}
    </div>
  );
};

export default WatchlistTable;
