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
    const {
      email,
      password,
      name,
      role = Role.STUDENT,
      major,
      minor,
      classification,
      isFYEStudent,
      joinDate,
      expectedGraduation,
    } = req.body;

    const result = await authService.signup({
      email,
      password,
      name,
      role,
      major,
      minor,
      classification,
      isFYEStudent,
      joinDate,
      expectedGraduation,
    });

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

export const getUsersByRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.params;

    const users = await authService.getUsersByRole(role);

    sendSuccess(
      res,
      200,
      `Users with role ${role} retrieved successfully`,
      users
    );
  } catch (error) {
    logger.error("Get users by role error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get users";
    sendError(res, 500, message);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await authService.getUserById(userId);

    sendSuccess(res, 200, "User retrieved successfully", user);
  } catch (error) {
    logger.error("Get user by ID error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get user";
    sendError(res, 404, message);
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { role, search, page, limit } = req.query;

    const result = await authService.getAllUsers({
      role: role as string | undefined,
      search: search as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    sendSuccess(res, 200, "Users retrieved successfully", result);
  } catch (error) {
    logger.error("Get all users error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get users";
    sendError(res, 500, message);
  }
};

export const updateUserRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const currentUserId = req.user?.userId;

    const user = await authService.updateUserRole(userId, role, currentUserId);

    sendSuccess(res, 200, "User role updated successfully", user);
  } catch (error) {
    logger.error("Update user role error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update user role";
    sendError(res, 400, message);
  }
};

export const toggleUserStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.userId;

    const user = await authService.toggleUserStatus(userId, currentUserId);

    sendSuccess(res, 200, "User status updated successfully", user);
  } catch (error) {
    logger.error("Toggle user status error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update user status";
    sendError(res, 400, message);
  }
};

export const updatePersonalInfo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const { name, email } = req.body;

    const user = await authService.updatePersonalInfo(req.user.userId, {
      name,
      email,
    });

    sendSuccess(res, 200, "Personal information updated successfully", user);
  } catch (error) {
    logger.error("Update personal info error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update personal information";
    sendError(res, 400, message);
  }
};

export const updateUserClassification = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { classification } = req.body;

    const user = await authService.updateUserClassification(userId, classification);

    sendSuccess(res, 200, "User classification updated successfully", user);
  } catch (error) {
    logger.error("Update user classification error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update user classification";
    sendError(res, 400, message);
  }
};
