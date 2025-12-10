import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetUserByIdQuery } from "@/store/api/authApi";
import { useReportStudentMutation } from "@/store/api/mentorAssignmentApi";
import { useAppSelector } from "@/store/hooks";
import {
  PersonalInfoCard,
  AcademicInfoCard,
  AccountStatusCard,
} from "@/features/Profile/components";
import { ArrowLeft, User, Flag } from "lucide-react";
import { LoadingSpinner } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const [reportStudent, { isLoading: isReporting }] =
    useReportStudentMutation();

  // Determine the base path from the current location
  const currentPath = location.pathname;
  const roleMatch = currentPath.match(
    /^\/(student|admin|advisor|registrar|mentor)/
  );
  const basePath = roleMatch ? `/${roleMatch[1]}` : "/admin";
  const backRoute =
    basePath === "/admin" ? `${basePath}/users` : `${basePath}/students`;

  const { data, isLoading, error } = useGetUserByIdQuery(userId || "", {
    skip: !userId,
  });

  const user = data?.data;

  const handleReportStudent = async () => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting this student");
      return;
    }

    if (!userId) return;

    const toastId = toast.loading("Submitting report...");

    try {
      const result = await reportStudent({
        studentId: userId,
        reason: reportReason.trim(),
      }).unwrap();

      toast.success(
        result.message ||
          "Student report submitted successfully. Admin has been notified.",
        { id: toastId }
      );

      setIsReportDialogOpen(false);
      setReportReason("");
    } catch (error: any) {
      toast.error(
        error.data?.message || "Failed to submit report. Please try again.",
        { id: toastId }
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading user profile..." />;
  }

  if (error || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <p className="text-destructive">Failed to load user profile</p>
        <Button onClick={() => navigate(backRoute)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {basePath === "/admin" ? "Back to Users" : "Back to Students"}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => navigate(backRoute)}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {basePath === "/admin" ? "Back to Users" : "Back to Students"}
        </Button>

        {currentUser?.role === "MENTOR" && user?.role === "STUDENT" && (
          <Dialog
            open={isReportDialogOpen}
            onOpenChange={setIsReportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Report Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Student</DialogTitle>
                <DialogDescription>
                  Please provide a detailed reason for reporting{" "}
                  {user.name || "this student"}. This report will be sent to the
                  administrator.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label htmlFor="report-reason">Reason for Report *</Label>
                <Textarea
                  id="report-reason"
                  placeholder="Describe the issue or concern..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Please be specific and professional in your description.
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReportDialogOpen(false);
                    setReportReason("");
                  }}
                  disabled={isReporting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReportStudent}
                  disabled={isReporting || !reportReason.trim()}
                >
                  {isReporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag className="h-4 w-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">{user.name}'s Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfoCard
          name={user.name ?? undefined}
          email={user.email}
          role={user.role}
          joinDate={user.joinDate ? user.joinDate.toString() : undefined}
          emailVerified={!!user.emailVerifiedAt}
        />

        {(user.role === "STUDENT" || user.role === "MENTOR") && (
          <AcademicInfoCard
            major={user.major ?? undefined}
            minor={user.minor ?? undefined}
            classification={user.classification ?? undefined}
            expectedGraduation={
              user.expectedGraduation
                ? user.expectedGraduation.toString()
                : undefined
            }
            isFYEStudent={user.isFYEStudent}
          />
        )}

        <AccountStatusCard
          isActive={user.isActive}
          createdAt={user.createdAt?.toString() ?? new Date().toString()}
          updatedAt={user.updatedAt?.toString() ?? new Date().toString()}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
