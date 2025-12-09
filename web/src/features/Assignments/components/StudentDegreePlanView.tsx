import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  MessageSquare,
  User2,
} from "lucide-react";
import { useGetDegreePlanByUserIdQuery } from "@/store/api/degreePlanApi";
import {
  useGetReviewRequestsByStudentIdQuery,
  useUpdateReviewRequestCommentMutation,
} from "@/store/api/reviewRequestApi";
import { getCategoryColor } from "@/utils/categoryColors";
import { toast } from "sonner";
import type { Category, PlanSemesterWithCourses } from "@/store/types";

interface StudentDegreePlanViewProps {
  role: "mentor" | "advisor";
}

export const StudentDegreePlanView = ({ role }: StudentDegreePlanViewProps) => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);
  const [semesterComments, setSemesterComments] = useState<
    Record<string, string>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: degreePlanData, isLoading } = useGetDegreePlanByUserIdQuery(
    studentId || "",
    { skip: !studentId }
  );

  const { data: reviewRequestsData } = useGetReviewRequestsByStudentIdQuery(
    studentId || "",
    { skip: !studentId }
  );

  const [updateComment] = useUpdateReviewRequestCommentMutation();

  const degreePlan = degreePlanData;
  const semesters = degreePlan?.semesters || [];
  const currentSemester = semesters[currentSemesterIndex];

  const reviewRequestsMap = new Map(
    (reviewRequestsData?.data || []).map((req) => [req.planSemesterId, req])
  );

  const currentReviewRequest = currentSemester
    ? reviewRequestsMap.get(currentSemester.id)
    : undefined;

  const handlePreviousSemester = () => {
    if (currentSemesterIndex > 0) {
      setCurrentSemesterIndex(currentSemesterIndex - 1);
    }
  };

  const handleNextSemester = () => {
    if (currentSemesterIndex < semesters.length - 1) {
      setCurrentSemesterIndex(currentSemesterIndex + 1);
    }
  };

  const handleBack = () => {
    navigate(`/${role}/review-requests`);
  };

  const handleUpdateComment = (semesterId: string, comment: string) => {
    setSemesterComments((prev) => ({
      ...prev,
      [semesterId]: comment,
    }));
  };

  const handleSaveComment = async () => {
    if (!currentSemester || !currentReviewRequest) return;

    const comment = semesterComments[currentSemester.id];
    if (comment === undefined) {
      toast.info("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      await updateComment({
        id: currentReviewRequest.id,
        role,
        comment,
      }).unwrap();

      toast.success("Comment saved successfully");

      // Clear the local comment state after successful save
      setSemesterComments((prev) => {
        const newState = { ...prev };
        delete newState[currentSemester.id];
        return newState;
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save comment");
    } finally {
      setIsSaving(false);
    }
  };

  const getTotalCredits = (semester: PlanSemesterWithCourses) => {
    return semester.plannedCourses.reduce(
      (sum, course) => sum + (course.credits || 0),
      0
    );
  };

  const totalCreditsPlanned = semesters.reduce(
    (sum: number, sem: PlanSemesterWithCourses) => sum + getTotalCredits(sem),
    0
  );

  const totalCoursesPlanned = semesters.reduce(
    (sum: number, sem: PlanSemesterWithCourses) =>
      sum + sem.plannedCourses.length,
    0
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 bg-background">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!degreePlan) {
    return (
      <div className="container mx-auto p-6 bg-background">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            Degree Plan Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            This student doesn't have a degree plan yet.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Review Requests
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Review Requests
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          Student Degree Plan
        </h1>
        <p className="text-muted-foreground mt-2">
          {totalCoursesPlanned} courses · {totalCreditsPlanned} credits planned
        </p>
      </div>

      {semesters.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            No Semesters Planned
          </h2>
          <p className="text-muted-foreground">
            This student hasn't added any semesters to their degree plan yet.
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePreviousSemester}
                disabled={currentSemesterIndex === 0}
                variant="outline"
                size="icon"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Select
                value={currentSemesterIndex.toString()}
                onValueChange={(value) =>
                  setCurrentSemesterIndex(parseInt(value))
                }
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(
                    (semester: PlanSemesterWithCourses, index: number) => (
                      <SelectItem key={semester.id} value={index.toString()}>
                        {semester.term} {semester.year}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Button
                onClick={handleNextSemester}
                disabled={currentSemesterIndex === semesters.length - 1}
                variant="outline"
                size="icon"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {currentSemester && (
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-card-foreground mb-2">
                  {currentSemester.term} {currentSemester.year}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentSemester.plannedCourses.length} courses ·{" "}
                  {getTotalCredits(currentSemester)} credits
                </p>
              </div>

              {currentSemester.plannedCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No courses planned for this semester
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentSemester.plannedCourses.map((course: any) => (
                    <Card
                      key={course.id}
                      className="p-4 border-l-4"
                      style={{
                        borderLeftColor: getCategoryColor(
                          course.category as Category
                        ),
                      }}
                    >
                      <div className="mb-2">
                        <h3 className="font-semibold text-card-foreground">
                          {course.courseCode}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.courseTitle}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {course.category?.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-sm font-medium text-card-foreground whitespace-nowrap">
                          {course.credits || 0} credits
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Review Comments for {currentSemester.term}{" "}
                  {currentSemester.year}
                </h3>

                {currentReviewRequest?.mentorComment && (
                  <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <User2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                          Mentor Feedback
                        </p>
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          {currentReviewRequest.mentorComment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentReviewRequest?.advisorComment && (
                  <div className="mb-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-1">
                          Advisor Feedback
                        </p>
                        <p className="text-sm text-purple-900 dark:text-purple-100">
                          {currentReviewRequest.advisorComment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentSemester && (
                  <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                    <Label
                      htmlFor={`comment-${currentSemester.id}`}
                      className="text-base font-semibold mb-2 block flex items-center gap-2"
                    >
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Add Your {role === "mentor" ? "Mentor" : "Advisor"}{" "}
                      Comment
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Provide feedback for this semester to help guide the
                      student's course planning
                    </p>
                    <Textarea
                      id={`comment-${currentSemester.id}`}
                      value={
                        semesterComments[currentSemester.id] !== undefined
                          ? semesterComments[currentSemester.id]
                          : role === "mentor"
                          ? currentReviewRequest?.mentorComment || ""
                          : currentReviewRequest?.advisorComment || ""
                      }
                      onChange={(e) =>
                        handleUpdateComment(currentSemester.id, e.target.value)
                      }
                      placeholder={`Enter your feedback for ${currentSemester.term} ${currentSemester.year}...`}
                      rows={4}
                      className="resize-none bg-background"
                      disabled={isSaving}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>
                          <strong>Note:</strong> Click Save to persist your
                          comment for this semester
                        </p>
                      </div>
                      <Button
                        onClick={handleSaveComment}
                        disabled={
                          isSaving ||
                          semesterComments[currentSemester.id] === undefined
                        }
                        size="sm"
                      >
                        {isSaving ? "Saving..." : "Save Comment"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
