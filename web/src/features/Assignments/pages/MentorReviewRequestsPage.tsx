import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  FileText,
  User,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useGetPendingMentorReviewsQuery,
  useSubmitBulkMentorReviewMutation,
} from "@/store/api/reviewRequestApi";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import type { PlanSemesterReviewRequest } from "@/store/types";

export const MentorReviewRequestsPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetPendingMentorReviewsQuery(
    user?.id || "",
    {
      skip: !user?.id,
    }
  );
  const [submitBulkMentorReview, { isLoading: isSubmitting }] =
    useSubmitBulkMentorReviewMutation();

  const [selectedRequests, setSelectedRequests] = useState<
    PlanSemesterReviewRequest[]
  >([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [generalRejectionReason, setGeneralRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(true);

  const reviewRequests = data?.data || [];

  const groupedRequests = reviewRequests.reduce((acc, request) => {
    const studentId = request.student?.id || "unknown";
    if (!acc[studentId]) {
      acc[studentId] = [];
    }
    acc[studentId].push(request);
    return acc;
  }, {} as Record<string, PlanSemesterReviewRequest[]>);

  const handleOpenReviewDialog = (
    requests: PlanSemesterReviewRequest[],
    approve: boolean
  ) => {
    setSelectedRequests(requests);
    setIsApproving(approve);
    setGeneralRejectionReason("");
    setShowReviewDialog(true);
  };

  const handleSubmitReview = async () => {
    if (selectedRequests.length === 0) return;

    if (!isApproving && !generalRejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    const degreePlanId =
      selectedRequests[0]?.planSemester?.degreePlan?.id ||
      selectedRequests[0]?.planSemester?.degreePlanId;
    if (!degreePlanId) {
      toast.error("Degree plan ID not found");
      return;
    }

    try {
      await submitBulkMentorReview({
        degreePlanId,
        approve: isApproving,
        semesterComments: [], // Comments are now added from View Degree Plan page
        generalRejectionReason: !isApproving
          ? generalRejectionReason.trim()
          : undefined,
      }).unwrap();

      toast.success(
        isApproving
          ? "Degree plan approved and forwarded to advisor"
          : "Degree plan rejected successfully"
      );
      setShowReviewDialog(false);
      setSelectedRequests([]);
      setGeneralRejectionReason("");
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to submit review";
      toast.error(errorMessage);
      console.error("Error submitting review:", error);
    }
  };

  const handleViewDegreePlan = (studentId: string) => {
    navigate(`/mentor/students/${studentId}/degree-plan`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">
            Loading review requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Pending Review Requests
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and approve degree plans from your assigned students
        </p>
      </div>

      {Object.keys(groupedRequests).length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            No Pending Reviews
          </h2>
          <p className="text-muted-foreground">
            You don't have any pending review requests at the moment.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRequests).map(([studentId, requests]) => {
            const student = requests[0]?.student;

            return (
              <Card key={studentId} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {student?.name || "Unknown Student"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student?.email}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {student?.major && (
                          <Badge variant="secondary">{student.major}</Badge>
                        )}
                        {student?.minor && (
                          <Badge variant="outline">{student.minor}</Badge>
                        )}
                        {student?.classification && (
                          <Badge variant="outline">
                            {student.classification}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Requested{" "}
                      {new Date(requests[0].requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>{requests.length}</strong> semester(s) pending
                    review
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {requests.map((request) => (
                      <Badge key={request.id} variant="secondary">
                        {request.planSemester?.term}{" "}
                        {request.planSemester?.year}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleViewDegreePlan(studentId)}
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Degree Plan
                  </Button>
                  <Button
                    onClick={() => handleOpenReviewDialog(requests, true)}
                    variant="default"
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleOpenReviewDialog(requests, false)}
                    variant="destructive"
                    disabled={isSubmitting}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isApproving ? "Approve" : "Reject"} Degree Plan
            </DialogTitle>
            <DialogDescription>
              {isApproving
                ? "You are about to approve this degree plan and forward it to the advisor. Comments can be added from the View Degree Plan page."
                : "Please provide a general reason for rejection. Semester-specific comments can be added from the View Degree Plan page."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!isApproving && (
              <div>
                <Label htmlFor="generalRejectionReason">
                  General Rejection Reason (Required)
                </Label>
                <Textarea
                  id="generalRejectionReason"
                  value={generalRejectionReason}
                  onChange={(e) => setGeneralRejectionReason(e.target.value)}
                  placeholder="Explain why this degree plan needs revision..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant={isApproving ? "default" : "destructive"}
              onClick={handleSubmitReview}
              disabled={
                isSubmitting || (!isApproving && !generalRejectionReason.trim())
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>{isApproving ? "Approve & Forward to Advisor" : "Reject"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
