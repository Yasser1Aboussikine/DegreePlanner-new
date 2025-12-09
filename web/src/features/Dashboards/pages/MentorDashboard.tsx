import { Users, ClipboardCheck, BookOpen, AlertTriangle, TrendingUp } from "lucide-react";
import { ProgressCard } from "@/shared/components/ProgressCard";
import { useGetMentorDashboardQuery } from "@/store/api/dashboardApi";

export const MentorDashboard = () => {
  const { data, isLoading, error } = useGetMentorDashboardQuery();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mentor Dashboard</h1>
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
          <h1 className="text-3xl font-bold text-foreground">Mentor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Mentee group analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard
          title="Mentees by Overall Progress"
          icon={Users}
          data={data?.menteesProgress || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Mentees by Degree Plan Status"
          icon={ClipboardCheck}
          data={data?.planStatus || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Aggregate Credits by Category"
          icon={BookOpen}
          data={data?.aggregateCredits || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Risk Level Distribution"
          icon={AlertTriangle}
          data={data?.riskLevel || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Plan Decision Outcomes"
          icon={TrendingUp}
          data={data?.decisionOutcomes || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
