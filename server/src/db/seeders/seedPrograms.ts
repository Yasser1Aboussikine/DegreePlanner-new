import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";
import { DegreeLevel } from "@/generated/prisma/client";

interface ProgramSeedData {
  id: string;
  code: string;
  name: string;
  level: DegreeLevel;
  totalCredits: number;
  isActive: boolean;
}

export async function seedPrograms() {
  logger.info("Seeding programs into PostgreSQL...");
  console.log("➡️  Starting program seeding...");

  try {
    const dataPath = path.join(__dirname, "../seeds/programs.json");
    console.log("📄 Loading programs JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const programs = JSON.parse(raw) as ProgramSeedData[];

    console.log(`📦 Loaded: ${programs.length} programs`);
    logger.info(`Loaded ${programs.length} programs from JSON`);

    let programCount = 0;

    for (const program of programs) {
      programCount++;

      await prisma.program.upsert({
        where: { id: program.id },
        update: {
          code: program.code,
          name: program.name,
          level: program.level,
          totalCredits: program.totalCredits,
          isActive: program.isActive,
        },
        create: {
          id: program.id,
          code: program.code,
          name: program.name,
          level: program.level,
          totalCredits: program.totalCredits,
          isActive: program.isActive,
        },
      });

      console.log(
        `   → Inserted ${programCount}/${programs.length} programs...`
      );
    }

    console.log(`✅ Program seeding complete (${programCount} programs).`);
    logger.info("✓ Program seeding completed!");
  } catch (error) {
    console.error("❌ Program seeding failed:", error);
    logger.error("Program seeding failed:", error);
    throw error;
  }
}
