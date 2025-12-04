-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN', 'ADVISOR', 'MENTOR', 'REGISTRAR');

-- CreateEnum
CREATE TYPE "Term" AS ENUM ('FALL', 'SPRING', 'SUMMER', 'WINTER');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GENERAL_EDUCATION', 'COMPUTER_SCIENCE', 'MINOR', 'SPECIALIZATION', 'ENGINEERING_SCIENCE_MATHS', 'FREE_ELECTIVES');

-- CreateEnum
CREATE TYPE "PlannedCourseStatus" AS ENUM ('PLANNED', 'COMPLETED', 'DROPPED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING_MENTOR', 'PENDING_ADVISOR', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Classification" AS ENUM ('FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR', 'OTHER');

-- CreateEnum
CREATE TYPE "ChatThreadType" AS ENUM ('MENTOR_GROUP', 'DIRECT');

-- CreateEnum
CREATE TYPE "MentorReportStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "major" TEXT,
    "minor" TEXT,
    "classification" "Classification",
    "isFYEStudent" BOOLEAN NOT NULL DEFAULT false,
    "joinDate" TIMESTAMP(3),
    "expectedGraduation" TIMESTAMP(3),
    "transcriptUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "DegreeLevel" NOT NULL DEFAULT 'BACHELOR',
    "totalCredits" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramRequirement" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DegreePlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DegreePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSemester" (
    "id" TEXT NOT NULL,
    "degreePlanId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "term" "Term" NOT NULL,
    "nth_semestre" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanSemester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedCourse" (
    "id" TEXT NOT NULL,
    "planSemesterId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "status" "PlannedCourseStatus" NOT NULL DEFAULT 'PLANNED',
    "courseTitle" TEXT,
    "credits" INTEGER,
    "category" "Category",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorAssignment" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisorAssignment" (
    "id" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdvisorAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSemesterReviewRequest" (
    "id" TEXT NOT NULL,
    "planSemesterId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT,
    "advisorId" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING_MENTOR',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mentorReviewedAt" TIMESTAMP(3),
    "advisorReviewedAt" TIMESTAMP(3),
    "mentorComment" TEXT,
    "advisorComment" TEXT,
    "rejectionReason" TEXT,

    CONSTRAINT "PlanSemesterReviewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatThread" (
    "id" TEXT NOT NULL,
    "type" "ChatThreadType" NOT NULL,
    "title" TEXT,
    "mentorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatParticipant" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3),

    CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorReport" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "MentorReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedByAdminId" TEXT,

    CONSTRAINT "MentorReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Program_code_key" ON "Program"("code");

-- CreateIndex
CREATE INDEX "Program_code_idx" ON "Program"("code");

-- CreateIndex
CREATE INDEX "ProgramRequirement_programId_idx" ON "ProgramRequirement"("programId");

-- CreateIndex
CREATE INDEX "ProgramRequirement_category_idx" ON "ProgramRequirement"("category");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramRequirement_programId_category_key" ON "ProgramRequirement"("programId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "DegreePlan_userId_key" ON "DegreePlan"("userId");

-- CreateIndex
CREATE INDEX "DegreePlan_programId_idx" ON "DegreePlan"("programId");

-- CreateIndex
CREATE INDEX "PlanSemester_degreePlanId_idx" ON "PlanSemester"("degreePlanId");

-- CreateIndex
CREATE INDEX "PlanSemester_degreePlanId_nth_semestre_idx" ON "PlanSemester"("degreePlanId", "nth_semestre");

-- CreateIndex
CREATE INDEX "PlannedCourse_planSemesterId_idx" ON "PlannedCourse"("planSemesterId");

-- CreateIndex
CREATE INDEX "PlannedCourse_courseCode_idx" ON "PlannedCourse"("courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "PlannedCourse_planSemesterId_courseCode_key" ON "PlannedCourse"("planSemesterId", "courseCode");

-- CreateIndex
CREATE INDEX "MentorAssignment_mentorId_idx" ON "MentorAssignment"("mentorId");

-- CreateIndex
CREATE INDEX "MentorAssignment_studentId_idx" ON "MentorAssignment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorAssignment_mentorId_studentId_key" ON "MentorAssignment"("mentorId", "studentId");

-- CreateIndex
CREATE INDEX "AdvisorAssignment_advisorId_idx" ON "AdvisorAssignment"("advisorId");

-- CreateIndex
CREATE INDEX "AdvisorAssignment_studentId_idx" ON "AdvisorAssignment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvisorAssignment_advisorId_studentId_key" ON "AdvisorAssignment"("advisorId", "studentId");

-- CreateIndex
CREATE INDEX "PlanSemesterReviewRequest_planSemesterId_idx" ON "PlanSemesterReviewRequest"("planSemesterId");

-- CreateIndex
CREATE INDEX "PlanSemesterReviewRequest_studentId_idx" ON "PlanSemesterReviewRequest"("studentId");

-- CreateIndex
CREATE INDEX "PlanSemesterReviewRequest_mentorId_idx" ON "PlanSemesterReviewRequest"("mentorId");

-- CreateIndex
CREATE INDEX "PlanSemesterReviewRequest_advisorId_idx" ON "PlanSemesterReviewRequest"("advisorId");

-- CreateIndex
CREATE INDEX "ChatThread_type_idx" ON "ChatThread"("type");

-- CreateIndex
CREATE INDEX "ChatThread_mentorId_idx" ON "ChatThread"("mentorId");

-- CreateIndex
CREATE INDEX "ChatParticipant_threadId_idx" ON "ChatParticipant"("threadId");

-- CreateIndex
CREATE INDEX "ChatParticipant_userId_idx" ON "ChatParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_threadId_userId_key" ON "ChatParticipant"("threadId", "userId");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "MentorReport_mentorId_idx" ON "MentorReport"("mentorId");

-- CreateIndex
CREATE INDEX "MentorReport_studentId_idx" ON "MentorReport"("studentId");

-- CreateIndex
CREATE INDEX "MentorReport_status_idx" ON "MentorReport"("status");

-- CreateIndex
CREATE INDEX "MentorReport_reviewedByAdminId_idx" ON "MentorReport"("reviewedByAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- AddForeignKey
ALTER TABLE "ProgramRequirement" ADD CONSTRAINT "ProgramRequirement_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreePlan" ADD CONSTRAINT "DegreePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreePlan" ADD CONSTRAINT "DegreePlan_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSemester" ADD CONSTRAINT "PlanSemester_degreePlanId_fkey" FOREIGN KEY ("degreePlanId") REFERENCES "DegreePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedCourse" ADD CONSTRAINT "PlannedCourse_planSemesterId_fkey" FOREIGN KEY ("planSemesterId") REFERENCES "PlanSemester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorAssignment" ADD CONSTRAINT "MentorAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorAssignment" ADD CONSTRAINT "MentorAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorAssignment" ADD CONSTRAINT "AdvisorAssignment_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorAssignment" ADD CONSTRAINT "AdvisorAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSemesterReviewRequest" ADD CONSTRAINT "PlanSemesterReviewRequest_planSemesterId_fkey" FOREIGN KEY ("planSemesterId") REFERENCES "PlanSemester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSemesterReviewRequest" ADD CONSTRAINT "PlanSemesterReviewRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSemesterReviewRequest" ADD CONSTRAINT "PlanSemesterReviewRequest_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSemesterReviewRequest" ADD CONSTRAINT "PlanSemesterReviewRequest_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatThread" ADD CONSTRAINT "ChatThread_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ChatThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ChatThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorReport" ADD CONSTRAINT "MentorReport_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorReport" ADD CONSTRAINT "MentorReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorReport" ADD CONSTRAINT "MentorReport_reviewedByAdminId_fkey" FOREIGN KEY ("reviewedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
