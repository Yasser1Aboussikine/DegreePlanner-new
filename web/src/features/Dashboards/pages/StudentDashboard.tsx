import { GraduationCap, BookOpen, Target, TrendingUp } from "lucide-react";
import { useGetStudentDashboardQuery } from "@/store/api/dashboardApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Label } from "recharts";
import { useMemo } from "react";
import { getCategoryColor } from "@/utils/categoryColors";

export const StudentDashboard = () => {
  const { data, isLoading, error } = useGetStudentDashboardQuery();

  const chartConfig = useMemo(() => {
    const config: any = {};
    data?.categoryDistribution?.forEach((category: any) => {
      const key = category.category.toUpperCase().replace(/\s+/g, "_");
      config[key] = {
        label: category.category,
        color: getCategoryColor(key),
      };
    });
    return config;
  }, [data?.categoryDistribution]);

  const chartData = useMemo(() => {
    return data?.categoryDistribution?.map((category: any) => {
      const categoryKey = category.category.toUpperCase().replace(/\s+/g, "_");
      return {
        name: category.category,
        value: category.credits,
        percentage: category.percentage,
        fill: getCategoryColor(categoryKey),
      };
    }) || [];
  }, [data?.categoryDistribution]);

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
            <CardTitle className="text-base font-semibold">Total Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
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
            <CardTitle className="text-base font-semibold">Total Credits</CardTitle>
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
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
            <CardTitle className="text-base font-semibold">Completion</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
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
            <CardTitle className="text-base font-semibold">Status</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
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
              <Progress
                value={completionPercentage}
                className="h-4"
                style={{ '--progress-background': 'hsl(var(--primary))' } as React.CSSProperties}
              />
              <p className="text-xs text-muted-foreground">
                {plannedCredits} of {totalCredits} credits planned
              </p>
            </div>
          )}
        </CardContent>
      </Card>
{/* 
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
                <Progress
                  value={category.percentage}
                  className="h-2"
                  style={{ '--progress-background': 'hsl(var(--primary))' } as React.CSSProperties}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No course data available. Start planning your courses to see progress.
            </p>
          )}
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>Credit Distribution</CardTitle>
          <CardDescription>
            Distribution of credits across course categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Skeleton className="h-[400px] w-[400px] rounded-full" />
            </div>
          ) : data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, __, item) => (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.payload.fill }}
                          />
                          <span className="font-medium">{item.payload.name}:</span>
                          <span className="font-bold">{value} credits</span>
                          <span className="text-muted-foreground">({item.payload.percentage}%)</span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  strokeWidth={2}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {plannedCredits}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-sm"
                            >
                              Total Credits
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
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
