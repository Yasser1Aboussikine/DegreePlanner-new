import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { User2, MessageSquare } from "lucide-react";

interface CommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterName: string;
  mentorComment?: string | null;
  advisorComment?: string | null;
}

export function CommentsModal({
  open,
  onOpenChange,
  semesterName,
  mentorComment,
  advisorComment,
}: CommentsModalProps) {
  const hasMentorComment = !!mentorComment;
  const hasAdvisorComment = !!advisorComment;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Feedback for {semesterName}</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={hasMentorComment ? "mentor" : "advisor"}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mentor" className="flex items-center gap-2">
              <User2 className="h-4 w-4" />
              Mentor Feedback
            </TabsTrigger>
            <TabsTrigger value="advisor" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Advisor Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentor" className="mt-4">
            {hasMentorComment ? (
              <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <User2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      Mentor Feedback
                    </p>
                    <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-wrap">
                      {mentorComment}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <User2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No mentor feedback yet for this semester.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="advisor" className="mt-4">
            {hasAdvisorComment ? (
              <Card className="p-4 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                      Advisor Feedback
                    </p>
                    <p className="text-sm text-purple-900 dark:text-purple-100 whitespace-pre-wrap">
                      {advisorComment}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No advisor feedback yet for this semester.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
