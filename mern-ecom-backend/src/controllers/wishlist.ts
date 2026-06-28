import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";

export const getWishlist = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id).populate("wishlist");
    if (!user) return next(new ErrorHandler("User not found", 404));

    return res.status(200).json({ success: true, wishlist: user.wishlist });
});


export const addToWishlist = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.params;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", 404));

    const alreadyAdded = user.wishlist.some(
        (id: any) => id.toString() === productId
    );

    if (alreadyAdded) {
        return res.status(200).json({ success: true, message: "Already in wishlist" });
    }

    user.wishlist.push(productId as any);
    await user.save();

    return res.status(200).json({ success: true, message: "Added to wishlist" });
});


export const removeFromWishlist = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", 404));

    user.wishlist = user.wishlist.filter(
        (id: any) => id.toString() !== productId
    ) as any;

    await user.save();

    return res.status(200).json({ success: true, message: "Removed from wishlist" });
});
