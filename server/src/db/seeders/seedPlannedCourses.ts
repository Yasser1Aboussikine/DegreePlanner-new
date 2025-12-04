import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";
import { PlannedCourseStatus, Category } from "@/generated/prisma/client";

interface PlannedCourseSeedData {
  id: string;
  planSemesterId: string;
  courseCode: string;
  status: PlannedCourseStatus;
  courseTitle?: string;
  credits?: number;
  category?: Category;
}

export async function seedPlannedCourses() {
  logger.info("Seeding planned courses into PostgreSQL...");
  console.log("➡️  Starting planned course seeding...");

  try {
    // Load JSON file
    const dataPath = path.join(__dirname, "../seeds/plannedCourses.json");
    console.log("📄 Loading planned courses JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const courses = JSON.parse(raw) as PlannedCourseSeedData[];

    console.log(`📦 Loaded: ${courses.length} planned courses`);
    logger.info(`Loaded ${courses.length} planned courses from JSON`);

    // Insert planned courses
    let courseCount = 0;

    for (const course of courses) {
      courseCount++;

      // Create or update planned course
      await prisma.plannedCourse.upsert({
        where: { id: course.id },
        update: {
          planSemesterId: course.planSemesterId,
          courseCode: course.courseCode,
          status: course.status,
          courseTitle: course.courseTitle,
          credits: course.credits,
          category: course.category,
        },
        create: {
          id: course.id,
          planSemesterId: course.planSemesterId,
          courseCode: course.courseCode,
          status: course.status,
          courseTitle: course.courseTitle,
          credits: course.credits,
          category: course.category,
        },
      });

      if (courseCount % 10 === 0 || courseCount === courses.length) {
        console.log(
          `   → Inserted ${courseCount}/${courses.length} courses...`
        );
      }
    }

    console.log(
      `✅ Planned course seeding complete (${courseCount} courses).`
    );
    logger.info("✓ Planned course seeding completed!");
  } catch (error) {
    console.error("❌ Planned course seeding failed:", error);
    logger.error("Planned course seeding failed:", error);
    throw error;
  }
}
