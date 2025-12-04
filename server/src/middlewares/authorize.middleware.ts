import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { sendError } from "../utils/apiResponse";

/**
 * Middleware to authorize users based on their roles
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns Middleware function
 *
 * Usage:
 * router.get('/admin-only', authenticate, authorize(['ADMIN']), controller)
 * router.post('/admin-or-advisor', authenticate, authorize(['ADMIN', 'ADVISOR']), controller)
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        sendError(res, 401, "Authentication required");
        return;
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        sendError(
          res,
          403,
          `Access forbidden. Required roles: ${allowedRoles.join(", ")}`
        );
        return;
      }

      next();
    } catch (error) {
      sendError(res, 500, "Authorization check failed");
    }
  };
};

/**
 * Predefined role checkers for common use cases
 */
export const requireAdmin = authorize(["ADMIN"]);
export const requireAdminOrAdvisor = authorize(["ADMIN", "ADVISOR"]);
export const requireAdminOrRegistrar = authorize(["ADMIN", "REGISTRAR"]);
export const requireStudent = authorize(["STUDENT"]);
export const requireMentor = authorize(["MENTOR"]);
