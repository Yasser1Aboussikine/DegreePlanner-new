import { GraduationCap, BookOpen, FileCheck, TrendingUp, CheckCircle } from "lucide-react";
import { useGetStudentDashboardQuery } from "@/store/api/dashboardApi";
import { ProgressCard } from "@/shared/components/ProgressCard";

export const StudentDashboard = () => {
  const { data, isLoading, error } = useGetStudentDashboardQuery();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-destructive mt-1">Error loading dashboard data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your degree progress analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard
          title="Degree Progress"
          icon={GraduationCap}
          data={data?.degreeProgress || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Course Status Distribution"
          icon={BookOpen}
          data={data?.courseStatus || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Credits by Category"
          icon={FileCheck}
          data={data?.creditsByCategory || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Plan vs Expected Timeline"
          icon={TrendingUp}
          data={data?.timelineProgress || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Approval Status"
          icon={CheckCircle}
          data={data?.approvalStatus || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
