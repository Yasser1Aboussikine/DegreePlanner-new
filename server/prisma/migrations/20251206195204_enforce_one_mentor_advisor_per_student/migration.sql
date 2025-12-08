/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `AdvisorAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId]` on the table `MentorAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdvisorAssignment_studentId_key" ON "AdvisorAssignment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorAssignment_studentId_key" ON "MentorAssignment"("studentId");
