import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { sendError } from "../utils/apiResponse";
import prisma from "../config/prisma";
import logger from "../config/logger";

export const authorizeWithDbCheck = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 401, "Authentication required");
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { role: true, isActive: true },
      });

      if (!user) {
        sendError(res, 401, "User not found");
        return;
      }

      if (!user.isActive) {
        sendError(res, 403, "Account is inactive");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        logger.warn(
          `Role mismatch for user ${req.user.userId}: JWT has ${req.user.role}, DB has ${user.role}`
        );
        sendError(
          res,
          403,
          `Access forbidden. Your role has been changed. Please log out and log back in. Required roles: ${allowedRoles.join(", ")}`
        );
        return;
      }

      if (req.user.role !== user.role) {
        logger.warn(
          `JWT role (${req.user.role}) does not match database role (${user.role}) for user ${req.user.userId}`
        );
      }

      next();
    } catch (error) {
      logger.error("Database authorization check failed:", error);
      sendError(res, 500, "Authorization check failed");
    }
  };
};

export const requireAdminWithDbCheck = authorizeWithDbCheck(["ADMIN"]);
export const requireAdminOrAdvisorWithDbCheck = authorizeWithDbCheck(["ADMIN", "ADVISOR"]);
export const requireAdminOrRegistrarWithDbCheck = authorizeWithDbCheck(["ADMIN", "REGISTRAR"]);
export const requireAdminOrAdvisorOrMentorWithDbCheck = authorizeWithDbCheck([
  "ADMIN",
  "ADVISOR",
  "MENTOR",
]);
