import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";
import { Term } from "@/generated/prisma/client";

interface PlanSemesterSeedData {
  id: string;
  degreePlanId: string;
  year: number;
  term: Term;
  nth_semestre: number;
}

export async function seedPlanSemesters() {
  logger.info("Seeding plan semesters into PostgreSQL...");
  console.log("➡️  Starting plan semester seeding...");

  try {
    // Load JSON file
    const dataPath = path.join(__dirname, "../seeds/planSemesters.json");
    console.log("📄 Loading plan semesters JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const semesters = JSON.parse(raw) as PlanSemesterSeedData[];

    console.log(`📦 Loaded: ${semesters.length} plan semesters`);
    logger.info(`Loaded ${semesters.length} plan semesters from JSON`);

    // Insert plan semesters
    let semesterCount = 0;

    for (const semester of semesters) {
      semesterCount++;

      // Create or update plan semester
      await prisma.planSemester.upsert({
        where: { id: semester.id },
        update: {
          degreePlanId: semester.degreePlanId,
          year: semester.year,
          term: semester.term,
          nth_semestre: semester.nth_semestre,
        },
        create: {
          id: semester.id,
          degreePlanId: semester.degreePlanId,
          year: semester.year,
          term: semester.term,
          nth_semestre: semester.nth_semestre,
        },
      });

      if (semesterCount % 5 === 0 || semesterCount === semesters.length) {
        console.log(
          `   → Inserted ${semesterCount}/${semesters.length} semesters...`
        );
      }
    }

    console.log(
      `✅ Plan semester seeding complete (${semesterCount} semesters).`
    );
    logger.info("✓ Plan semester seeding completed!");
  } catch (error) {
    console.error("❌ Plan semester seeding failed:", error);
    logger.error("Plan semester seeding failed:", error);
    throw error;
  }
}
