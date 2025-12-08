import prisma from "../config/prisma";
import { ChatThreadType } from "@/generated/prisma/enums";
import logger from "../config/logger";
import { getIO } from "../config/socket";

/**
 * Get or create a chat thread for a mentor and their mentees (group chat)
 */
export const getOrCreateMentorGroupThread = async (mentorId: string) => {
  try {
    logger.info(
      `Getting or creating mentor group thread for mentor: ${mentorId}`
    );

    // Verify the user is actually a mentor
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
      select: { role: true, name: true },
    });

    if (!mentor) {
      throw new Error(`User with ID ${mentorId} not found`);
    }

    if (mentor.role !== "MENTOR") {
      throw new Error(
        `User ${mentorId} is not a mentor (role: ${mentor.role})`
      );
    }

    // Check if a group thread already exists for this mentor
    let thread = await prisma.chatThread.findFirst({
      where: {
        type: ChatThreadType.MENTOR_GROUP,
        mentorId: mentorId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: { sentAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (thread) {
      logger.info(
        `Found existing mentor group thread: ${thread.id} with ${thread.participants.length} participants`
      );
      return thread;
    }

    logger.info(
      `No existing thread found, creating new mentor group thread for mentor: ${mentorId}`
    );

    // Get all students assigned to this mentor
    const mentorAssignments = await prisma.mentorAssignment.findMany({
      where: { mentorId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    logger.info(
      `Found ${mentorAssignments.length} students assigned to mentor ${mentorId}`
    );

    // Create the group chat thread
    thread = await prisma.chatThread.create({
      data: {
        type: ChatThreadType.MENTOR_GROUP,
        title: `${mentor?.name || "Mentor"}'s Group`,
        mentorId: mentorId,
        participants: {
          create: [
            { userId: mentorId }, // Add mentor
            ...mentorAssignments.map((assignment: any) => ({
              userId: assignment.studentId,
            })),
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: { sentAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    logger.info(
      `Created new mentor group thread: ${thread.id} with ${thread.participants.length} participants (1 mentor + ${mentorAssignments.length} students)`
    );

    return thread;
  } catch (error) {
    logger.error("Error in getOrCreateMentorGroupThread:", error);
    throw error;
  }
};

/**
 * Get all chat threads for a user
 */
export const getUserChatThreads = async (userId: string) => {
  try {
    const threads = await prisma.chatThread.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: { sentAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return threads;
  } catch (error) {
    logger.error("Error in getUserChatThreads:", error);
    throw error;
  }
};

/**
 * Get messages for a specific thread
 */
export const getThreadMessages = async (
  threadId: string,
  limit: number = 50,
  skip: number = 0
) => {
  try {
    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { sentAt: "desc" },
      take: limit,
      skip,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return messages.reverse(); // Return in chronological order
  } catch (error) {
    logger.error("Error in getThreadMessages:", error);
    throw error;
  }
};

/**
 * Send a message to a thread
 */
export const sendMessage = async (
  threadId: string,
  senderId: string,
  content: string
) => {
  try {
    // Verify user is a participant
    const participant = await prisma.chatParticipant.findUnique({
      where: {
        threadId_userId: {
          threadId,
          userId: senderId,
        },
      },
    });

    if (!participant) {
      throw new Error("User is not a participant of this thread");
    }

    // Create the message with status SENT
    const message = await prisma.message.create({
      data: {
        threadId,
        senderId,
        content,
        status: "SENT", // explicit status
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Update thread's updatedAt timestamp
    await prisma.chatThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });

    logger.info(
      `[Chat] ✅ Message ${message.id} created with status SENT in thread ${threadId}`
    );

    return message;
  } catch (error) {
    logger.error("Error in sendMessage:", error);
    throw error;
  }
};

/**
 * Mark specific messages as read by updating their status
 */
export const markMessagesAsRead = async (
  messageIds: string[],
  userId: string
) => {
  try {
    if (messageIds.length === 0) {
      return { success: true, updatedCount: 0 };
    }

    // Update status to READ for specific messages (not sent by this user)
    const result = await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        senderId: { not: userId }, // don't mark your own messages as read
        status: { not: "READ" }, // only update if not already read
      },
      data: {
        status: "READ",
      },
    });

    logger.info(
      `[Chat] Marked ${result.count} messages as READ for user ${userId}`
    );

    return { success: true, updatedCount: result.count };
  } catch (error) {
    logger.error("Error in markMessagesAsRead:", error);
    throw error;
  }
};

/**
 * Get unread message count for a user
 */
export const getUnreadCount = async (userId: string) => {
  try {
    const count = await prisma.message.count({
      where: {
        thread: {
          participants: {
            some: {
              userId: userId,
            },
          },
        },
        senderId: { not: userId },
        status: { not: "READ" }, // count SENT and DELIVERED messages
      },
    });

    return count;
  } catch (error) {
    logger.error("Error in getUnreadCount:", error);
    throw error;
  }
};

/**
 * Add a student to mentor's group chat when they get assigned
 */
export const addStudentToMentorGroup = async (
  mentorId: string,
  studentId: string
) => {
  try {
    logger.info(
      `Adding student ${studentId} to mentor ${mentorId}'s group chat`
    );

    const thread = await getOrCreateMentorGroupThread(mentorId);

    logger.info(`Thread ${thread.id} retrieved/created for mentor ${mentorId}`);

    // Check if student is already a participant
    const existingParticipant = await prisma.chatParticipant.findUnique({
      where: {
        threadId_userId: {
          threadId: thread.id,
          userId: studentId,
        },
      },
    });

    if (existingParticipant) {
      logger.info(
        `Student ${studentId} is already a participant in thread ${thread.id}`
      );
    } else {
      await prisma.chatParticipant.create({
        data: {
          threadId: thread.id,
          userId: studentId,
        },
      });
      logger.info(
        `Successfully added student ${studentId} as participant in thread ${thread.id}`
      );
    }

    return thread;
  } catch (error) {
    logger.error("Error in addStudentToMentorGroup:", error);
    throw error;
  }
};

/**
 * Create or get a direct chat between mentor and student
 */
export const getOrCreateDirectChat = async (
  userId1: string,
  userId2: string
) => {
  try {
    // Check if a direct chat already exists between these two users
    let thread = await prisma.chatThread.findFirst({
      where: {
        type: ChatThreadType.DIRECT,
        AND: [
          {
            participants: {
              some: {
                userId: userId1,
              },
            },
          },
          {
            participants: {
              some: {
                userId: userId2,
              },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: { sentAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!thread) {
      // Create a new direct chat thread
      thread = await prisma.chatThread.create({
        data: {
          type: ChatThreadType.DIRECT,
          participants: {
            create: [{ userId: userId1 }, { userId: userId2 }],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          messages: {
            orderBy: { sentAt: "desc" },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      logger.info(`Created direct chat between ${userId1} and ${userId2}`);
    }

    return thread;
  } catch (error) {
    logger.error("Error in getOrCreateDirectChat:", error);
    throw error;
  }
};
