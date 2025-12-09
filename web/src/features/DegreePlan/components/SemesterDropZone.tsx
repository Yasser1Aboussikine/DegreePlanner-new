import { useDroppable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { CourseCard } from "./CourseCard";
import { Plus, Calendar, MessageSquare, User2, Edit3 } from "lucide-react";
import type { SemesterData } from "../types/dndTypes";
import { getTermBadgeClasses } from "@/utils/categoryColors";
import { memo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CommentsModal } from "./CommentsModal";

interface SemesterDropZoneProps {
  semester: SemesterData;
  onRemoveCourse?: (courseId: string) => void;
  mentorComment?: string | null;
  advisorComment?: string | null;
  reviewStatus?: string | null;
  rejectionReason?: string | null;
  canEditComment?: boolean;
  userRole?: "mentor" | "advisor" | "student";
  onCommentChange?: (semesterId: string, comment: string) => void;
}

export const SemesterDropZone = memo(function SemesterDropZone({
  semester,
  onRemoveCourse,
  mentorComment,
  advisorComment,
  reviewStatus,
  rejectionReason,
  canEditComment = false,
  userRole = "student",
  onCommentChange,
}: SemesterDropZoneProps) {
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [localComment, setLocalComment] = useState("");
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  // Guard against undefined semester
  if (!semester || !semester.id) {
    console.error(
      "SemesterDropZone: semester is undefined or missing id",
      semester
    );
    return null;
  }

  const { setNodeRef, isOver } = useDroppable({
    id: semester.id,
    data: {
      type: "semester",
      semester,
    },
  });

  const hasComments = mentorComment || advisorComment;
  const hasFeedback =
    hasComments ||
    rejectionReason
  const canAddComment =
    canEditComment && (userRole === "mentor" || userRole === "advisor");
  const existingComment =
    userRole === "mentor" ? mentorComment : advisorComment;

  const handleStartEdit = () => {
    setLocalComment(existingComment || "");
    setIsEditingComment(true);
  };

  const handleCancelEdit = () => {
    setIsEditingComment(false);
    setLocalComment("");
  };

  const handleSaveComment = () => {
    if (onCommentChange) {
      onCommentChange(semester.id, localComment.trim());
    }
    setIsEditingComment(false);
  };

  return (
    <Card className="p-4 transition-all duration-200 h-full flex flex-col bg-card border-border relative">
      {/* Status Badge - Top Right */}
      {reviewStatus && (
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              reviewStatus === "APPROVED"
                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                : reviewStatus === "REJECTED"
                ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                : reviewStatus === "PENDING_ADVISOR"
                ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                : "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
            }`}
          >
            {reviewStatus.replace("_", " ")}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1 pr-24">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-card-foreground">
              {semester.semesterName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTermBadgeClasses(
                  semester.term
                )}`}
              >
                {semester.term}
              </span>
              <span className="text-xs text-muted-foreground">
                {semester.year}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-1">
          <p className="text-sm font-medium text-card-foreground">
            {semester.totalCredits} Credits
          </p>
          <p className="text-xs text-muted-foreground">
            {semester.courses.length} Courses
          </p>
        </div>
      </div>
      {/* View Feedback button - full width row for students */}
      {hasFeedback && userRole === "student" && (
        <div className="mb-4">
          <Button
            onClick={() => setIsCommentsModalOpen(true)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            View Feedback
          </Button>
        </div>
      )}{" "}
      {/* Mentors/Advisors see comments inline */}
      {hasComments && userRole !== "student" && (
        <div className="mb-4 space-y-2">
          {mentorComment && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <User2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                    Mentor Feedback
                  </p>
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    {mentorComment}
                  </p>
                </div>
              </div>
            </div>
          )}
          {advisorComment && (
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                    Advisor Feedback
                  </p>
                  <p className="text-sm text-purple-900 dark:text-purple-100">
                    {advisorComment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {canAddComment && !isEditingComment && (
        <div className="mb-4">
          <Button
            onClick={handleStartEdit}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {existingComment
              ? `Edit ${userRole === "mentor" ? "Mentor" : "Advisor"} Comment`
              : `Add ${userRole === "mentor" ? "Mentor" : "Advisor"} Comment`}
          </Button>
        </div>
      )}
      {canAddComment && isEditingComment && (
        <div className="mb-4 p-4 rounded-lg border border-border bg-muted/50">
          <Label
            htmlFor={`comment-${semester.id}`}
            className="text-sm font-medium mb-2 block"
          >
            {userRole === "mentor" ? "Mentor" : "Advisor"} Comment for{" "}
            {semester.semesterName}
          </Label>
          <Textarea
            id={`comment-${semester.id}`}
            value={localComment}
            onChange={(e) => setLocalComment(e.target.value)}
            placeholder={`Enter your feedback for ${semester.semesterName}...`}
            rows={4}
            className="mb-3 resize-none"
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveComment} size="sm" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Save Comment
            </Button>
            <Button onClick={handleCancelEdit} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This comment will be saved locally. Submit via the review dialog to
            persist permanently.
          </p>
        </div>
      )}
      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[100px] flex-1 flex flex-col transition-all duration-200 rounded-lg overflow-y-auto ${
          isOver ? "ring-2 ring-primary bg-primary/5" : ""
        }`}
      >
        {semester.courses.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center flex-1 border-2 border-dashed rounded-lg ${
              isOver ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Drop courses here</p>
          </div>
        ) : (
          semester.courses.map((course) => (
            <div key={course.id} className="flex items-center gap-2">
              <div className="flex-1">
                <CourseCard
                  course={course}
                  isDraggable={true}
                  isInSemester={true}
                />
              </div>
              {onRemoveCourse && (
                <button
                  onClick={() => onRemoveCourse(course.id)}
                  className="flex-shrink-0 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-2 transition-colors"
                  aria-label="Remove course"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <CommentsModal
        open={isCommentsModalOpen}
        onOpenChange={setIsCommentsModalOpen}
        semesterName={semester.semesterName}
        mentorComment={mentorComment}
        advisorComment={advisorComment}
        reviewStatus={reviewStatus}
        rejectionReason={rejectionReason}
      />
    </Card>
  );
});
