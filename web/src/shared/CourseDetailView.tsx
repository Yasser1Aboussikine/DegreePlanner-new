import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  useGetCourseByIdQuery,
  useGetCoursePrerequisitesQuery,
  useGetCourseDependentsQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAddPrerequisiteMutation,
  useRemovePrerequisiteMutation,
  useGetAllCoursesQuery,
} from "@/store/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  BookOpen,
  GraduationCap,
  Network,
} from "lucide-react";
import { toast } from "sonner";
import type { Course } from "@/store/types";

interface CourseDetailViewProps {
  courseId: string;
  canEdit?: boolean;
  onNavigateBack?: () => void;
  basePath?: string;
}

const CourseDetailView = ({
  courseId,
  canEdit = false,
  onNavigateBack,
  basePath,
}: CourseDetailViewProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAddingPrerequisite, setIsAddingPrerequisite] = useState(false);
  const [isAddingDependent, setIsAddingDependent] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{
    value: string;
    label: string;
    subtitle: string;
  } | null>(null);
  const [selectedDependentCourse, setSelectedDependentCourse] = useState<{
    value: string;
    label: string;
    subtitle: string;
  } | null>(null);

  const {
    data: courseData,
    isLoading,
    error,
  } = useGetCourseByIdQuery(courseId);

  const { data: prerequisitesData, isLoading: prerequisitesLoading } =
    useGetCoursePrerequisitesQuery(courseId);

  const { data: dependentsData, isLoading: dependentsLoading } =
    useGetCourseDependentsQuery(courseId);

  const { data: allCoursesData, isLoading: allCoursesLoading } =
    useGetAllCoursesQuery({ page: 1, limit: 1000 });

  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [addPrerequisite, { isLoading: isAddingPrereq }] =
    useAddPrerequisiteMutation();
  const [removePrerequisite, { isLoading: isRemovingPrereq }] =
    useRemovePrerequisiteMutation();

  const course = courseData?.data;
  const prerequisites = prerequisitesData || [];
  const dependents = dependentsData || [];

  const courseOptions = useMemo(() => {
    if (!allCoursesData?.data) return [];

    const prerequisiteIds = new Set(prerequisites.map((p: Course) => p.id));
    prerequisiteIds.add(courseId);

    return allCoursesData.data
      .filter((c: Course) => !prerequisiteIds.has(c.id))
      .map((c: Course) => ({
        value: c.id,
        label: c.course_code,
        subtitle: c.course_title,
      }));
  }, [allCoursesData, prerequisites, courseId]);

  const dependentCourseOptions = useMemo(() => {
    if (!allCoursesData?.data) return [];

    const dependentIds = new Set(dependents.map((d: Course) => d.id));
    dependentIds.add(courseId);

    return allCoursesData.data
      .filter((c: Course) => !dependentIds.has(c.id))
      .map((c: Course) => ({
        value: c.id,
        label: c.course_code,
        subtitle: c.course_title,
      }));
  }, [allCoursesData, dependents, courseId]);

  const [formData, setFormData] = useState({
    course_code: "",
    course_title: "",
    description: "",
    sch_credits: 0,
    n_credits: 0,
  });

  useEffect(() => {
    if (course) {
      setFormData({
        course_code: course.course_code || "",
        course_title: course.course_title || "",
        description: course.description || "",
        sch_credits: course.sch_credits || 0,
        n_credits: course.n_credits || 0,
      });
    }
  }, [course]);

  const handleEdit = () => {
    if (course) {
      setFormData({
        course_code: course.course_code || "",
        course_title: course.course_title || "",
        description: course.description || "",
        sch_credits: course.sch_credits || 0,
        n_credits: course.n_credits || 0,
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (course) {
      setFormData({
        course_code: course.course_code || "",
        course_title: course.course_title || "",
        description: course.description || "",
        sch_credits: course.sch_credits || 0,
        n_credits: course.n_credits || 0,
      });
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading("Updating course...");

    try {
      await updateCourse({
        id: courseId,
        data: formData,
      }).unwrap();

      toast.success("Course updated successfully!", { id: toastId });
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update course";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting course...");

    try {
      await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully!", { id: toastId });

      if (basePath) {
        navigate(basePath);
      } else if (onNavigateBack) {
        onNavigateBack();
      } else {
        navigate(-1);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete course";
      toast.error(errorMessage, { id: toastId });
    }
    setShowDeleteDialog(false);
  };

  const handleNavigateToCourse = (id: string) => {
    if (basePath) {
      navigate(`${basePath}/${id}`);
    }
  };

  const handleAddPrerequisite = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    const toastId = toast.loading("Adding prerequisite...");

    try {
      await addPrerequisite({
        id: courseId,
        prerequisiteId: selectedCourse.value,
      }).unwrap();

      toast.success("Prerequisite added successfully!", { id: toastId });
      setSelectedCourse(null);
      setIsAddingPrerequisite(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to add prerequisite";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleRemovePrerequisite = async (prerequisiteId: string) => {
    const toastId = toast.loading("Removing prerequisite...");

    try {
      await removePrerequisite({
        id: courseId,
        prerequisiteId,
      }).unwrap();

      toast.success("Prerequisite removed successfully!", { id: toastId });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to remove prerequisite";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleAddDependent = async () => {
    if (!selectedDependentCourse) {
      toast.error("Please select a course");
      return;
    }

    const toastId = toast.loading("Adding dependent course...");

    try {
      await addPrerequisite({
        id: selectedDependentCourse.value,
        prerequisiteId: courseId,
      }).unwrap();

      toast.success("Dependent course added successfully!", { id: toastId });
      setSelectedDependentCourse(null);
      setIsAddingDependent(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to add dependent course";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleRemoveDependent = async (dependentId: string) => {
    const toastId = toast.loading("Removing dependent course...");

    try {
      await removePrerequisite({
        id: dependentId,
        prerequisiteId: courseId,
      }).unwrap();

      toast.success("Dependent course removed successfully!", { id: toastId });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to remove dependent course";
      toast.error(errorMessage, { id: toastId });
    }
  };

  if (isLoading) {
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

  if (error || !course) {
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
            <Button
              onClick={() => (onNavigateBack ? onNavigateBack() : navigate(-1))}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => (onNavigateBack ? onNavigateBack() : navigate(-1))}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Button>

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

            {canEdit && !isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}

            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isUpdating} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isUpdating}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            {course.disciplines && course.disciplines.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">
                  {typeof course.disciplines[0] === "string"
                    ? course.disciplines[0]
                    : (course.disciplines[0] as any).name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>
                {course.n_credits} Credits ({course.sch_credits} SCH)
              </span>
            </div>
          </div>

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

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-input border-border min-h-[120px]"
                />
              ) : (
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {course.description || "No description available."}
                </p>
              )}
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
                  {isEditing ? (
                    <Input
                      value={formData.course_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          course_code: e.target.value,
                        })
                      }
                      className="bg-input border-border"
                    />
                  ) : (
                    <div className="text-base font-semibold">
                      {course.course_code}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Course Title
                  </div>
                  {isEditing ? (
                    <Input
                      value={formData.course_title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          course_title: e.target.value,
                        })
                      }
                      className="bg-input border-border"
                    />
                  ) : (
                    <div className="text-base font-semibold">
                      {course.course_title}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Credits
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.n_credits}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          n_credits: Number(e.target.value),
                        })
                      }
                      className="bg-input border-border"
                    />
                  ) : (
                    <div className="text-base font-semibold">
                      {course.n_credits} credits
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    SCH Credits
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.sch_credits}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sch_credits: Number(e.target.value),
                        })
                      }
                      className="bg-input border-border"
                    />
                  ) : (
                    <div className="text-base font-semibold">
                      {course.sch_credits}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Categories
                </div>
                <div className="flex gap-2 flex-wrap">
                  {course.labels &&
                    course.labels.map((label: string) => (
                      <Badge key={label} variant="secondary">
                        {label}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                {canEdit && !isAddingPrerequisite && (
                  <Button
                    onClick={() => setIsAddingPrerequisite(true)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isAddingPrerequisite && (
                <div className="mb-4 space-y-3 p-4 border border-border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Search and select a course to add as prerequisite
                    </label>
                    <Select
                      value={selectedCourse}
                      onChange={(option) => setSelectedCourse(option)}
                      options={courseOptions}
                      isLoading={allCoursesLoading}
                      isDisabled={isAddingPrereq}
                      placeholder="Type to search courses (e.g., CSC 2302)..."
                      isClearable
                      isSearchable
                      formatOptionLabel={(option) => (
                        <div className="py-1">
                          <div className="font-bold text-base">
                            {option.label}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            {option.subtitle}
                          </div>
                        </div>
                      )}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "white",
                          borderColor: state.isFocused ? "#16a34a" : "#16a34a",
                          borderWidth: "2px",
                          borderRadius: "0.5rem",
                          minHeight: "44px",
                          boxShadow: state.isFocused
                            ? "0 0 0 2px rgba(22, 163, 74, 0.2)"
                            : "none",
                          "&:hover": {
                            borderColor: "#16a34a",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "white",
                          border: "1px solid #16a34a",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          overflow: "hidden",
                        }),
                        menuList: (base) => ({
                          ...base,
                          padding: "0.25rem",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#bbf7d0"
                            : "white",
                          color: state.isFocused
                            ? "#166534"
                            : "hsl(var(--foreground))",
                          cursor: "pointer",
                          padding: "12px 16px",
                          borderRadius: "0.375rem",
                          transition: "all 0.15s ease",
                          fontWeight: "600",
                          "&:active": {
                            backgroundColor: "#86efac",
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

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddPrerequisite}
                      disabled={isAddingPrereq || !selectedCourse}
                      size="sm"
                      className="flex-1"
                    >
                      {isAddingPrereq ? "Adding..." : "Add Prerequisite"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingPrerequisite(false);
                        setSelectedCourse(null);
                      }}
                      variant="outline"
                      disabled={isAddingPrereq}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {prerequisitesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : prerequisites.length > 0 ? (
                <div className="space-y-3">
                  {prerequisites.map((prereq: Course) => (
                    <div key={prereq.id} className="block cursor-pointer">
                      <Card className="hover:bg-accent transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div
                              className="flex-1"
                              onClick={() => handleNavigateToCourse(prereq.id)}
                            >
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
                              {canEdit && (
                                <Button
                                  onClick={() =>
                                    handleRemovePrerequisite(prereq.id)
                                  }
                                  variant="ghost"
                                  size="sm"
                                  disabled={isRemovingPrereq}
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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

        <TabsContent value="dependents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Dependent Courses
                  </CardTitle>
                  <CardDescription>
                    Courses that require {course.course_code} as a prerequisite
                  </CardDescription>
                </div>
                {canEdit && !isAddingDependent && (
                  <Button
                    onClick={() => setIsAddingDependent(true)}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isAddingDependent && (
                <div className="mb-4 space-y-3 p-4 border border-border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Search and select a course to add as dependent
                    </label>
                    <Select
                      value={selectedDependentCourse}
                      onChange={(option) => setSelectedDependentCourse(option)}
                      options={dependentCourseOptions}
                      isLoading={allCoursesLoading}
                      isDisabled={isAddingPrereq}
                      placeholder="Type to search courses (e.g., CSC 3302)..."
                      isClearable
                      isSearchable
                      formatOptionLabel={(option) => (
                        <div className="py-1">
                          <div className="font-bold text-base">
                            {option.label}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            {option.subtitle}
                          </div>
                        </div>
                      )}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "white",
                          borderColor: state.isFocused ? "#16a34a" : "#16a34a",
                          borderWidth: "2px",
                          borderRadius: "0.5rem",
                          minHeight: "44px",
                          boxShadow: state.isFocused
                            ? "0 0 0 2px rgba(22, 163, 74, 0.2)"
                            : "none",
                          "&:hover": {
                            borderColor: "#16a34a",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "white",
                          border: "1px solid #16a34a",
                          borderRadius: "0.5rem",
                          boxShadow:
                            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          overflow: "hidden",
                        }),
                        menuList: (base) => ({
                          ...base,
                          padding: "0.25rem",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#bbf7d0"
                            : "white",
                          color: state.isFocused
                            ? "#166534"
                            : "hsl(var(--foreground))",
                          cursor: "pointer",
                          padding: "12px 16px",
                          borderRadius: "0.375rem",
                          transition: "all 0.15s ease",
                          fontWeight: "600",
                          "&:active": {
                            backgroundColor: "#86efac",
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

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddDependent}
                      disabled={isAddingPrereq || !selectedDependentCourse}
                      size="sm"
                      className="flex-1"
                    >
                      {isAddingPrereq ? "Adding..." : "Add Dependent"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingDependent(false);
                        setSelectedDependentCourse(null);
                      }}
                      variant="outline"
                      disabled={isAddingPrereq}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {dependentsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : dependents.length > 0 ? (
                <div className="space-y-3">
                  {dependents.map((dependent: Course) => (
                    <div key={dependent.id} className="block cursor-pointer">
                      <Card className="hover:bg-accent transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div
                              className="flex-1"
                              onClick={() => handleNavigateToCourse(dependent.id)}
                            >
                              <div className="font-semibold text-base">
                                {dependent.course_code}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {dependent.course_title}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {dependent.n_credits} credits
                              </Badge>
                              {canEdit && (
                                <Button
                                  onClick={() =>
                                    handleRemoveDependent(dependent.id)
                                  }
                                  variant="ghost"
                                  size="sm"
                                  disabled={isRemovingPrereq}
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Course
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{course.course_code} -{" "}
              {course.course_title}"? This action cannot be undone and may
              affect courses that depend on this one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-border bg-background hover:bg-accent"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseDetailView;
