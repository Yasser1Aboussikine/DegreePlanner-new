import { Request, Response } from "express";
import { sendPasswordResetEmail } from "@/services/email.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";

export const testEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email is required", 400);
    }

    logger.info(`Testing email configuration by sending to: ${email}`);

    await sendPasswordResetEmail({
      email,
      name: "Test User",
      resetToken: "test-token-12345",
    });

    return successResponse(res, null, "Test email sent successfully. Check your inbox.");
  } catch (error: any) {
    logger.error("Email test failed:", error);
    return errorResponse(
      res,
      `Failed to send test email: ${error.message}`,
      500
    );
  }
};
