import { Request, Response } from "express";
import * as passwordResetService from "@/services/passwordReset.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername } = req.body;

    await passwordResetService.requestPasswordReset(emailOrUsername);

    return successResponse(
      res,
      null,
      "If an account exists with that email address, a password reset link has been sent"
    );
  } catch (error: any) {
    logger.error("Error requesting password reset:", error);
    return errorResponse(res, "Failed to process password reset request", 500);
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const { isValid, userId } = await passwordResetService.verifyResetToken(
      token
    );

    if (!isValid) {
      return errorResponse(res, "Invalid or expired reset token", 400);
    }

    return successResponse(res, { isValid, userId }, "Token is valid");
  } catch (error: any) {
    logger.error("Error verifying reset token:", error);
    return errorResponse(res, "Failed to verify reset token", 500);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    await passwordResetService.resetPassword(token, newPassword);

    return successResponse(
      res,
      null,
      "Password has been reset successfully. You can now log in with your new password."
    );
  } catch (error: any) {
    logger.error("Error resetting password:", error);

    if (error.message?.includes("Invalid or expired")) {
      return errorResponse(res, error.message, 400);
    }

    return errorResponse(res, "Failed to reset password", 500);
  }
};
