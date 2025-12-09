import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/jwt";
import logger from "./logger";
import prisma from "./prisma";

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userName?: string;
}

let io: Server;
let connectionHandler: ((socket: AuthenticatedSocket) => void) | null = null;

export const initializeSocketIO = (httpServer: HttpServer): Server => {
  const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://your-frontend-domain.com"
      : "http://localhost:3000");

  io = new Server(httpServer, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;

      // Fetch and cache user name
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { name: true },
      });
      socket.userName = user?.name || "Unknown User";

      logger.info(`User ${socket.userId} authenticated via WebSocket`);
      next();
    } catch (error) {
      logger.error("WebSocket authentication error:", error);
      next(new Error("Invalid authentication token"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    logger.info(`Client connected: ${socket.id}, User: ${socket.userId}`);

    // Join user to their personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Call additional handlers if registered
    if (connectionHandler) {
      connectionHandler(socket);
    }

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}, User: ${socket.userId}`);
    });
  });

  return io;
};

export const registerConnectionHandler = (
  handler: (socket: AuthenticatedSocket) => void
) => {
  connectionHandler = handler;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.IO not initialized. Call initializeSocketIO first."
    );
  }
  return io;
};
