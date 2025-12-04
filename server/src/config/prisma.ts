import { prisma } from "../lib/prisma";
import logger from "./logger";

export const connectPrisma = async () => {
  try {
    await prisma.$connect();
    logger.info("Prisma connected to database");
  } catch (error) {
    logger.error("Prisma connection failed:", error);
    throw error;
  }
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
  logger.info("Prisma disconnected");
};

export default prisma;
