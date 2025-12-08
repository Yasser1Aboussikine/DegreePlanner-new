import { useEffect, useRef } from "react";
import { CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "@/store/types/chat";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
  typingUsers?: Array<{ userId: string; userName: string }>;
  onMessageViewed?: (messageId: string) => void;
}

const formatMessageDate = (date: Date | string) => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInHours =
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  const timeString = messageDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (diffInHours < 24) {
    return timeString;
  } else if (diffInHours < 48) {
    return `Yesterday ${timeString}`;
  } else {
    return (
      messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }) + `, ${timeString}`
    );
  }
};

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const MessageList = ({
  messages,
  currentUserId,
  loading = false,
  typingUsers = [],
  onMessageViewed,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const viewedMessagesRef = useRef<Set<string>>(new Set());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Set up Intersection Observer to track message visibility
  useEffect(() => {
    if (!onMessageViewed) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute("data-message-id");
            const senderId = entry.target.getAttribute("data-sender-id");

            if (
              messageId &&
              senderId !== currentUserId &&
              !viewedMessagesRef.current.has(messageId)
            ) {
              viewedMessagesRef.current.add(messageId);
              onMessageViewed(messageId);
            }
          }
        });
      },
      {
        root: messagesContainerRef.current,
        threshold: 0.5, // Message must be 50% visible
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [onMessageViewed, currentUserId]);

  // Helper to check if messages are within 2 minutes of each other
  // Helper to check if messages should be grouped (same minute)
  const isConsecutiveMessage = (
    currentMsg: Message,
    prevMsg: Message | undefined
  ) => {
    if (!prevMsg) return false;
    if (currentMsg.senderId !== prevMsg.senderId) return false;

    const currentDate = new Date(currentMsg.sentAt);
    const prevDate = new Date(prevMsg.sentAt);

    // Group if same hour and same minute
    return (
      currentDate.getHours() === prevDate.getHours() &&
      currentDate.getMinutes() === prevDate.getMinutes()
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Start the conversation by sending a message</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.senderId === currentUserId;
        const prevMessage = index > 0 ? messages[index - 1] : undefined;
        const isConsecutive = isConsecutiveMessage(message, prevMessage);
        const showAvatar = !isOwnMessage && !isConsecutive;
        const showName = !isOwnMessage && !isConsecutive;
        const showTime = !isConsecutive; // Only show time if not consecutive

        return (
          <div
            key={message.id}
            ref={(el) => {
              if (el && observerRef.current && !isOwnMessage) {
                observerRef.current.observe(el);
              }
            }}
            data-message-id={message.id}
            data-sender-id={message.senderId}
            className={cn(
              "flex gap-3 max-w-[85%]",
              isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto",
              isConsecutive ? "mt-0.5" : "mt-4"
            )}
          >
            {!isOwnMessage &&
              (showAvatar ? (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs">
                    {getInitials(message.sender.name)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-8 w-8 shrink-0" />
              ))}

            <div
              className={cn(
                "flex flex-col gap-1",
                isOwnMessage ? "items-end" : "items-start"
              )}
            >
              {showName && (
                <span className="text-xs font-medium text-muted-foreground px-1">
                  {message.sender.name}
                </span>
              )}

              <div className="flex flex-col gap-1 items-end">
                {showTime && (
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-xs text-muted-foreground">
                      {formatMessageDate(message.sentAt)}
                    </span>
                  </div>
                )}
                <div className="flex items-end gap-1">
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 break-words",
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {isOwnMessage && (
                    <span className="text-muted-foreground mb-2">
                      {message.status === "READ" ? (
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      ) : message.status === "DELIVERED" ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <CheckCheck className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicators */}
      {typingUsers.length > 0 && (
        <div className="flex gap-3 max-w-[85%] mr-auto">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs">
              {getInitials(typingUsers[0].userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground px-1">
              {typingUsers.length === 1
                ? typingUsers[0].userName
                : `${typingUsers.length} people`}
            </span>
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <span className="animate-bounce [animation-delay:-0.3s]">
                  •
                </span>
                <span className="animate-bounce [animation-delay:-0.15s]">
                  •
                </span>
                <span className="animate-bounce">•</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
