export const watchlistApi = {
  addWatchlist: async ({
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
  removeFromWatchlist: async (symbol: string) => {
    const response = await fetch(`/api/watchlist/${symbol}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to remove from watchlist");
    }

    return response.json();
  },
};
