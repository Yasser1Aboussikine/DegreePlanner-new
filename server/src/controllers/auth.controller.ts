import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as authService from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import logger from "../config/logger";
import { Role } from "@/generated/prisma/enums";

export const signup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name, role=Role.STUDENT } = req.body;

    const result = await authService.signup({ email, password, name, role });

    sendSuccess(res, 201, "User created successfully", result);
  } catch (error) {
    logger.error("Signup error:", error);
    const message = error instanceof Error ? error.message : "Signup failed";
    sendError(res, 400, message);
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    sendSuccess(res, 200, "Login successful", result);
  } catch (error) {
    logger.error("Login error:", error);
    const message = error instanceof Error ? error.message : "Login failed";
    sendError(res, 401, message);
  }
};

export const refresh = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshTokens(refreshToken);

    sendSuccess(res, 200, "Tokens refreshed successfully", result);
  } catch (error) {
    logger.error("Refresh token error:", error);
    const message =
      error instanceof Error ? error.message : "Token refresh failed";
    sendError(res, 401, message);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  sendSuccess(res, 200, "Logout successful");
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const user = await authService.getUserById(req.user.userId);

    sendSuccess(res, 200, "User retrieved successfully", user);
  } catch (error) {
    logger.error("Get user error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get user";
    sendError(res, 404, message);
  }
};
