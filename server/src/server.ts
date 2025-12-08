import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app";
import logger from "./config/logger";
import { initializeSocketIO } from "./config/socket";
import { initializeChatHandlers } from "./sockets/chat.handlers";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocketIO(httpServer);
logger.info("Socket.IO initialized");

// Initialize chat event handlers
initializeChatHandlers();
logger.info("Chat handlers initialized");

httpServer.listen(PORT, async () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
  logger.info("WebSocket server ready");
});
