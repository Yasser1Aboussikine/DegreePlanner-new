/*
  Warnings:

  - You are about to drop the column `status` on the `PlannedCourse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlannedCourse" DROP COLUMN "status";

-- DropEnum
DROP TYPE "PlannedCourseStatus";
