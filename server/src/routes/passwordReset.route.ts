import { Router } from "express";
import * as passwordResetController from "@/controllers/passwordReset.controller";
import { validate } from "@/middlewares/validate.middleware";
import * as passwordResetSchema from "@/schemas/passwordReset.schema";

const router: Router = Router();

router.post(
  "/request",
  validate(passwordResetSchema.requestPasswordResetSchema),
  passwordResetController.requestPasswordReset
);

router.post(
  "/verify",
  validate(passwordResetSchema.verifyResetTokenSchema),
  passwordResetController.verifyResetToken
);

router.post(
  "/reset",
  validate(passwordResetSchema.resetPasswordSchema),
  passwordResetController.resetPassword
);

export default router;
