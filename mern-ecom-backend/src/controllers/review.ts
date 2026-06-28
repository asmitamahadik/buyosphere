import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { invalidateCache } from "../utils/features.js";

export const addReview = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id: productId } = req.params;
    const { rating, comment, userId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    const existingIndex = product.reviews.findIndex(
        (r: any) => r.user.toString() === userId
    );

    if (existingIndex !== -1) {
        // Update existing review
        product.reviews[existingIndex].rating = rating;
        product.reviews[existingIndex].comment = comment;
    } else {
        product.reviews.push({ user: userId, rating, comment } as any);
    }

    const totalRating = product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    product.numOfReviews = product.reviews.length;
    product.ratings = Number((totalRating / product.numOfReviews).toFixed(1));

    await product.save();

    invalidateCache({ product: true, productId: String(product._id), admin: true });

    return res.status(200).json({
        success: true,
        message: existingIndex !== -1 ? "Review updated" : "Review added",
    });
});


export const getReviews = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id: productId } = req.params;

    const product = await Product.findById(productId).select("reviews ratings numOfReviews");
    if (!product) return next(new ErrorHandler("Product not found", 404));

    return res.status(200).json({
        success: true,
        reviews: product.reviews,
        ratings: product.ratings,
        numOfReviews: product.numOfReviews,
    });
});


export const deleteReview = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id: productId } = req.params;
    const { userId } = req.query;

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    product.reviews = product.reviews.filter((r: any) => r.user.toString() !== userId) as any;

    const totalRating = product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    product.numOfReviews = product.reviews.length;
    product.ratings = product.numOfReviews > 0
        ? Number((totalRating / product.numOfReviews).toFixed(1))
        : 0;

    await product.save();

    invalidateCache({ product: true, productId: String(product._id), admin: true });

    return res.status(200).json({ success: true, message: "Review deleted" });
});
