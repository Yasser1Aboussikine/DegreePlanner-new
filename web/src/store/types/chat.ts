export interface ChatThread {
  id: string;
  type: "MENTOR_GROUP" | "DIRECT";
  title?: string;
  mentorId?: string;
  participants: ChatParticipant[];
  messages?: Message[];
  mentor?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  threadId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  joinedAt: string;
  lastReadAt?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  content: string;
  status: "SENT" | "DELIVERED" | "READ";
  sentAt: string;
}

export interface SendMessageInput {
  content: string;
}

export interface TypingIndicator {
  threadId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}
