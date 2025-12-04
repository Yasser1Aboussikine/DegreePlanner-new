import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";
import { ReviewStatus } from "@/generated/prisma/client";

interface PlanSemesterReviewRequestSeedData {
  id: string;
  planSemesterId: string;
  studentId: string;
  mentorId?: string;
  advisorId?: string;
  status: ReviewStatus;
  requestedAt: string;
  mentorReviewedAt?: string;
  advisorReviewedAt?: string;
  mentorComment?: string;
  advisorComment?: string;
  rejectionReason?: string;
}

export async function seedPlanSemesterReviewRequests() {
  logger.info("Seeding plan semester review requests into PostgreSQL...");
  console.log("➡️  Starting plan semester review request seeding...");

  try {
    const dataPath = path.join(
      __dirname,
      "../seeds/planSemesterReviewRequests.json"
    );
    console.log("📄 Loading review requests JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const requests = JSON.parse(raw) as PlanSemesterReviewRequestSeedData[];

    console.log(`📦 Loaded: ${requests.length} review requests`);
    logger.info(`Loaded ${requests.length} review requests from JSON`);

    let requestCount = 0;

    for (const request of requests) {
      requestCount++;

      await prisma.planSemesterReviewRequest.upsert({
        where: { id: request.id },
        update: {
          planSemesterId: request.planSemesterId,
          studentId: request.studentId,
          mentorId: request.mentorId || null,
          advisorId: request.advisorId || null,
          status: request.status,
          requestedAt: new Date(request.requestedAt),
          mentorReviewedAt: request.mentorReviewedAt
            ? new Date(request.mentorReviewedAt)
            : null,
          advisorReviewedAt: request.advisorReviewedAt
            ? new Date(request.advisorReviewedAt)
            : null,
          mentorComment: request.mentorComment || null,
          advisorComment: request.advisorComment || null,
          rejectionReason: request.rejectionReason || null,
        },
        create: {
          id: request.id,
          planSemesterId: request.planSemesterId,
          studentId: request.studentId,
          mentorId: request.mentorId || null,
          advisorId: request.advisorId || null,
          status: request.status,
          requestedAt: new Date(request.requestedAt),
          mentorReviewedAt: request.mentorReviewedAt
            ? new Date(request.mentorReviewedAt)
            : null,
          advisorReviewedAt: request.advisorReviewedAt
            ? new Date(request.advisorReviewedAt)
            : null,
          mentorComment: request.mentorComment || null,
          advisorComment: request.advisorComment || null,
          rejectionReason: request.rejectionReason || null,
        },
      });

      if (requestCount % 3 === 0 || requestCount === requests.length) {
        console.log(
          `   → Inserted ${requestCount}/${requests.length} review requests...`
        );
      }
    }

    console.log(
      `✅ Review request seeding complete (${requestCount} requests).`
    );
    logger.info("✓ Review request seeding completed!");
  } catch (error) {
    console.error("❌ Review request seeding failed:", error);
    logger.error("Review request seeding failed:", error);
    throw error;
  }
}
