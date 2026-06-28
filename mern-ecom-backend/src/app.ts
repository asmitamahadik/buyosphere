import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

// Importing Routes
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';
import orderRoute from './routes/orders.js';
import paymentRoute from './routes/payment.js';
import dashboardRoute from './routes/stats.js';
import reviewRoute from './routes/review.js';
import wishlistRoute from './routes/wishlist.js';

config({ path: "./.env" });

const port = process.env.PORT ?? 4000;
const mongo_uri = process.env.MONGO_URI ?? "";
const stripe_key = process.env.STRIPE_KEY ?? "";
const serverDomain = process.env.SERVER_DOMAIN ?? "";
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

if (!mongo_uri) throw new Error("MONGO_URI is required");
if (!stripe_key) throw new Error("STRIPE_KEY is required");

connectDB(mongo_uri);

export const stripe = new Stripe(stripe_key);
export const myCache = new NodeCache();

const app = express();

// Security headers
app.use(helmet());

// Restrict CORS to the known frontend origin
app.use(cors({
    origin: clientOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));

// Rate limiting — 100 req / 15 min per IP on auth-sensitive routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
});

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
    res.send("API working on '/api/v1'");
});

// Apply rate limiter to user-facing write routes
app.use("/api/v1/user", authLimiter, userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on ${serverDomain}`);
});