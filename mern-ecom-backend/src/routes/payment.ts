import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon, stripeWebhook } from "../controllers/payment.js";
import { validate } from "../middlewares/validate.js";
import { newCouponSchema, paymentIntentSchema } from "../schemas/index.js";

const app = express.Router();

// Stripe webhook — must use raw body, so placed before express.json()
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.post("/create", validate(paymentIntentSchema), createPaymentIntent);

app.post("/coupon/new", adminOnly, validate(newCouponSchema), newCoupon);
app.get("/coupon/all", adminOnly, allCoupons);
app.delete("/coupon/:id", adminOnly, deleteCoupon);

app.get("/discount", applyDiscount);

export default app;

