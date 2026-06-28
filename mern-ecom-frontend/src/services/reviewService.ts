import api from "./axiosInstance";

export interface Review {
    _id: string;
    user: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewsResponse {
    success: boolean;
    reviews: Review[];
    ratings: number;
    numOfReviews: number;
}

export const fetchReviews = (productId: string) =>
    api.get<ReviewsResponse>(`/review/${productId}`).then((r) => r.data);

export const submitReview = (productId: string, payload: { rating: number; comment: string; userId: string }) =>
    api.post(`/review/${productId}`, payload).then((r) => r.data);

export const removeReview = (productId: string, userId: string) =>
    api.delete(`/review/${productId}?userId=${userId}`).then((r) => r.data);
