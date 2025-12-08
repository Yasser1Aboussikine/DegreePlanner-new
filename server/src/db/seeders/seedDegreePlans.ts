import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";

interface DegreePlanSeedData {
  id: string;
  userId: string;
  programId?: string;
}

export async function seedDegreePlans() {
  logger.info("Seeding degree plans into PostgreSQL...");
  console.log("➡️  Starting degree plan seeding...");

  try {
    // Load JSON file
    const dataPath = path.join(__dirname, "../seeds/degreePlans.json");
    console.log("📄 Loading degree plans JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const degreePlans = JSON.parse(raw) as DegreePlanSeedData[];

    console.log(`📦 Loaded: ${degreePlans.length} degree plans`);
    logger.info(`Loaded ${degreePlans.length} degree plans from JSON`);

    // Insert degree plans
    let planCount = 0;

    for (const plan of degreePlans) {
      planCount++;

      // Create or update degree plan
      await prisma.degreePlan.upsert({
        where: { id: plan.id },
        update: {
          userId: plan.userId,
          programId: plan.programId,
        },
        create: {
          id: plan.id,
          userId: plan.userId,
          programId: plan.programId,
        },
      });

      if (planCount % 3 === 0 || planCount === degreePlans.length) {
        console.log(
          `   → Inserted ${planCount}/${degreePlans.length} plans...`
        );
      }
    }

    console.log(`✅ Degree plan seeding complete (${planCount} plans).`);
    logger.info("✓ Degree plan seeding completed!");
  } catch (error) {
    console.error("❌ Degree plan seeding failed:", error);
    logger.error("Degree plan seeding failed:", error);
    throw error;
  }
}
