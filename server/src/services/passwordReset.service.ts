import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./email.service";
import { sendResendEmail } from "./resendEmail.service";
import logger from "@/config/logger";

const RESET_TOKEN_EXPIRY_HOURS = 24;

export const requestPasswordReset = async (
  emailOrUsername: string
): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: {
      email: emailOrUsername,
    },
  });

  if (!user) {
    logger.warn(
      `Password reset requested for non-existent user: ${emailOrUsername}`
    );
    return;
  }

  const rawToken = crypto.randomUUID();
  const hashedToken = await bcrypt.hash(rawToken, 10);

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_EXPIRY_HOURS);

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      usedAt: null,
    },
  });

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt,
    },
  });

  if (process.env.NODE_ENV === "production") {
    sendResendEmail({
      to: user.email,
      subject: "Password Reset Request - Degree Planner",
      html: `<div style="font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
        <div style="margin-bottom: 32px;">
          <h1 style="color: #333333; font-size: 32px; font-weight: 400; margin: 0 0 24px 0; letter-spacing: -0.5px;">Reset Your Password</h1>
        </div>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 8px 0;">Hi ${
          user.name || user.email
        },</p>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Tap the button below to reset your account password.<br/>If you didn't request a new password, you can safely delete this email.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${
            process.env.FRONTEND_URL_PROD
          }/reset-password?token=${rawToken}" style="display: inline-block; background-color: #2E7D60; color: #ffffff; padding: 16px 48px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px; letter-spacing: 0.3px;">Reset Password</a>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 8px 0;">If that doesn't work, copy and paste the following link in your browser:</p>
        <p style="word-break: break-all; color: #6366f1; font-size: 14px; margin: 0 0 32px 0;">${
          process.env.FRONTEND_URL_PROD
        }/reset-password?token=${rawToken}</p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 0 0;"><strong>Note:</strong> This password reset link will expire in 24 hours.</p>
        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;"><p style="color: #333333; font-size: 14px; margin: 0;">The Degree Planner Team.</p></div>
      </div>`,
    }).catch((error) => {
      logger.error(
        `Failed to send password reset email to ${user.email} via Resend:`,
        error
      );
    });
  } else {
    sendPasswordResetEmail({
      email: user.email,
      name: user.name || user.email,
      resetToken: rawToken,
    }).catch((error) => {
      logger.error(
        `Failed to send password reset email to ${user.email}:`,
        error
      );
    });
  }

  logger.info(`Password reset token created for user: ${user.email}`);
};

export const verifyResetToken = async (
  token: string
): Promise<{ isValid: boolean; userId?: string }> => {
  const resetTokens = await prisma.passwordResetToken.findMany({
    where: {
      usedAt: null,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  for (const resetToken of resetTokens) {
    const isMatch = await bcrypt.compare(token, resetToken.token);
    if (isMatch) {
      return {
        isValid: true,
        userId: resetToken.userId,
      };
    }
  }

  return { isValid: false };
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const { isValid, userId } = await verifyResetToken(token);

  if (!isValid || !userId) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    }),
  ]);

  logger.info(`Password reset successfully for user ID: ${userId}`);
};
