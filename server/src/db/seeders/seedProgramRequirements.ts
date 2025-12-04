import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";
import { Category } from "@/generated/prisma/client";

interface ProgramRequirementSeedData {
  id: string;
  programId: string;
  category: Category;
  credits: number;
}

export async function seedProgramRequirements() {
  logger.info("Seeding program requirements into PostgreSQL...");
  console.log("➡️  Starting program requirements seeding...");

  try {
    const dataPath = path.join(__dirname, "../seeds/programRequirements.json");
    console.log("📄 Loading program requirements JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const requirements = JSON.parse(raw) as ProgramRequirementSeedData[];

    console.log(`📦 Loaded: ${requirements.length} program requirements`);
    logger.info(`Loaded ${requirements.length} program requirements from JSON`);

    let requirementCount = 0;

    for (const requirement of requirements) {
      requirementCount++;

      await prisma.programRequirement.upsert({
        where: { id: requirement.id },
        update: {
          programId: requirement.programId,
          category: requirement.category,
          credits: requirement.credits,
        },
        create: {
          id: requirement.id,
          programId: requirement.programId,
          category: requirement.category,
          credits: requirement.credits,
        },
      });

      console.log(
        `   → Inserted ${requirementCount}/${requirements.length} requirements...`
      );
    }

    console.log(
      `✅ Program requirements seeding complete (${requirementCount} requirements).`
    );
    logger.info("✓ Program requirements seeding completed!");
  } catch (error) {
    console.error("❌ Program requirements seeding failed:", error);
    logger.error("Program requirements seeding failed:", error);
    throw error;
  }
}
