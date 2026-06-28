import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: { type: String, required: true, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Product Name"],
        },
        photo: {
            type: String,
            required: [true, "Please upload photo"],
        },
        price: {
            type: Number,
            required: [true, "Please Enter Price"],
        },
        stock: {
            type: Number,
            required: [true, "Please Enter stock"],
        },
        category: {
            type: String,
            required: [true, "Please Enter Category"],
            trim: true,
        },
        reviews: [reviewSchema],
        ratings: {
            type: Number,
            default: 0,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Text index for full-text search on name and category
schema.index({ name: "text", category: "text" });
// Performance indexes
schema.index({ category: 1 });
schema.index({ price: 1 });
schema.index({ createdAt: -1 });

export const Product = mongoose.model("Product", schema);