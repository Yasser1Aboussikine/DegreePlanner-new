  import { prisma } from "../../lib/prisma";
  import logger from "../../config/logger";
  import { seedUsers } from "./seedUsers";
  import { seedPrograms } from "./seedPrograms";
  import { seedProgramRequirements } from "./seedProgramRequirements";
  import { seedDegreePlans } from "./seedDegreePlans";
  import { seedPlanSemesters } from "./seedPlanSemesters";
  import { seedPlannedCourses } from "./seedPlannedCourses";
  import { seedMentorAssignments } from "./seedMentorAssignments";
  import { seedAdvisorAssignments } from "./seedAdvisorAssignments";
  import { seedPlanSemesterReviewRequests } from "./seedPlanSemesterReviewRequests";
  import { seedChatThreads } from "./seedChatThreads";
  import { seedChatParticipants } from "./seedChatParticipants";
  import { seedMessages } from "./seedMessages";
  import { seedMentorReports } from "./seedMentorReports";

  async function main() {
    logger.info("🌱 Starting database seeding...");
    console.log("=".repeat(50));
    console.log("🌱 DATABASE SEEDING STARTED");
    console.log("=".repeat(50));

    try {
      // Connect to database
      await prisma.$connect();
      logger.info("✓ Connected to PostgreSQL database");
      console.log("✓ Connected to PostgreSQL database\n");

      // Seed in order (respecting foreign key constraints)
      await seedUsers();
      console.log("");

      await seedPrograms();
      console.log("");

      // await seedProgramRequirements();
      // console.log("");

      await seedDegreePlans();
      console.log("");

      await seedPlanSemesters();
      console.log("");

      await seedPlannedCourses();
      console.log("");

      await seedMentorAssignments();
      console.log("");

      await seedAdvisorAssignments();
      console.log("");

      await seedPlanSemesterReviewRequests();
      console.log("");

      await seedChatThreads();
      console.log("");

      await seedChatParticipants();
      console.log("");

      await seedMessages();
      console.log("");

      await seedMentorReports();
      console.log("");

      console.log("=".repeat(50));
      console.log("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY");
      console.log("=".repeat(50));
      logger.info("✅ All seeding completed successfully!");
    } catch (error) {
      console.error("\n" + "=".repeat(50));
      console.error("❌ DATABASE SEEDING FAILED");
      console.error("=".repeat(50));
      logger.error("Database seeding failed:", error);
      throw error;
    } finally {
      // Disconnect from database
      await prisma.$disconnect();
      logger.info("✓ Disconnected from PostgreSQL database");
      console.log("\n✓ Disconnected from database");
    }
  }

  // Run the seeding
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error during seeding:", error);
      logger.error("Fatal error during seeding:", error);
      process.exit(1);
    });
