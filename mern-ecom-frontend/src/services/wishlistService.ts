import api from "./axiosInstance";
import { Product } from "../types/types";

export interface WishlistResponse {
    success: boolean;
    wishlist: Product[];
}

export const fetchWishlist = (userId: string) =>
    api.get<WishlistResponse>(`/wishlist/${userId}`).then((r) => r.data);

export const addToWishlistApi = (userId: string, productId: string) =>
    api.post(`/wishlist/${userId}/${productId}`).then((r) => r.data);

export const removeFromWishlistApi = (userId: string, productId: string) =>
    api.delete(`/wishlist/${userId}/${productId}`).then((r) => r.data);
