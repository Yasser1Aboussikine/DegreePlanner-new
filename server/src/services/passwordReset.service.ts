import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./email.service";
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
    logger.warn(`Password reset requested for non-existent user: ${emailOrUsername}`);
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

  await sendPasswordResetEmail({
    email: user.email,
    name: user.name || user.email,
    resetToken: rawToken,
  });

  logger.info(`Password reset email sent to user: ${user.email}`);
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
