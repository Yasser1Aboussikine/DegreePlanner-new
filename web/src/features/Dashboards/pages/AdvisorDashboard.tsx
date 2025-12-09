import { Users, CheckCircle, BookOpen, AlertTriangle, GraduationCap } from "lucide-react";
import { ProgressCard } from "@/shared/components/ProgressCard";
import { useGetAdvisorDashboardQuery } from "@/store/api/dashboardApi";

export const AdvisorDashboard = () => {
  const { data, isLoading, error } = useGetAdvisorDashboardQuery();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advisor Dashboard</h1>
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
          <h1 className="text-3xl font-bold text-foreground">Advisor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Student oversight analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard
          title="Students by Degree Plan Status"
          icon={Users}
          data={data?.studentPlanStatus || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Advisor Decision Distribution"
          icon={CheckCircle}
          data={data?.advisorDecision || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Requirements Coverage"
          icon={BookOpen}
          data={data?.requirementsCoverage || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Students by Risk Category"
          icon={AlertTriangle}
          data={data?.studentRisk || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Students by Classification"
          icon={GraduationCap}
          data={data?.classification || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
