import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";

interface AdvisorAssignmentSeedData {
  id: string;
  advisorId: string;
  studentId: string;
}

export async function seedAdvisorAssignments() {
  logger.info("Seeding advisor assignments into PostgreSQL...");
  console.log("➡️  Starting advisor assignment seeding...");

  try {
    const dataPath = path.join(__dirname, "../seeds/advisorAssignments.json");
    console.log("📄 Loading advisor assignments JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const assignments = JSON.parse(raw) as AdvisorAssignmentSeedData[];

    console.log(`📦 Loaded: ${assignments.length} advisor assignments`);
    logger.info(`Loaded ${assignments.length} advisor assignments from JSON`);

    let assignmentCount = 0;

    for (const assignment of assignments) {
      assignmentCount++;

      await prisma.advisorAssignment.upsert({
        where: { id: assignment.id },
        update: {
          advisorId: assignment.advisorId,
          studentId: assignment.studentId,
        },
        create: {
          id: assignment.id,
          advisorId: assignment.advisorId,
          studentId: assignment.studentId,
        },
      });

      if (assignmentCount % 3 === 0 || assignmentCount === assignments.length) {
        console.log(
          `   → Inserted ${assignmentCount}/${assignments.length} advisor assignments...`
        );
      }
    }

    console.log(
      `✅ Advisor assignment seeding complete (${assignmentCount} assignments).`
    );
    logger.info("✓ Advisor assignment seeding completed!");
  } catch (error) {
    console.error("❌ Advisor assignment seeding failed:", error);
    logger.error("Advisor assignment seeding failed:", error);
    throw error;
  }
}
