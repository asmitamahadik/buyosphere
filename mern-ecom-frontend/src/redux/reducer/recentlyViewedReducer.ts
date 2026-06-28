import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/types";

const STORAGE_KEY = "byo_recently_viewed";
const MAX_ITEMS = 10;

const loadFromStorage = (): Product[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
        return [];
    }
};

const saveToStorage = (items: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

interface RecentlyViewedState {
    items: Product[];
}

const initialState: RecentlyViewedState = { items: loadFromStorage() };

const recentlyViewedSlice = createSlice({
    name: "recentlyViewed",
    initialState,
    reducers: {
        addRecentlyViewed: (state, action: PayloadAction<Product>) => {
            const filtered = state.items.filter((p) => p._id !== action.payload._id);
            const updated = [action.payload, ...filtered].slice(0, MAX_ITEMS);
            state.items = updated;
            saveToStorage(updated);
        },
        clearRecentlyViewed: (state) => {
            state.items = [];
            localStorage.removeItem(STORAGE_KEY);
        },
    },
});

export const { addRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export const recentlyViewedReducer = recentlyViewedSlice;
