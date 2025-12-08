import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get or create mentor group chat (mentor only)
router.get(
  "/mentor-group",
  authorize(["MENTOR"]),
  chatController.getMentorGroupChat
);

// Get all threads for current user
router.get("/threads", chatController.getUserThreads);

// Get messages for a specific thread
router.get("/threads/:threadId/messages", chatController.getThreadMessages);

// Send a message to a thread
router.post("/threads/:threadId/messages", chatController.sendMessage);

// Mark thread messages as read
router.put("/threads/:threadId/read", chatController.markAsRead);

// Get unread message count
router.get("/unread-count", chatController.getUnreadCount);

export default router;
