import { searchStocks } from "@/lib/finnhub";
import { create } from "zustand";

type State = {
  stocks: StockWithWatchlistStatus[];
};

type Action = {
  setStocks: (stocks: StockWithWatchlistStatus[]) => void;
  fetchStocks: (query?: string) => Promise<void>;
};

const initialState: State = {
  stocks: [],
};
export const useStockStore = create<State & Action>((set) => ({
  ...initialState,
  setStocks: (stocks) => set({ stocks }),
  fetchStocks: async (query?: string) => {
    try {
      const result = await searchStocks(query);
      set({ stocks: result });
    } catch (error) {
      set({ stocks: [] });
    }
  },
}));
