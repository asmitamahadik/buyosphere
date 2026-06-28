import { z } from "zod";

export const newUserSchema = z.object({
    _id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    photo: z.string().url("Photo must be a valid URL"),
    gender: z.enum(["male", "female", "others"]).optional(),
    dob: z.string().refine((d) => d === "" || !isNaN(Date.parse(d)), "Invalid date of birth").optional(),
    role: z.enum(["user", "admin"]).optional().default("user"),
});

export const newProductSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.coerce.number().positive("Price must be positive"),
    stock: z.coerce.number().int().nonnegative("Stock must be non-negative"),
    category: z.string().min(1, "Category is required"),
});

export const newOrderSchema = z.object({
    shippingInfo: z.object({
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        country: z.string().min(1),
        pinCode: z.union([z.string(), z.number()]),
    }),
    orderItems: z.array(
        z.object({
            name: z.string(),
            photo: z.string(),
            price: z.number().positive(),
            quantity: z.number().int().positive(),
            productId: z.string(),
        })
    ).min(1, "Order must have at least one item"),
    user: z.string().min(1, "User ID is required"),
    subTotal: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    shippingCharges: z.number().nonnegative(),
    discount: z.number().nonnegative(),
    total: z.number().positive(),
});

export const newCouponSchema = z.object({
    coupon: z.string().min(3, "Coupon must be at least 3 characters"),
    amount: z.number().positive("Discount amount must be positive"),
});

export const newReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1, "Comment is required").max(500),
    userId: z.string().min(1),
});

export const paymentIntentSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
});
