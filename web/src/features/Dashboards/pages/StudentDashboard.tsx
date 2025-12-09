import { GraduationCap, BookOpen, Target, TrendingUp } from "lucide-react";
import { useGetStudentDashboardQuery } from "@/store/api/dashboardApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

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

  const completionPercentage = data?.completionPercentage || 0;
  const totalCourses = data?.totalCourses || 0;
  const completedCourses = data?.completedCourses || 0;
  const remainingCourses = data?.remainingCourses || 0;
  const totalCredits = data?.totalCredits || 0;
  const plannedCredits = data?.plannedCredits || 0;
  const remainingCredits = data?.remainingCredits || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your degree progress and course completion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedCourses} completed, {remainingCourses} remaining
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{plannedCredits} / {totalCredits}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {remainingCredits} credits remaining
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{completionPercentage}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Degree progress
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {completionPercentage >= 75 ? "On Track" : completionPercentage >= 50 ? "Good" : "Planning"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current status
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Degree Progress</CardTitle>
          <CardDescription>
            Your overall completion percentage across all requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Completion</span>
                <span className="text-muted-foreground">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-4" />
              <p className="text-xs text-muted-foreground">
                {plannedCredits} of {totalCredits} credits planned
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress by Category</CardTitle>
          <CardDescription>
            Track your progress in each course category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : data?.categoryProgress && data.categoryProgress.length > 0 ? (
            data.categoryProgress.map((category: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {category.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.earned} of {category.required} credits ({category.remaining} remaining)
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{category.percentage}%</span>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No course data available. Start planning your courses to see progress.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credit Distribution</CardTitle>
          <CardDescription>
            Distribution of credits across course categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
            <div className="space-y-3">
              {data.categoryDistribution.map((category: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{category.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{category.credits} credits</span>
                    <span className="text-sm font-semibold min-w-[3rem] text-right">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No credit distribution data available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
