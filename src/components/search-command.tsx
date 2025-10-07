"use client";
import { useEffect, useMemo, useState } from "react";
import { Button, Icon, Shad } from "./ui";
import Link from "next/link";
import _ from "lodash";
import { searchStocks } from "@/lib/finnhub";
import { useStockStore } from "@/store/useStock";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/hooks/useWatchlist";
import { toast } from "sonner";

const SearchCommand = ({
  renderAs = "button",
  label = "Add  stock",
}: SearchCommandProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { stocks, setStocks, fetchStocks } = useStockStore();
  const { data: watchlistData } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const isSearchMode = !!searchTerm.trim();

  // Merge watchlist status with stocks
  const watchlistSymbols = useMemo(() => {
    return new Set(watchlistData?.data?.map((item) => item.symbol) || []);
  }, [watchlistData]);

  const displayStocks = useMemo(() => {
    const baseStocks = isSearchMode ? stocks : stocks.slice(0, 10);
    return baseStocks.map((stock) => ({
      ...stock,
      isInWatchlist: watchlistSymbols.has(stock.symbol),
    }));
  }, [stocks, isSearchMode, watchlistSymbols]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = async (term: string) => {
    try {
      const result = await searchStocks(term);
      setStocks(result);
    } catch (error) {
      setStocks([]);
    }
  };

  const debouncedSearch = useMemo(() => _.debounce(handleSearch, 300), []);

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    }

    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const handleToggleWatchlist = async (
    e: React.MouseEvent,
    stock: StockWithWatchlistStatus
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (stock.isInWatchlist) {
        await removeFromWatchlist.mutateAsync(stock.symbol);
        toast.success(`${stock.symbol} removed from watchlist`);
      } else {
        await addToWatchlist.mutateAsync({
          symbol: stock.symbol,
          company: stock.name,
        });
        toast.success(`${stock.symbol} added to watchlist`);
      }
    } catch (err) {
      toast.error(
        stock.isInWatchlist
          ? "Failed to remove from watchlist"
          : "Failed to add to watchlist"
      );
    }
  };

  return (
    <Shad.Popover>
      <Shad.PopoverTrigger asChild>
        {renderAs === "text" ? (
          <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="search-btn"
          >
            {label}
          </Button>
        )}
      </Shad.PopoverTrigger>
      <Shad.PopoverContent className="w-full max-w-md p-0 relative">
        <Shad.CommandDialog
          open={open}
          onOpenChange={setOpen}
          className="rounded-lg absolute top-1/9 md:top-1/6 xl:top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full"
        >
          <div className="search-field">
            <Shad.CommandInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder="Type a stock name or ticker..."
            />
          </div>
          <Shad.CommandList className="search-list scrollbar-hide-default">
            {displayStocks.length === 0 ? (
              <Shad.CommandEmpty className="search-list-empty">
                No results found.
              </Shad.CommandEmpty>
            ) : (
              <div>
                <div className="search-count">
                  {isSearchMode ? "Search results" : "Popular stocks"}
                  {` `}({displayStocks?.length || 0})
                </div>
                <ul>
                  {displayStocks.map((stock) => (
                    <li
                      key={stock.symbol}
                      onClick={handleSelectStock}
                      className="search-item"
                    >
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        className="search-item-link"
                      >
                        <Icon name="TrendingUp" className="icon" />
                        <div className="flex-1">
                          <div className="search-item-name">{stock.name}</div>
                          <div className="text-sm text-gray-500">
                            {stock.symbol} | {stock.exchange} | {stock.type}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleToggleWatchlist(e, stock)}
                          disabled={
                            addToWatchlist.isPending ||
                            removeFromWatchlist.isPending
                          }
                          className="rounded-full bg-gray-700/85 p-2 hover:bg-gray-600/85 transition-colors disabled:opacity-50"
                          title={
                            stock.isInWatchlist
                              ? `Remove ${stock.symbol} from watchlist`
                              : `Add ${stock.symbol} to watchlist`
                          }
                          aria-label={
                            stock.isInWatchlist
                              ? `Remove ${stock.symbol} from watchlist`
                              : `Add ${stock.symbol} to watchlist`
                          }
                        >
                          <Icon
                            name={"Star"}
                            className={`size-6 transition-colors ${
                              stock.isInWatchlist
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Shad.CommandList>
        </Shad.CommandDialog>
      </Shad.PopoverContent>
    </Shad.Popover>
  );
};
export default SearchCommand;
