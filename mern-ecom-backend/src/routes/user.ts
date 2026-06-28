import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { newUserSchema } from "../schemas/index.js";

const app = express.Router();

app.post("/new", validate(newUserSchema), newUser);
app.get("/all", adminOnly, getAllUsers);
app.route("/:id")
    .get(getUser)
    .delete(adminOnly, deleteUser);

export default app;