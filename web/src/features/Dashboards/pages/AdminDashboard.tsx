import { Users, BookOpen, GraduationCap, Shield } from "lucide-react";
import { ProgressCard } from "@/shared/components/ProgressCard";
import { useGetAdminDashboardQuery } from "@/store/api/dashboardApi";

export const AdminDashboard = () => {
  const { data, isLoading, error } = useGetAdminDashboardQuery();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
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
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System-wide analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard
          title="Users by Role"
          icon={Users}
          data={data?.usersByRole || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="System Activity"
          icon={Shield}
          data={data?.systemActivity || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Course Catalog Status"
          icon={BookOpen}
          data={data?.courseCatalog || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Overall Degree Progress"
          icon={GraduationCap}
          data={data?.degreeProgress || []}
          isLoading={isLoading}
        />
        {/* <ProgressCard
          title="Approval Workflow Status"
          icon={TrendingUp}
          data={data?.approvalWorkflow || []}
          isLoading={isLoading}
        /> */}
      </div>
    </div>
  );
};
