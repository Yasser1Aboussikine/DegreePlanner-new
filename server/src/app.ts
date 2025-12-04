import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./routes";
import neo4jConnection from "./config/neo4j";
import { connectPrisma, disconnectPrisma } from "./config/prisma";
import logger from "./config/logger";

const app: Express = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Disable caching in development
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
  });
}

app.use("/api", apiRouter);
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use((req, res) => {
  logger.error(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found", path: req.url });
});

neo4jConnection
  .verifyConnectivity()
  .then(() => logger.info("Neo4j connected"))
  .catch((err) => logger.error("Neo4j connection failed:", err));

connectPrisma().catch((err: any) => {
  logger.error("Failed to connect Prisma:", err);
});

process.on("SIGINT", async () => {
  await neo4jConnection.close();
  await disconnectPrisma();
  process.exit(0);
});

export default app;
