import { Request, Response, NextFunction } from "express";
import * as minorService from "@/services/minor.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";

export async function getAllMinors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const minors = await minorService.getAllMinors();
    return successResponse(res, minors, "Minors retrieved successfully");
  } catch (error) {
    logger.error("Error fetching minors:", error);
    return errorResponse(res, "Failed to fetch minors", 500);
  }
}
