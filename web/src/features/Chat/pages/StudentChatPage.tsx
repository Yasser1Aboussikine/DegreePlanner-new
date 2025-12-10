import { useAppSelector } from "@/store/hooks";
import { useGetUserThreadsQuery } from "@/store/api/chatApi";
import { ChatWindow } from "@/components/chat";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui";

export const StudentChatPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  const {
    data: threads = [],
    isLoading,
    error,
  } = useGetUserThreadsQuery(undefined, {
    skip: !user?.id,
  });

  const mentorThread = threads[0];

  if (isLoading) {
    return <LoadingSpinner message="Loading chat..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load chat. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!mentorThread) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              No chat available yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll be able to chat once you're assigned a mentor
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
        <h1 className="text-3xl font-bold">Chat with Mentor & Peers</h1>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <ChatWindow
          threadId={mentorThread.id}
          threadTitle={mentorThread.title || "Mentor Group Chat"}
          currentUserId={user?.id || ""}
          currentUserRole="STUDENT"
        />
      </div>
    </div>
  );
};

export default StudentChatPage;
