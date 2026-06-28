import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order.js";
import { validate } from "../middlewares/validate.js";
import { newOrderSchema } from "../schemas/index.js";

const app = express.Router();

app.post("/new", validate(newOrderSchema), newOrder);
app.get("/my", myOrders);
app.get("/all", adminOnly, allOrders);
app.route("/:id")
    .get(getSingleOrder)
    .put(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);

export default app;