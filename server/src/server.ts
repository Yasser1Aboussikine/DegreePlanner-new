import dotenv from "dotenv";
import app from "./app";
import logger from "./config/logger";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Neo4j indexes on startup


app.listen(PORT, async () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);

  // Initialize database indexes
});
