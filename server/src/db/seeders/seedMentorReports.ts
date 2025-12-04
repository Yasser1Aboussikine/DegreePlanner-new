import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";
import { MentorReportStatus } from "@/generated/prisma/client";

interface MentorReportSeedData {
  id: string;
  mentorId: string;
  studentId: string;
  description: string;
  status: MentorReportStatus;
  createdAt: string;
  reviewedByAdminId?: string;
}

export async function seedMentorReports() {
  logger.info("Seeding mentor reports into PostgreSQL...");
  console.log("➡️  Starting mentor report seeding...");

  try {
    const dataPath = path.join(__dirname, "../seeds/mentorReports.json");
    console.log("📄 Loading mentor reports JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const reports = JSON.parse(raw) as MentorReportSeedData[];

    console.log(`📦 Loaded: ${reports.length} mentor reports`);
    logger.info(`Loaded ${reports.length} mentor reports from JSON`);

    let reportCount = 0;

    for (const report of reports) {
      reportCount++;

      await prisma.mentorReport.upsert({
        where: { id: report.id },
        update: {
          mentorId: report.mentorId,
          studentId: report.studentId,
          description: report.description,
          status: report.status,
          createdAt: new Date(report.createdAt),
          reviewedByAdminId: report.reviewedByAdminId || null,
        },
        create: {
          id: report.id,
          mentorId: report.mentorId,
          studentId: report.studentId,
          description: report.description,
          status: report.status,
          createdAt: new Date(report.createdAt),
          reviewedByAdminId: report.reviewedByAdminId || null,
        },
      });

      if (reportCount % 3 === 0 || reportCount === reports.length) {
        console.log(
          `   → Inserted ${reportCount}/${reports.length} mentor reports...`
        );
      }
    }

    console.log(
      `✅ Mentor report seeding complete (${reportCount} reports).`
    );
    logger.info("✓ Mentor report seeding completed!");
  } catch (error) {
    console.error("❌ Mentor report seeding failed:", error);
    logger.error("Mentor report seeding failed:", error);
    throw error;
  }
}
