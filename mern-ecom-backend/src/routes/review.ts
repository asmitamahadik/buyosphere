import express from "express";
import { addReview, deleteReview, getReviews } from "../controllers/review.js";
import { validate } from "../middlewares/validate.js";
import { newReviewSchema } from "../schemas/index.js";

const app = express.Router();

// GET  /api/v1/review/:id        → all reviews for a product
// POST /api/v1/review/:id        → add/update review
// DELETE /api/v1/review/:id      → delete own review (?userId=)
app.route("/:id")
    .get(getReviews)
    .post(validate(newReviewSchema), addReview)
    .delete(deleteReview);

export default app;
