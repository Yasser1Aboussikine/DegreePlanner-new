import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Select from "react-select";
import {
  useGetCourseByIdQuery,
  useGetCoursePrerequisitesQuery,
  useGetCourseDependentsQuery,
  useGetAllCoursesQuery,
  useAddPrerequisiteMutation,
  useRemovePrerequisiteMutation,
} from "@/store/api/coursesApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, GraduationCap, Network, X } from "lucide-react";
import { toast } from "sonner";

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Determine the base path from the current location
  const currentPath = window.location.pathname;
  const roleMatch = currentPath.match(
    /^\/(student|admin|advisor|registrar|mentor)/
  );
  const basePath = roleMatch ? `/${roleMatch[1]}` : "/student";
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "ADMIN" || userRole === "REGISTRAR";

  // State for selected prerequisite
  const [selectedPrerequisite, setSelectedPrerequisite] = useState<{
    value: string;
    label: string;
  } | null>(null);

  // Mutations
  const [addPrerequisite, { isLoading: isAddingPrereq }] =
    useAddPrerequisiteMutation();
  const [removePrerequisite, { isLoading: isRemovingPrereq }] =
    useRemovePrerequisiteMutation();

  // Get all courses for the select dropdown
  const { data: allCoursesData } = useGetAllCoursesQuery();

  const {
    data: courseResponse,
    isLoading: courseLoading,
    error: courseError,
  } = useGetCourseByIdQuery(id || "", { skip: !id });

  const { data: prerequisitesData, isLoading: prereqLoading } =
    useGetCoursePrerequisitesQuery(id || "", {
      skip: !id,
      refetchOnMountOrArgChange: true,
    });

  const { data: dependentsData, isLoading: depLoading } =
    useGetCourseDependentsQuery(id || "", {
      skip: !id,
      refetchOnMountOrArgChange: true,
    });

  const course = Array.isArray(courseResponse?.data)
    ? courseResponse.data[0]
    : courseResponse?.data;

  // Prepare options for react-select (exclude current course, prerequisites, and dependents)
  const courseOptions = useMemo(() => {
    if (!allCoursesData?.data || !course) return [];

    const currentCourseId = course.id;
    const prerequisiteIds = new Set(
      (prerequisitesData || []).map((p: any) => p.id)
    );
    const dependentIds = new Set((dependentsData || []).map((d: any) => d.id));

    return allCoursesData.data
      .filter(
        (c: any) =>
          c.id !== currentCourseId &&
          !prerequisiteIds.has(c.id) &&
          !dependentIds.has(c.id)
      )
      .map((c: any) => ({
        value: c.id,
        label: `${c.course_code} - ${c.course_title}`,
        credits: c.n_credits,
      }));
  }, [allCoursesData, course, prerequisitesData, dependentsData]);

  // Handle adding a prerequisite
  const handleAddPrerequisite = async (
    option: { value: string; label: string } | null
  ) => {
    if (!id || !option) return;

    const { value: prerequisiteId } = option;

    // Clear selection immediately for better UX
    setSelectedPrerequisite(null);

    try {
      await addPrerequisite({ id, prerequisiteId }).unwrap();
      toast.success("Prerequisite added successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add prerequisite");
    }
  };

  // Handle removing a prerequisite
  const handleRemovePrerequisite = async (prerequisiteId: string) => {
    if (!id) return;

    try {
      await removePrerequisite({ id, prerequisiteId }).unwrap();
      toast.success("Prerequisite removed successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove prerequisite");
    }
  };

  if (courseLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-48 w-full mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (courseError || !courseResponse?.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Network className="h-16 w-16 text-muted-foreground opacity-20" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Course Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Network className="h-16 w-16 text-muted-foreground opacity-20" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Course Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const prerequisites = prerequisitesData || [];
  const dependents = dependentsData || [];

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Button>

      {/* Course Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-3xl">{course.course_code}</CardTitle>
                {course.labels &&
                  course.labels.map((label: string) => (
                    <Badge key={label} variant="secondary">
                      {label}
                    </Badge>
                  ))}
              </div>
              <CardDescription className="text-xl">
                {course.course_title}
              </CardDescription>
            </div>
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            {course.disciplines && course.disciplines.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">{course.disciplines[0]}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>
                {course.n_credits} Credits ({course.sch_credits} SCH)
              </span>
            </div>
          </div>

          {/* Elective Badges */}
          <div className="flex gap-2 flex-wrap mt-2">
            {course.isElective && (
              <Badge variant="outline" className="bg-primary/10">
                General Elective
              </Badge>
            )}
            {course.isMinorElective && (
              <Badge variant="outline" className="bg-secondary/10">
                Minor Elective
              </Badge>
            )}
            {course.isSpecElective && (
              <Badge variant="outline" className="bg-accent/10">
                Specialization Elective
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for Details */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prerequisites">
            Prerequisites{" "}
            {prerequisites.length > 0 && `(${prerequisites.length})`}
          </TabsTrigger>
          <TabsTrigger value="dependents">
            Dependents {dependents.length > 0 && `(${dependents.length})`}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {course.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Course Code
                  </div>
                  <div className="text-base font-semibold">
                    {course.course_code}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Discipline
                  </div>
                  <div className="text-base font-semibold">
                    {course.disciplines && course.disciplines.length > 0
                      ? course.disciplines[0]
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Credits
                  </div>
                  <div className="text-base font-semibold">
                    {course.n_credits} credits
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    SCH Credits
                  </div>
                  <div className="text-base font-semibold">
                    {course.sch_credits}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Categories
                </div>
                <div className="flex gap-2 flex-wrap">
                  {course.labels && course.labels.length > 0 ? (
                    course.labels.map((label: string) => (
                      <Badge key={label} variant="secondary">
                        {label}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No categories assigned
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prerequisites Tab */}
        <TabsContent value="prerequisites" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Prerequisites
                  </CardTitle>
                  <CardDescription>
                    Courses that must be completed before taking{" "}
                    {course.course_code}
                  </CardDescription>
                </div>
                {isAdmin && (
                  <div className="w-96">
                    <Select
                      value={selectedPrerequisite}
                      onChange={handleAddPrerequisite}
                      options={courseOptions}
                      placeholder="Search and select a course to add..."
                      isClearable
                      isSearchable
                      isLoading={isAddingPrereq}
                      isDisabled={isAddingPrereq}
                      className="text-sm"
                      classNamePrefix="select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "white",
                          borderColor: state.isFocused
                            ? "#86efac"
                            : "#bbf7d0",
                          borderWidth: "2px",
                          borderRadius: "0.5rem",
                          minHeight: "44px",
                          boxShadow: state.isFocused
                            ? "0 0 0 2px rgba(134, 239, 172, 0.2)"
                            : "none",
                          "&:hover": {
                            borderColor: "#86efac",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "white",
                          border: "1px solid #bbf7d0",
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          overflow: "hidden",
                        }),
                        menuList: (base) => ({
                          ...base,
                          padding: "0.25rem",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#15803d"
                            : "transparent",
                          color: state.isFocused ? "white" : "hsl(var(--foreground))",
                          cursor: "pointer",
                          padding: "12px 16px",
                          borderRadius: "0.375rem",
                          transition: "all 0.15s ease",
                          fontWeight: "600",
                          "&:active": {
                            backgroundColor: "#166534",
                          },
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "hsl(var(--foreground))",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                        }),
                        input: (base) => ({
                          ...base,
                          color: "hsl(var(--foreground))",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "hsl(var(--muted-foreground))",
                          fontSize: "0.95rem",
                        }),
                      }}
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {prereqLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : prerequisites.length > 0 ? (
                <div className="space-y-3">
                  {prerequisites.map((prereq) => (
                    <div key={prereq.id} className="relative group">
                      <div
                        onClick={() =>
                          navigate(`${basePath}/courses/${prereq.id}`)
                        }
                        className="block cursor-pointer"
                      >
                        <Card className="hover:bg-accent transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold text-base">
                                  {prereq.course_code}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {prereq.course_title}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {prereq.n_credits} credits
                                </Badge>
                                {isAdmin && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemovePrerequisite(prereq.id);
                                    }}
                                    disabled={isRemovingPrereq}
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No prerequisites required for this course.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dependents Tab */}
        <TabsContent value="dependents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Dependent Courses
              </CardTitle>
              <CardDescription>
                Courses that require {course.course_code} as a prerequisite
              </CardDescription>
            </CardHeader>
            <CardContent>
              {depLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : dependents.length > 0 ? (
                <div className="space-y-3">
                  {dependents.map((dependent) => (
                    <div
                      key={dependent.id}
                      onClick={() =>
                        navigate(`${basePath}/courses/${dependent.id}`)
                      }
                      className="block cursor-pointer"
                    >
                      <Card className="hover:bg-accent transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-base">
                                {dependent.course_code}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {dependent.course_title}
                              </div>
                            </div>
                            <Badge variant="outline">
                              {dependent.n_credits} credits
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No courses depend on this course as a prerequisite.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
