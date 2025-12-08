import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useGetStudentDashboardStatsQuery } from "@/store/api/dashboardApi";
import { useGetMyDegreePlanQuery } from "@/store/api/degreePlanApi";
import { useGetProgramByIdQuery } from "@/store/api/programApi";
import { CreditsPieChart, CategoryProgress } from "../components";

export function StudentDashboard() {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
  } = useGetStudentDashboardStatsQuery();
  const { data: degreePlanData } = useGetMyDegreePlanQuery();
  const { data: programData } = useGetProgramByIdQuery(
    degreePlanData?.programId || "",
    {
      skip: !degreePlanData?.programId,
    }
  );

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (statsError || !statsData) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">No Degree Plan Found</h2>
          <p className="text-muted-foreground mt-2">
            Please create a degree plan to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const {
    categoryProgress,
    semesterStats,
    totalCredits,
    overallProgress,
    creditProgress,
    creditsData,
  } = statsData;

  const program = programData?.data;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Student Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your academic progress and achievements
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Overall Progress</p>
          <p className="text-3xl font-bold text-primary">
            {overallProgress.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Credits
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                {totalCredits.planned} / {totalCredits.total}
              </p>
              <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500"
                  style={{ width: `${creditProgress}%` }}
                />
              </div>
            </div>
            <Award className="h-12 w-12 text-blue-600 dark:text-blue-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Total Semesters
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                {semesterStats.total}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                Planned in degree plan
              </p>
            </div>
            <Calendar className="h-12 w-12 text-green-600 dark:text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Courses Planned
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {categoryProgress.reduce((sum, cat) => sum + cat.planned, 0)} /{" "}
                {categoryProgress.reduce((sum, cat) => sum + cat.required, 0)}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                Across all categories
              </p>
            </div>
            <BookOpen className="h-12 w-12 text-purple-600 dark:text-purple-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                {overallProgress.toFixed(0)}%
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                On track
              </p>
            </div>
            <Clock className="h-12 w-12 text-orange-600 dark:text-orange-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6">
        <CreditsPieChart
          creditsData={creditsData}
          totalCredits={totalCredits}
        />
      </div>

      {/* Category Progress */}
      <CategoryProgress categoryProgress={categoryProgress} />

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm">Planned Courses</span>
              <span className="font-semibold">
                {categoryProgress.reduce((sum, cat) => sum + cat.planned, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm">Required Courses</span>
              <span className="font-semibold text-orange-600">
                {categoryProgress.reduce((sum, cat) => sum + cat.required, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm">Remaining Courses</span>
              <span className="font-semibold text-red-600">
                {categoryProgress.reduce(
                  (sum, cat) => sum + (cat.required - cat.planned),
                  0
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm">Average Completion Rate</span>
              <span className="font-semibold text-primary">
                {overallProgress.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Degree Requirements
          </h3>
          <div className="space-y-3">
            {program && (
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded">
                <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                  Program
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {program.name} ({program.code})
                </p>
              </div>
            )}
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/30 rounded">
              <p className="font-medium text-sm text-purple-900 dark:text-purple-100">
                Minimum Credits Required
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                {program?.totalCredits || totalCredits.total} credit hours total
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30 rounded">
              <p className="font-medium text-sm text-green-900 dark:text-green-100">
                Current Progress
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                {totalCredits.planned} credits planned (
                {creditProgress.toFixed(1)}%)
              </p>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/30 rounded">
              <p className="font-medium text-sm text-orange-900 dark:text-orange-100">
                Credits Remaining
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                {totalCredits.total - totalCredits.planned} credits to graduate
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
