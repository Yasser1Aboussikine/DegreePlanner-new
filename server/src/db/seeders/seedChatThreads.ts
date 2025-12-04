import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";
import { ChatThreadType } from "@/generated/prisma/client";

interface ChatThreadSeedData {
  id: string;
  type: ChatThreadType;
  title: string | null;
  mentorId: string | null;
  createdAt: string;
}

export async function seedChatThreads() {
  logger.info("Seeding chat threads into PostgreSQL...");
  console.log("➡️  Starting chat thread seeding...");

  try {
    const dataPath = path.join(__dirname, "../seeds/chatThreads.json");
    console.log("📄 Loading chat threads JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const threads = JSON.parse(raw) as ChatThreadSeedData[];

    console.log(`📦 Loaded: ${threads.length} chat threads`);
    logger.info(`Loaded ${threads.length} chat threads from JSON`);

    let threadCount = 0;

    for (const thread of threads) {
      threadCount++;

      await prisma.chatThread.upsert({
        where: { id: thread.id },
        update: {
          type: thread.type,
          title: thread.title,
          mentorId: thread.mentorId,
          createdAt: new Date(thread.createdAt),
        },
        create: {
          id: thread.id,
          type: thread.type,
          title: thread.title,
          mentorId: thread.mentorId,
          createdAt: new Date(thread.createdAt),
        },
      });

      if (threadCount % 3 === 0 || threadCount === threads.length) {
        console.log(
          `   → Inserted ${threadCount}/${threads.length} chat threads...`
        );
      }
    }

    console.log(`✅ Chat thread seeding complete (${threadCount} threads).`);
    logger.info("✓ Chat thread seeding completed!");
  } catch (error) {
    console.error("❌ Chat thread seeding failed:", error);
    logger.error("Chat thread seeding failed:", error);
    throw error;
  }
}
