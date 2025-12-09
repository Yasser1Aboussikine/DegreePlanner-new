import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";

interface MessageSeedData {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  status?: "SENT" | "DELIVERED" | "READ";
}

export async function seedMessages() {
  logger.info("Seeding messages into PostgreSQL...");
  console.log("➡️  Starting message seeding...");

  try {
    const dataPath = path.join(__dirname, "../seeds/messages.json");
    console.log("📄 Loading messages JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const messages = JSON.parse(raw) as MessageSeedData[];

    console.log(`📦 Loaded: ${messages.length} messages`);
    logger.info(`Loaded ${messages.length} messages from JSON`);

    let messageCount = 0;

    for (const message of messages) {
      messageCount++;

      await prisma.message.upsert({
        where: { id: message.id },
        update: {
          threadId: message.threadId,
          senderId: message.senderId,
          content: message.content,
          sentAt: new Date(message.sentAt),
          status: message.status || (message.isRead ? "READ" : "SENT"),
        },
        create: {
          id: message.id,
          threadId: message.threadId,
          senderId: message.senderId,
          content: message.content,
          sentAt: new Date(message.sentAt),
          status: message.status || (message.isRead ? "READ" : "SENT"),
        },
      });

      if (messageCount % 5 === 0 || messageCount === messages.length) {
        console.log(
          `   → Inserted ${messageCount}/${messages.length} messages...`
        );
      }
    }

    console.log(`✅ Message seeding complete (${messageCount} messages).`);
    logger.info("✓ Message seeding completed!");
  } catch (error) {
    console.error("❌ Message seeding failed:", error);
    logger.error("Message seeding failed:", error);
    throw error;
  }
}
