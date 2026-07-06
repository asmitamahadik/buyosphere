import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/types";
import { addToWishlistApi, fetchWishlist, removeFromWishlistApi } from "../../services/wishlistService";

interface WishlistState {
    items: Product[];
    loading: boolean;
}

const initialState: WishlistState = { items: [], loading: false };

export const loadWishlist = createAsyncThunk("wishlist/load", (userId: string) =>
    fetchWishlist(userId).then((r) => r.wishlist)
);

export const addWishlistItem = createAsyncThunk(
    "wishlist/add",
    ({ userId, product }: { userId: string; product: Product }) =>
        addToWishlistApi(userId, product._id).then(() => product)
);

export const removeWishlistItem = createAsyncThunk(
    "wishlist/remove",
    ({ userId, productId }: { userId: string; productId: string }) =>
        removeFromWishlistApi(userId, productId).then(() => productId)
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadWishlist.pending, (state) => { state.loading = true; })
            .addCase(loadWishlist.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(loadWishlist.rejected, (state) => { state.loading = false; })

            .addCase(addWishlistItem.fulfilled, (state, action: PayloadAction<Product>) => {
                if (!state.items.find((p) => p._id === action.payload._id)) {
                    state.items.push(action.payload);
                }
            })

            .addCase(removeWishlistItem.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter((p) => p._id !== action.payload);
            });
    },
});

export const wishlistReducer = wishlistSlice;
