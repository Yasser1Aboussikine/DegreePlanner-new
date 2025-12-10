import { useEffect, useState, useCallback, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { getSocket } from "@/lib/socket";
import { useGetThreadMessagesQuery } from "@/store/api/chatApi";
import type { Message, TypingIndicator } from "@/store/types/chat";

interface ChatWindowProps {
  threadId: string;
  threadTitle: string;
  currentUserId: string;
  currentUserRole: "STUDENT" | "MENTOR";
}

export const ChatWindow = ({
  threadId,
  threadTitle,
  currentUserId,
}: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [connected, setConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());

  // Initial load from REST API
  const {
    data: initialMessages = [],
    isLoading,
    error: messagesError,
  } = useGetThreadMessagesQuery({ threadId, limit: 100 });

  // Set initial messages
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Socket connection and event handlers
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      console.log("[ChatWindow] Connected to socket");
      setConnected(true);
      setSocketError(null);
      // Join the thread room
      socket.emit("thread:join", { threadId });
    };

    const handleDisconnect = (reason: string) => {
      console.log("[ChatWindow] Disconnected:", reason);
      setConnected(false);
    };

    const handleError = (error: Error) => {
      console.error("[ChatWindow] Socket error:", error);
      setSocketError(error.message);
    };

    const handleThreadJoined = (data: { threadId: string }) => {
      console.log("[ChatWindow] Successfully joined thread:", data.threadId);
    };

    // Handle new message created event
    const handleMessageCreated = (message: Message) => {
      console.log("[ChatWindow] message:created received:", message);

      if (message.threadId !== threadId) {
        console.log("[ChatWindow] Message for different thread, ignoring");
        return;
      }

      // Prevent processing the same message twice
      if (processedMessageIds.current.has(message.id)) {
        console.log(
          "[ChatWindow] ⚠️ Message already processed, ignoring duplicate event"
        );
        return;
      }
      processedMessageIds.current.add(message.id);

      setMessages((prev) => {
        console.log("[ChatWindow] Current messages:", prev.length);

        // Check if this is replacing an optimistic message
        const optimisticIndex = prev.findIndex((m) => {
          const isOptimistic = m.id.includes("-"); // temp IDs have dashes
          const sameUser = m.senderId === message.senderId;
          const sameContent = m.content === message.content;
          const withinTimeWindow =
            Math.abs(
              new Date(m.sentAt).getTime() - new Date(message.sentAt).getTime()
            ) < 5000; // within 5 seconds

          console.log("[ChatWindow] Checking message:", {
            messageId: m.id,
            isOptimistic,
            sameUser,
            sameContent,
            withinTimeWindow,
          });

          return isOptimistic && sameUser && sameContent && withinTimeWindow;
        });

        if (optimisticIndex !== -1) {
          // Replace optimistic message with real one
          const newMessages = [...prev];
          newMessages[optimisticIndex] = message;
          console.log(
            "[ChatWindow] ✅ Replaced optimistic message at index",
            optimisticIndex
          );
          return newMessages;
        }

        // Check for exact duplicate
        if (prev.some((m) => m.id === message.id)) {
          console.log("[ChatWindow] ⚠️ Duplicate message ID, ignoring");
          return prev;
        }

        // Add new message
        console.log("[ChatWindow] ➕ Adding new message");
        return [...prev, message];
      });

      // Auto-mark as read if not our own message
      if (message.senderId !== currentUserId) {
        // Mark this specific message as read
        socket.emit("message:read", {
          threadId,
          messageIds: [message.id],
        });
      }
    };

    // Handle message status updates
    const handleStatusUpdated = (data: {
      threadId: string;
      messageIds: string[];
      status: "SENT" | "DELIVERED" | "READ";
      readerId: string;
    }) => {
      console.log("[ChatWindow] message:statusUpdated received:", data);

      if (data.threadId !== threadId) return;

      setMessages((prev) =>
        prev.map((m) =>
          data.messageIds.includes(m.id) ? { ...m, status: data.status } : m
        )
      );
    };

    // Handle typing indicators
    const handleUserTyping = (data: TypingIndicator) => {
      if (data.threadId !== threadId || data.userId === currentUserId) return;

      setTypingUsers((prev) => {
        if (data.isTyping) {
          if (!prev.some((u) => u.userId === data.userId)) {
            return [...prev, data];
          }
          return prev;
        } else {
          return prev.filter((u) => u.userId !== data.userId);
        }
      });
    };

    // Setup listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("thread:joined", handleThreadJoined);
    socket.on("message:created", handleMessageCreated);
    socket.on("message:statusUpdated", handleStatusUpdated);
    socket.on("user:typing", handleUserTyping);

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("thread:joined", handleThreadJoined);
      socket.off("message:created", handleMessageCreated);
      socket.off("message:statusUpdated", handleStatusUpdated);
      socket.off("user:typing", handleUserTyping);

      socket.emit("thread:leave", { threadId });
    };
  }, [threadId, currentUserId]);

  // Mark messages as read when they become visible
  const handleMessageViewed = useCallback(
    (messageId: string) => {
      const socket = getSocket();
      const message = messages.find((m) => m.id === messageId);

      // Only mark if not our own message and not already read
      if (
        message &&
        message.senderId !== currentUserId &&
        message.status !== "READ"
      ) {
        console.log("[ChatWindow] Marking message as read:", messageId);
        socket.emit("message:read", {
          threadId,
          messageIds: [messageId],
        });
      }
    },
    [threadId, currentUserId, messages]
  );

  // Send message handler
  const handleSendMessage = useCallback(
    (content: string) => {
      const socket = getSocket();

      // Optimistic message
      const tempId = crypto.randomUUID();
      const optimisticMessage: Message = {
        id: tempId,
        threadId,
        senderId: currentUserId,
        sender: {
          id: currentUserId,
          name: "You",
          email: "",
        },
        content,
        status: "SENT",
        sentAt: new Date().toISOString(),
      };

      // Add optimistically
      setMessages((prev) => [...prev, optimisticMessage]);

      // Emit via socket
      socket.emit("message:send", {
        threadId,
        content,
      });
    },
    [threadId, currentUserId]
  );

  const handleTypingStart = useCallback(() => {
    if (connected) {
      const socket = getSocket();
      socket.emit("typing:start", { threadId });
    }
  }, [connected, threadId]);

  const handleTypingStop = useCallback(() => {
    if (connected) {
      const socket = getSocket();
      socket.emit("typing:stop", { threadId });
    }
  }, [connected, threadId]);

  const handleRetryConnection = () => {
    const socket = getSocket();
    socket.connect();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {threadTitle}
          {!connected && (
            <span className="text-xs text-muted-foreground font-normal">
              (Disconnected)
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {socketError && (
          <Alert variant="destructive" className="m-4">
            <AlertDescription>
              Connection error: {socketError}
              <button
                onClick={handleRetryConnection}
                className="ml-2 underline font-medium"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        )}

        {messagesError && (
          <Alert variant="destructive" className="m-4">
            <AlertDescription>
              Failed to load messages. Please refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              loading={false}
              typingUsers={typingUsers}
              onMessageViewed={handleMessageViewed}
            />

            <MessageInput
              onSend={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              disabled={!connected}
              sending={false}
              placeholder={
                connected ? "Type a message..." : "Connecting to chat..."
              }
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
