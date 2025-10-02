"use client";
import { useEffect, useMemo, useState } from "react";
import { Button, Icon, Shad } from "./ui";
import Link from "next/link";
import _ from "lodash";
import { searchStocks } from "@/lib/finnhub";
import { useStockStore } from "@/store/useStock";

const SearchCommand = ({
  renderAs = "button",
  label = "Add  stock",
}: SearchCommandProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { stocks, setStocks, fetchStocks } = useStockStore();
  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks.slice(0, 10);

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
          className="rounded-lg absolute top-1/4 2xl:top-1/4  left-1/2 -translate-x-1/2 w-full"
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
                        <div className="rounded-full bg-gray-700/85 p-2">
                          <Icon
                            name={"Star"}
                            className={`size-6 ${
                              stock.isInWatchlist
                                ? "text-yellow-500 fill-yellow-500 "
                                : "text-gray-400"
                            }`}
                          />
                        </div>
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
