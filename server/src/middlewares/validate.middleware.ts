import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/apiResponse";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const shape = (schema as any)._def?.shape;
      const shapeObj = typeof shape === "function" ? shape() : shape;

      // Check if schema has body, params, or query properties
      if (
        shapeObj &&
        ("params" in shapeObj || "query" in shapeObj || "body" in shapeObj)
      ) {
        // Schema expects { body, params, query } structure
        schema.parse({
          body: req.body,
          params: req.params,
          query: req.query,
        });
      } else {
        // Schema expects direct body content
        schema.parse(req.body);
      }
      next();
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || "Validation failed";
      const errorDetails = error.errors?.map((e: any) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      console.error("Validation error:", errorDetails || error);
      sendError(res, 400, errorMessage);
    }
  };
};
