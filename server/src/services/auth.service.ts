import { User } from "@/generated/prisma/client";
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  SignupInput,
  LoginInput,
  RefreshTokenInput,
} from "../schemas/auth.schema";

export interface AuthResult {
  user: Omit<User, "password">;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

export const signup = async (data: SignupInput): Promise<AuthResult> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
      major: data.major,
      minor: data.minor,
      classification: data.classification,
      isFYEStudent: data.isFYEStudent,
      joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
      expectedGraduation: data.expectedGraduation
        ? new Date(data.expectedGraduation)
        : undefined,
    },
  });

  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const login = async (data: LoginInput): Promise<AuthResult> => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account is inactive");
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (
  data: RefreshTokenInput
): Promise<RefreshResult> => {
  const decoded = verifyRefreshToken(data.refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user || !user.isActive) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const getUserById = async (
  userId: string
): Promise<Omit<User, "password">> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUsersByRole = async (
  role: string
): Promise<Omit<User, "password">[]> => {
  const users = await prisma.user.findMany({
    where: {
      role: role as any,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      major: true,
      minor: true,
      classification: true,
      isFYEStudent: true,
      joinDate: true,
      expectedGraduation: true,
      transcriptUrl: true,
      isActive: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users;
};

export const getAllUsers = async (filters?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  users: (Omit<User, "password"> & {
    mentorAssignmentCount?: number;
    advisorAssignmentCount?: number;
  })[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.role) {
    where.role = filters.role;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        major: true,
        minor: true,
        classification: true,
        isFYEStudent: true,
        joinDate: true,
        expectedGraduation: true,
        transcriptUrl: true,
        isActive: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            mentorAssignmentsAsMentor: true,
            advisorAssignmentsAsAdvisor: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const usersWithCounts = users.map((user) => {
    const { _count, ...userData } = user;
    return {
      ...userData,
      mentorAssignmentCount: _count.mentorAssignmentsAsMentor,
      advisorAssignmentCount: _count.advisorAssignmentsAsAdvisor,
    };
  });

  return {
    users: usersWithCounts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateUserRole = async (
  userId: string,
  newRole: string,
  currentUserId?: string
): Promise<Omit<User, "password">> => {
  if (currentUserId && userId === currentUserId) {
    throw new Error("You cannot change your own role");
  }

  // Get user before update to check current role
  const userBefore = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      major: true,
      classification: true,
      name: true,
    },
  });

  console.log("🔍 Before role update:", {
    userId,
    name: userBefore?.name,
    oldRole: userBefore?.role,
    newRole,
    major: userBefore?.major,
    classification: userBefore?.classification,
  });

  const oldRole = userBefore?.role;

  // Handle role change cleanup
  if (oldRole && oldRole !== newRole) {
    // 1. If changing FROM STUDENT role - remove all student assignments
    if (oldRole === "STUDENT") {
      console.log("🗑️  Removing STUDENT assignments (as mentee/advisee)...");

      // Remove mentor assignments where user is a student
      const deletedMentorAssignments = await prisma.mentorAssignment.deleteMany(
        {
          where: { studentId: userId },
        }
      );

      // Remove advisor assignments where user is a student
      const deletedAdvisorAssignments =
        await prisma.advisorAssignment.deleteMany({
          where: { studentId: userId },
        });

      // Remove review requests where user is the student
      const deletedReviewRequests =
        await prisma.planSemesterReviewRequest.deleteMany({
          where: { studentId: userId },
        });

      console.log(
        `✅ Removed: ${deletedMentorAssignments.count} mentor assignments, ${deletedAdvisorAssignments.count} advisor assignments, ${deletedReviewRequests.count} review requests`
      );
    }

    // 2. If changing FROM MENTOR role - remove all mentor assignments (orphans students)
    if (oldRole === "MENTOR") {
      console.log("🗑️  Removing MENTOR assignments (orphaning students)...");

      // Remove mentor assignments where user is the mentor
      const deletedMentorAssignments = await prisma.mentorAssignment.deleteMany(
        {
          where: { mentorId: userId },
        }
      );

      // Remove mentor assignments where user is a student (mentors can be assigned to mentors)
      const deletedMentorAssignmentsAsStudent =
        await prisma.mentorAssignment.deleteMany({
          where: { studentId: userId },
        });

      // Remove advisor assignments where user is a student (mentors are students with advisors)
      const deletedAdvisorAssignments =
        await prisma.advisorAssignment.deleteMany({
          where: { studentId: userId },
        });

      // Remove review requests where user is the mentor
      const deletedReviewRequests =
        await prisma.planSemesterReviewRequest.deleteMany({
          where: { mentorId: userId },
        });

      // Remove review requests where user is the student
      const deletedReviewRequestsAsStudent =
        await prisma.planSemesterReviewRequest.deleteMany({
          where: { studentId: userId },
        });

      // Remove mentor chat threads (delete all dependent records first to avoid FK constraints)
      const mentorThreads = await prisma.chatThread.findMany({
        where: { mentorId: userId },
        select: { id: true },
      });

      const threadIds = mentorThreads.map((t) => t.id);

      if (threadIds.length > 0) {
        // Delete messages first
        const deletedMessages = await prisma.message.deleteMany({
          where: { threadId: { in: threadIds } },
        });

        // Delete chat participants
        const deletedParticipants = await prisma.chatParticipant.deleteMany({
          where: { threadId: { in: threadIds } },
        });

        // Finally delete the threads
        const deletedChatThreads = await prisma.chatThread.deleteMany({
          where: { id: { in: threadIds } },
        });

        console.log(
          `✅ Removed: ${deletedMentorAssignments.count} mentor assignments (as mentor), ${deletedMentorAssignmentsAsStudent.count} mentor assignments (as mentee), ${deletedAdvisorAssignments.count} advisor assignments, ${deletedReviewRequests.count} review requests (as mentor), ${deletedReviewRequestsAsStudent.count} review requests (as student), ${deletedChatThreads.count} chat threads (${deletedMessages.count} messages, ${deletedParticipants.count} participants)`
        );
      } else {
        console.log(
          `✅ Removed: ${deletedMentorAssignments.count} mentor assignments (as mentor), ${deletedMentorAssignmentsAsStudent.count} mentor assignments (as mentee), ${deletedAdvisorAssignments.count} advisor assignments, ${deletedReviewRequests.count} review requests (as mentor), ${deletedReviewRequestsAsStudent.count} review requests (as student), 0 chat threads`
        );
      }
    }

    // 3. If changing FROM ADVISOR role - remove all advisor assignments (orphans students)
    if (oldRole === "ADVISOR") {
      console.log("🗑️  Removing ADVISOR assignments (orphaning students)...");

      // Remove advisor assignments where user is the advisor
      const deletedAdvisorAssignments =
        await prisma.advisorAssignment.deleteMany({
          where: { advisorId: userId },
        });

      // Remove review requests where user is the advisor
      const deletedReviewRequests =
        await prisma.planSemesterReviewRequest.deleteMany({
          where: { advisorId: userId },
        });

      console.log(
        `✅ Removed: ${deletedAdvisorAssignments.count} advisor assignments (students orphaned), ${deletedReviewRequests.count} review requests`
      );
    }

    // 4. Additional cleanup for mentor reports
    if (oldRole === "MENTOR") {
      // Handle mentor reports - mark as resolved or reassign
      const updatedReports = await prisma.mentorReport.updateMany({
        where: {
          mentorId: userId,
          status: { in: ["OPEN", "UNDER_REVIEW"] },
        },
        data: { status: "DISMISSED" },
      });

      console.log(`✅ Dismissed ${updatedReports.count} open mentor reports`);
    }

    // 5. If user was a student who reported mentors, handle those reports
    if (oldRole === "STUDENT") {
      const updatedReports = await prisma.mentorReport.updateMany({
        where: {
          studentId: userId,
          status: { in: ["OPEN", "UNDER_REVIEW"] },
        },
        data: { status: "DISMISSED" },
      });

      console.log(
        `✅ Dismissed ${updatedReports.count} reports by former student`
      );
    }
  }

  // Update the user role
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as any },
  });

  console.log("✅ After role update:", {
    userId: user.id,
    name: user.name,
    role: user.role,
    major: user.major,
    classification: user.classification,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const toggleUserStatus = async (
  userId: string,
  currentUserId?: string
): Promise<Omit<User, "password">> => {
  if (currentUserId && userId === currentUserId) {
    throw new Error("You cannot change your own status");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};
