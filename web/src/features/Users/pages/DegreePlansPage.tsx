import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllDegreePlansQuery } from "@/store/api/degreePlanApi";
import CardLayout from "@/shared/CardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  GraduationCap,
  FileText,
} from "lucide-react";
import type { DegreePlan } from "@/store/types";

interface DegreePlanWithUser extends DegreePlan {
  user?: {
    id: string;
    name?: string;
    email: string;
    major?: string;
    classification?: string;
  };
}

interface ReviewStatusData {
  mentorReviewed: number;
  mentorPending: number;
  advisorReviewed: number;
  advisorPending: number;
  approved: number;
  rejected: number;
}

export const DegreePlansPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<DegreePlanWithUser | null>(
    null
  );

  const {
    data: degreePlansData,
    isLoading,
    error,
  } = useGetAllDegreePlansQuery();

  // Transform the data to include user info
  const degreePlans = useMemo(() => {
    if (!degreePlansData) return [];

    // The API should return degree plans with user info included
    return degreePlansData as DegreePlanWithUser[];
  }, [degreePlansData]);

  // Filter plans by student name
  const filteredPlans = useMemo(() => {
    if (!searchQuery.trim()) return degreePlans;

    const query = searchQuery.toLowerCase();
    return degreePlans.filter((plan) => {
      const studentName = plan.user?.name?.toLowerCase() || "";
      const studentEmail = plan.user?.email?.toLowerCase() || "";
      const major = plan.user?.major?.toLowerCase() || "";

      return (
        studentName.includes(query) ||
        studentEmail.includes(query) ||
        major.includes(query)
      );
    });
  }, [degreePlans, searchQuery]);

  // Calculate review status for a degree plan
  const getReviewStatus = (plan: DegreePlanWithUser): ReviewStatusData => {
    const status: ReviewStatusData = {
      mentorReviewed: 0,
      mentorPending: 0,
      advisorReviewed: 0,
      advisorPending: 0,
      approved: 0,
      rejected: 0,
    };

    if (!plan.semesters) return status;

    // Note: Review requests would be fetched from a separate API
    // For now, we're showing a placeholder implementation
    // You would need to extend the API to include review requests

    return status;
  };

  const handleCardClick = (plan: DegreePlanWithUser) => {
    setSelectedPlan(plan);
  };

  const handleViewFullPlan = (userId: string) => {
    navigate(`/admin/students/${userId}/plan`);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Error Loading Degree Plans
          </h2>
          <p className="text-muted-foreground mt-2">
            {(error as any)?.data?.message || "Failed to fetch degree plans"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Degree Plans
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage student degree plans
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by student name, email, or major..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Plans</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredPlans.length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold text-foreground">
                {
                  degreePlans.filter(
                    (p) => p.semesters && p.semesters.length > 0
                  ).length
                }
              </p>
            </div>
            <User className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Semesters</p>
              <p className="text-2xl font-bold text-foreground">
                {degreePlans.length > 0
                  ? (
                      degreePlans.reduce(
                        (sum, p) => sum + (p.semesters?.length || 0),
                        0
                      ) / degreePlans.length
                    ).toFixed(1)
                  : 0}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Degree Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-card border border-border rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : degreePlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <BookOpen className="h-20 w-20 text-muted-foreground" />
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-foreground">
              No Degree Plans in Database
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              There are currently no degree plans in the system. Students need
              to create their degree plans first, or you may need to run the
              database seeder.
            </p>
            <p className="text-sm text-muted-foreground mt-3 bg-muted/50 p-3 rounded-lg font-mono">
              Run:{" "}
              <span className="text-foreground font-semibold">
                pnpm seed:pg
              </span>{" "}
              in the server directory
            </p>
          </div>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              No Degree Plans Found
            </h2>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search criteria
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const reviewStatus = getReviewStatus(plan);
            const totalSemesters = plan.semesters?.length || 0;
            const totalCourses =
              plan.semesters?.reduce(
                (sum, sem) => sum + (sem.plannedCourses?.length || 0),
                0
              ) || 0;

            return (
              <CardLayout
                key={plan.id}
                title={
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {plan.user?.name || "Unknown Student"}
                  </div>
                }
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                onClick={() => handleCardClick(plan)}
              >
                <div className="space-y-3">
                  {/* Student Info */}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {plan.user?.email}
                    </p>
                    {plan.user?.major && (
                      <Badge variant="secondary" className="text-xs">
                        {plan.user.major}
                      </Badge>
                    )}
                    {plan.user?.classification && (
                      <Badge variant="outline" className="text-xs ml-2">
                        {plan.user.classification}
                      </Badge>
                    )}
                  </div>

                  {/* Program Info */}
                  {plan.program && (
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">
                        {plan.program.name}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Semesters</p>
                      <p className="text-lg font-semibold text-foreground">
                        {totalSemesters}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Courses</p>
                      <p className="text-lg font-semibold text-foreground">
                        {totalCourses}
                      </p>
                    </div>
                  </div>

                  {/* Review Status Indicators */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <div
                      className="flex items-center gap-1"
                      title="Mentor Review Status"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        Mentor: {reviewStatus.mentorReviewed}/{totalSemesters}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      title="Advisor Review Status"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-muted-foreground">
                        Advisor: {reviewStatus.advisorReviewed}/{totalSemesters}
                      </span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <p className="text-xs text-muted-foreground pt-2">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Updated{" "}
                    {plan.updatedAt
                      ? new Date(plan.updatedAt).toLocaleDateString()
                      : "recently"}
                  </p>
                </div>
              </CardLayout>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              {selectedPlan?.user?.name || "Student"}'s Degree Plan
            </DialogTitle>
            <DialogDescription>
              View detailed information about this student's academic plan
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">
                      {selectedPlan.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">
                      {selectedPlan.user?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Major</p>
                    <p className="font-medium text-foreground">
                      {selectedPlan.user?.major || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Classification</p>
                    <p className="font-medium text-foreground">
                      {selectedPlan.user?.classification || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Program Information */}
              {selectedPlan.program && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Program Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Program Name</p>
                      <p className="font-medium text-foreground">
                        {selectedPlan.program.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Program Code</p>
                      <p className="font-medium text-foreground">
                        {selectedPlan.program.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Level</p>
                      <p className="font-medium text-foreground">
                        {selectedPlan.program.level}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Credits</p>
                      <p className="font-medium text-foreground">
                        {selectedPlan.program.totalCredits}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Semesters Overview */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Semesters ({selectedPlan.semesters?.length || 0})
                </h3>
                {selectedPlan.semesters && selectedPlan.semesters.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPlan.semesters.map((semester) => (
                      <div
                        key={semester.id}
                        className="bg-muted/30 rounded-lg p-3 border border-border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-foreground">
                              {semester.term} {semester.year}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Semester {semester.nth_semestre}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {semester.plannedCourses?.length || 0} courses
                          </Badge>
                        </div>
                        {semester.plannedCourses &&
                          semester.plannedCourses.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {semester.plannedCourses
                                .slice(0, 3)
                                .map((course) => (
                                  <p
                                    key={course.id}
                                    className="text-xs text-muted-foreground"
                                  >
                                    • {course.courseCode} -{" "}
                                    {course.courseTitle || "Untitled"}
                                  </p>
                                ))}
                              {semester.plannedCourses.length > 3 && (
                                <p className="text-xs text-muted-foreground italic">
                                  + {semester.plannedCourses.length - 3} more
                                  courses
                                </p>
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No semesters planned yet
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (selectedPlan.user?.id) {
                      handleViewFullPlan(selectedPlan.user.id);
                    }
                  }}
                >
                  View Full Plan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DegreePlansPage;
