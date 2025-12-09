import { Building2, BookOpen, BarChart3, Archive, GraduationCap } from "lucide-react";
import { ProgressCard } from "@/shared/components/ProgressCard";
import { useGetRegistrarDashboardQuery } from "@/store/api/dashboardApi";

export const RegistrarDashboard = () => {
  const { data, isLoading, error } = useGetRegistrarDashboardQuery();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Registrar Dashboard</h1>
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
          <h1 className="text-3xl font-bold text-foreground">Registrar Dashboard</h1>
          <p className="text-muted-foreground mt-1">Catalog and program analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard
          title="Programs by Department"
          icon={Building2}
          data={data?.programsByDepartment || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Courses by Type"
          icon={BookOpen}
          data={data?.coursesByType || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Courses by Level"
          icon={BarChart3}
          data={data?.coursesByLevel || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Active vs Inactive Courses"
          icon={Archive}
          data={data?.activeCourses || []}
          isLoading={isLoading}
        />
        <ProgressCard
          title="Programs by Required Credits"
          icon={GraduationCap}
          data={data?.programCredits || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
