import { useAppSelector } from "@/store/hooks";
import { useGetMentorGroupChatQuery } from "@/store/api/chatApi";
import { ChatWindow } from "@/components/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageCircle, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const MentorGroupChatPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  const {
    data: thread,
    isLoading,
    error,
  } = useGetMentorGroupChatQuery(undefined, {
    skip: !user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load group chat. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              No group chat available
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Group chats are created when you have assigned students
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Group Chat</h1>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <ChatWindow
          threadId={thread.id}
          threadTitle={thread.title || "Group Chat with Students"}
          currentUserId={user?.id || ""}
          currentUserRole="MENTOR"
        />
      </div>
    </div>
  );
};

export default MentorGroupChatPage;
