import {
  registerConnectionHandler,
  AuthenticatedSocket,
  getIO,
} from "../config/socket";
import logger from "../config/logger";
import * as chatService from "../services/chat.service";

const registerChatHandlers = (socket: AuthenticatedSocket) => {
  // Join a chat thread room
  socket.on("thread:join", async (data: { threadId: string }) => {
    try {
      const { threadId } = data;
      logger.info(
        `[thread:join] 📥 Socket ${socket.id} requesting to join thread: ${threadId}, User: ${socket.userId}`
      );

      if (!socket.userId) {
        logger.warn(`[thread:join] ❌ No userId on socket ${socket.id}`);
        return;
      }

      // Verify user is a participant of this thread
      const threads = await chatService.getUserChatThreads(socket.userId);
      const thread = threads.find((t: any) => t.id === threadId);

      if (thread) {
        socket.join(`thread:${threadId}`);
        logger.info(
          `[thread:join] ✅ User ${socket.userId} (socket ${socket.id}) joined room: thread:${threadId}`
        );
        socket.emit("thread:joined", { threadId });
      } else {
        logger.warn(
          `[thread:join] ❌ User ${socket.userId} is not a participant of thread ${threadId}`
        );
        socket.emit("error", { message: "Not a participant of this thread" });
      }
    } catch (error) {
      logger.error("[thread:join] ❌ Error joining thread:", error);
      socket.emit("error", { message: "Failed to join thread" });
    }
  });

  // Leave a chat thread room
  socket.on("thread:leave", (data: { threadId: string }) => {
    socket.leave(`thread:${data.threadId}`);
    logger.info(`User ${socket.userId} left thread ${data.threadId}`);
  });

  // Send a message (real-time event)
  socket.on(
    "message:send",
    async (payload: { threadId: string; content: string }) => {
      try {
        if (!socket.userId) {
          socket.emit("error", { message: "Unauthorized" });
          return;
        }

        const { threadId, content } = payload;

        if (!content || content.trim() === "") {
          socket.emit("error", { message: "Message content is required" });
          return;
        }

        logger.info(
          `[message:send] User ${socket.userId} sending message to thread ${threadId}`
        );

        // Create message with status SENT
        const message = await chatService.sendMessage(
          threadId,
          socket.userId,
          content
        );

        // Broadcast to ALL participants in the thread (including sender)
        getIO().to(`thread:${threadId}`).emit("message:created", message);

        logger.info(
          `[message:created] Message ${message.id} broadcasted to thread ${threadId}`
        );
      } catch (error) {
        logger.error("[message:send] Error sending message:", error);
        socket.emit("error", {
          message:
            error instanceof Error ? error.message : "Failed to send message",
        });
      }
    }
  );

  // Mark messages as read (real-time event)
  socket.on(
    "message:read",
    async (data: { threadId: string; messageIds: string[] }) => {
      try {
        if (!socket.userId) return;

        const { threadId, messageIds } = data;

        logger.info(
          `[message:read] User ${socket.userId} marking ${messageIds.length} messages as read in thread ${threadId}`
        );

        // Update message statuses in database
        await chatService.markMessagesAsRead(messageIds, socket.userId);

        // Broadcast status update to ALL participants (including the reader for consistency)
        getIO().to(`thread:${threadId}`).emit("message:statusUpdated", {
          threadId,
          messageIds,
          status: "READ",
          readerId: socket.userId,
        });

        logger.info(
          `[message:statusUpdated] Status update broadcasted to thread ${threadId}`
        );
      } catch (error) {
        logger.error("[message:read] Error marking messages as read:", error);
      }
    }
  );

  // Typing indicator
  socket.on("typing:start", (data: { threadId: string }) => {
    if (!socket.userId) return;

    socket.to(`thread:${data.threadId}`).emit("user:typing", {
      threadId: data.threadId,
      userId: socket.userId,
      userName: socket.userName || "Unknown User",
      isTyping: true,
    });
  });

  socket.on("typing:stop", (data: { threadId: string }) => {
    if (!socket.userId) return;

    socket.to(`thread:${data.threadId}`).emit("user:typing", {
      threadId: data.threadId,
      userId: socket.userId,
      userName: socket.userName || "Unknown User",
      isTyping: false,
    });
  });
};

export const initializeChatHandlers = () => {
  registerConnectionHandler((socket: AuthenticatedSocket) => {
    registerChatHandlers(socket);
  });
};
