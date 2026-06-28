import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/** Validates req.body against a Zod schema and calls next() or returns 400. */
export const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const message = result.error.issues
                .map((e) => `${String(e.path.join("."))}: ${e.message}`)
                .join(", ");
            return res.status(400).json({ success: false, message });
        }
        req.body = result.data;
        return next();
    };
