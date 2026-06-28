import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.js";

const app = express.Router();

// GET    /api/v1/wishlist/:id                  → get user's wishlist
// POST   /api/v1/wishlist/:id/:productId       → add product
// DELETE /api/v1/wishlist/:id/:productId       → remove product
app.get("/:id", getWishlist);
app.post("/:id/:productId", addToWishlist);
app.delete("/:id/:productId", removeFromWishlist);

export default app;
