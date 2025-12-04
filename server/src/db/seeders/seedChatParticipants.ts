import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";

interface ChatParticipantSeedData {
  id: string;
  threadId: string;
  userId: string;
  joinedAt: string;
  lastReadAt: string | null;
}

export async function seedChatParticipants() {
  logger.info("Seeding chat participants into PostgreSQL...");
  console.log("➡️  Starting chat participant seeding...");

  try {
    const dataPath = path.join(__dirname, "../seeds/chatParticipants.json");
    console.log("📄 Loading chat participants JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const participants = JSON.parse(raw) as ChatParticipantSeedData[];

    console.log(`📦 Loaded: ${participants.length} chat participants`);
    logger.info(`Loaded ${participants.length} chat participants from JSON`);

    let participantCount = 0;

    for (const participant of participants) {
      participantCount++;

      await prisma.chatParticipant.upsert({
        where: { id: participant.id },
        update: {
          threadId: participant.threadId,
          userId: participant.userId,
          joinedAt: new Date(participant.joinedAt),
          lastReadAt: participant.lastReadAt
            ? new Date(participant.lastReadAt)
            : null,
        },
        create: {
          id: participant.id,
          threadId: participant.threadId,
          userId: participant.userId,
          joinedAt: new Date(participant.joinedAt),
          lastReadAt: participant.lastReadAt
            ? new Date(participant.lastReadAt)
            : null,
        },
      });

      if (participantCount % 3 === 0 || participantCount === participants.length) {
        console.log(
          `   → Inserted ${participantCount}/${participants.length} chat participants...`
        );
      }
    }

    console.log(
      `✅ Chat participant seeding complete (${participantCount} participants).`
    );
    logger.info("✓ Chat participant seeding completed!");
  } catch (error) {
    console.error("❌ Chat participant seeding failed:", error);
    logger.error("Chat participant seeding failed:", error);
    throw error;
  }
}
