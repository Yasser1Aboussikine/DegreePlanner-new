import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as chatService from "../services/chat.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import logger from "../config/logger";

/**
 * Get or create mentor group chat
 * GET /api/chat/mentor-group
 */
export const getMentorGroupChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const thread = await chatService.getOrCreateMentorGroupThread(
      req.user.userId
    );

    sendSuccess(res, 200, "Mentor group chat retrieved", thread);
  } catch (error) {
    logger.error("Error getting mentor group chat:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get group chat";
    sendError(res, 500, message);
  }
};

/**
 * Get all chat threads for current user
 * GET /api/chat/threads
 */
export const getUserThreads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const threads = await chatService.getUserChatThreads(req.user.userId);

    sendSuccess(res, 200, "Chat threads retrieved", threads);
  } catch (error) {
    logger.error("Error getting user threads:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get threads";
    sendError(res, 500, message);
  }
};

/**
 * Get messages for a thread
 * GET /api/chat/threads/:threadId/messages
 */
export const getThreadMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const { threadId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const messages = await chatService.getThreadMessages(threadId, limit, skip);

    sendSuccess(res, 200, "Messages retrieved", messages);
  } catch (error) {
    logger.error("Error getting thread messages:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get messages";
    sendError(res, 500, message);
  }
};

/**
 * Send a message
 * POST /api/chat/threads/:threadId/messages
 */
export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const { threadId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      sendError(res, 400, "Message content is required");
      return;
    }

    const message = await chatService.sendMessage(
      threadId,
      req.user.userId,
      content
    );

    sendSuccess(res, 201, "Message sent", message);
  } catch (error) {
    logger.error("Error sending message:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send message";
    sendError(res, 500, message);
  }
};

/**
 * Mark messages as read (HTTP endpoint - deprecated, use Socket.IO events instead)
 * PUT /api/chat/threads/:threadId/read
 */
export const markAsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const { threadId } = req.params;
    const { messageIds } = req.body; // Expect messageIds in request body

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      sendError(res, 400, "messageIds array is required");
      return;
    }

    const result = await chatService.markMessagesAsRead(
      messageIds,
      req.user.userId
    );

    logger.info(
      `User ${req.user.userId} marked ${result.updatedCount} messages as read via HTTP in thread ${threadId}`
    );

    sendSuccess(res, 200, "Messages marked as read", {
      updatedCount: result.updatedCount,
    });
  } catch (error) {
    logger.error("Error marking messages as read:", error);
    const message =
      error instanceof Error ? error.message : "Failed to mark as read";
    sendError(res, 500, message);
  }
};

/**
 * Get unread message count
 * GET /api/chat/unread-count
 */
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const count = await chatService.getUnreadCount(req.user.userId);

    sendSuccess(res, 200, "Unread count retrieved", { count });
  } catch (error) {
    logger.error("Error getting unread count:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get unread count";
    sendError(res, 500, message);
  }
};
