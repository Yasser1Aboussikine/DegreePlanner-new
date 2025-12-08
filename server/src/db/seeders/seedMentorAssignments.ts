import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";

interface MentorAssignmentSeedData {
  id: string;
  mentorId: string;
  studentId: string;
}

export async function seedMentorAssignments() {
  logger.info("Seeding mentor assignments into PostgreSQL...");
  console.log("➡️  Starting mentor assignment seeding...");

  try {
    const dataPath = path.join(__dirname, "../seeds/mentorAssignments.json");
    console.log("📄 Loading mentor assignments JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const assignments = JSON.parse(raw) as MentorAssignmentSeedData[];

    console.log(`📦 Loaded: ${assignments.length} mentor assignments`);
    logger.info(`Loaded ${assignments.length} mentor assignments from JSON`);

    let assignmentCount = 0;

    for (const assignment of assignments) {
      assignmentCount++;

      await prisma.mentorAssignment.upsert({
        where: {
          mentorId_studentId: {
            mentorId: assignment.mentorId,
            studentId: assignment.studentId,
          },
        },
        update: {},
        create: {
          id: assignment.id,
          mentorId: assignment.mentorId,
          studentId: assignment.studentId,
        },
      });

      if (assignmentCount % 3 === 0 || assignmentCount === assignments.length) {
        console.log(
          `   → Inserted ${assignmentCount}/${assignments.length} mentor assignments...`
        );
      }
    }

    console.log(
      `✅ Mentor assignment seeding complete (${assignmentCount} assignments).`
    );
    logger.info("✓ Mentor assignment seeding completed!");
  } catch (error) {
    console.error("❌ Mentor assignment seeding failed:", error);
    logger.error("Mentor assignment seeding failed:", error);
    throw error;
  }
}
