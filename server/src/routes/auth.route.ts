import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { authorizeWithDbCheck } from "../middlewares/authorizeWithDbCheck.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
  updateUserRoleSchema,
  toggleUserStatusSchema,
} from "../schemas/auth.schema";
import { Role } from "@/generated/prisma/enums";

const authRouter: Router = Router();

authRouter.post("/signup", validate(signupSchema), authController.signup);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refresh
);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/me", authenticate, authController.me);
authRouter.get(
  "/users",
  authenticate,
  authorizeWithDbCheck([Role.ADMIN]),
  authController.getAllUsers
);
authRouter.get(
  "/users/role/:role",
  authenticate,
  authorizeWithDbCheck([Role.ADMIN]),
  authController.getUsersByRole
);
authRouter.get(
  "/users/:userId",
  authenticate,
  authorizeWithDbCheck([Role.ADMIN, Role.MENTOR, Role.ADVISOR]),
  authController.getUserById
);
authRouter.patch(
  "/users/:userId/role",
  authenticate,
  authorizeWithDbCheck([Role.ADMIN]),
  validate(updateUserRoleSchema),
  authController.updateUserRole
);
authRouter.patch(
  "/users/:userId/status",
  authenticate,
  authorizeWithDbCheck([Role.ADMIN]),
  validate(toggleUserStatusSchema),
  authController.toggleUserStatus
);

export default authRouter;
