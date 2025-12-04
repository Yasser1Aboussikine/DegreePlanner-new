import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import logger from "@/config/logger";
import { Role, Classification } from "@/generated/prisma/client";

interface UserSeedData {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  isActive: boolean;
  major?: string;
  minor?: string;
  classification?: Classification;
  isFYEStudent?: boolean;
  joinDate?: string;
  expectedGraduation?: string;
  transcriptUrl?: string;
}

export async function seedUsers() {
  logger.info("Seeding users into PostgreSQL...");
  console.log("➡️  Starting user seeding...");

  try {
    // Load JSON file
    const dataPath = path.join(__dirname, "../seeds/users.json");
    console.log("📄 Loading users JSON from:", dataPath);

    const raw = fs.readFileSync(dataPath, "utf8");
    const users = JSON.parse(raw) as UserSeedData[];

    console.log(`📦 Loaded: ${users.length} users`);
    logger.info(`Loaded ${users.length} users from JSON`);

    // Hash passwords and insert users
    let userCount = 0;

    for (const user of users) {
      userCount++;

      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Create or update user
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email,
          password: hashedPassword,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          major: user.major,
          minor: user.minor,
          classification: user.classification,
          isFYEStudent: user.isFYEStudent,
          joinDate: user.joinDate ? new Date(user.joinDate) : undefined,
          expectedGraduation: user.expectedGraduation
            ? new Date(user.expectedGraduation)
            : undefined,
          transcriptUrl: user.transcriptUrl,
        },
        create: {
          id: user.id,
          email: user.email,
          password: hashedPassword,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          major: user.major,
          minor: user.minor,
          classification: user.classification,
          isFYEStudent: user.isFYEStudent,
          joinDate: user.joinDate ? new Date(user.joinDate) : undefined,
          expectedGraduation: user.expectedGraduation
            ? new Date(user.expectedGraduation)
            : undefined,
          transcriptUrl: user.transcriptUrl,
        },
      });

      if (userCount % 5 === 0 || userCount === users.length) {
        console.log(`   → Inserted ${userCount}/${users.length} users...`);
      }
    }

    console.log(`✅ User seeding complete (${userCount} users).`);
    logger.info("✓ User seeding completed!");
  } catch (error) {
    console.error("❌ User seeding failed:", error);
    logger.error("User seeding failed:", error);
    throw error;
  }
}
