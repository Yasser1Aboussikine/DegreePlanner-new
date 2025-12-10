import { Request, Response } from "express";
import { sendPasswordResetEmail } from "@/services/email.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";
import nodemailer from "nodemailer";

export const testEmailConfig = async (req: Request, res: Response) => {
  try {
    const smtpConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    const configInfo = {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      hasUser: !!smtpConfig.auth.user,
      hasPass: !!smtpConfig.auth.pass,
      userValue: smtpConfig.auth.user,
      passLength: smtpConfig.auth.pass?.length || 0,
      frontendUrl: process.env.FRONTEND_URL,
    };

    logger.info("SMTP Configuration check:", configInfo);

    const transporter = nodemailer.createTransport(smtpConfig);

    logger.info("Testing SMTP connection...");
    await transporter.verify();
    logger.info("SMTP connection verified successfully");

    return successResponse(
      res,
      configInfo,
      "SMTP configuration is valid and connection successful"
    );
  } catch (error: any) {
    logger.error("SMTP configuration test failed:", error);
    return errorResponse(
      res,
      `SMTP test failed: ${error.message}`,
      500
    );
  }
};

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
