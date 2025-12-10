import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner, ScreenSizeWarning } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SemesterDropZone } from "../components/SemesterDropZone";
import { EligibleCoursesPanel } from "../components/EligibleCoursesPanel";
import { CourseCard } from "../components/CourseCard";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Download,
} from "lucide-react";
import type {
  DraggableCourse,
  SemesterData,
  CoursesByCategory,
} from "../types/dndTypes";
import {
  useGetEligibleCoursesForCurrentUserQuery,
  useGetAllCourseRelationshipsQuery,
} from "@/store/api/eligibleCoursesApi";
import { useGetMyDegreePlanQuery } from "@/store/api/degreePlanApi";
import {
  useCreatePlannedCourseMutation,
  useDeletePlannedCourseMutation,
  useDeletePlannedCourseWithDependentsMutation,
} from "@/store/api/plannedCourseApi";
import { useCreatePlanSemesterMutation } from "@/store/api/planSemesterApi";
import {
  useCreateDegreePlanReviewMutation,
  useGetReviewRequestsByStudentIdQuery,
} from "@/store/api/reviewRequestApi";
import { useAppSelector } from "@/store/hooks";
import type { Category, Term } from "@/store/types";
import { toast } from "sonner";
import {
  getValidNextTerms,
  validateCourseAddition,
} from "@/utils/semesterValidation";
import { normalizeSearchQuery } from "@/utils/searchHelpers";
import { exportDegreePlanToWord } from "@/utils/exportDegreePlan";

export function DegreePlanBuilder() {
  const user = useAppSelector((state) => state.auth.user);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);
  const [coursesByCategory, setCoursesByCategory] = useState<CoursesByCategory>(
    {}
  );
  const [activeDragCourse, setActiveDragCourse] =
    useState<DraggableCourse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<{
    courseId: string;
    courseCode: string;
    dependents: string[];
  } | null>(null);
  const [courseMetadataMap, setCourseMetadataMap] = useState<
    Map<string, { prerequisites: string[]; dependents: string[] }>
  >(new Map());
  const [showAddSemesterDialog, setShowAddSemesterDialog] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: degreePlanData,
    isLoading: isLoadingPlan,
    // refetch: refetchDegreePlan,
  } = useGetMyDegreePlanQuery();
  const { data: allRelationships } = useGetAllCourseRelationshipsQuery();
  const { data: reviewRequestsData } = useGetReviewRequestsByStudentIdQuery(
    user?.id || "",
    {
      skip: !user?.id,
    }
  );

  const currentSemester = semesters[currentSemesterIndex];

  const reviewRequestsMap = new Map(
    (reviewRequestsData?.data || []).map((req) => [req.planSemesterId, req])
  );

  // Calculate overall degree plan status (latest status from all review requests)
  const getOverallStatus = (): string | null => {
    const allRequests = reviewRequestsData?.data || [];
    if (allRequests.length === 0) return null;

    // Check if any are rejected
    if (allRequests.some((req) => req.status === "REJECTED")) {
      return "REJECTED";
    }

    // Check if all are approved
    if (allRequests.every((req) => req.status === "APPROVED")) {
      return "APPROVED";
    }

    // Check if any are pending advisor (after mentor approval)
    if (allRequests.some((req) => req.status === "PENDING_ADVISOR")) {
      return "PENDING_ADVISOR";
    }

    // Otherwise, pending mentor
    if (allRequests.some((req) => req.status === "PENDING_MENTOR")) {
      return "PENDING_MENTOR";
    }

    return null;
  };

  const overallStatus = getOverallStatus();

  // Get general rejection reason from any rejected request (they all have the same one)
  const generalRejectionReason =
    reviewRequestsData?.data?.find((req) => req.rejectionReason)
      ?.rejectionReason || null;

  const normalizedSearchQuery = searchQuery
    ? normalizeSearchQuery(searchQuery)
    : "";

  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    refetch: refetchCourses,
  } = useGetEligibleCoursesForCurrentUserQuery(
    currentSemester
      ? { search: normalizedSearchQuery, upToSemesterId: currentSemester.id }
      : undefined,
    { skip: !currentSemester }
  );
  const [createPlannedCourse] = useCreatePlannedCourseMutation();
  const [deletePlannedCourse] = useDeletePlannedCourseMutation();
  const [deletePlannedCourseWithDependents] =
    useDeletePlannedCourseWithDependentsMutation();
  const [createPlanSemester] = useCreatePlanSemesterMutation();
  const [createDegreePlanReview, { isLoading: isRequestingReview }] =
    useCreateDegreePlanReviewMutation();

  const isLoading = isLoadingPlan || isLoadingCourses;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (degreePlanData && degreePlanData.semesters) {
      const mappedSemesters: SemesterData[] = degreePlanData.semesters.map(
        (sem) => {
          const courses: DraggableCourse[] = sem.plannedCourses.map((pc) => ({
            id: pc.id,
            courseCode: pc.courseCode,
            courseTitle: pc.courseTitle || "",
            credits: pc.credits || 0,
            category: (pc.category || "FREE_ELECTIVES") as Category,
            isEligible: true,
            description: "",
            prerequisites: [],
          }));

          return {
            id: sem.id,
            semesterName: `${sem.term} ${sem.year}`,
            year: sem.year,
            term: sem.term,
            courses,
            totalCredits: courses.reduce((sum, c) => sum + c.credits, 0),
          };
        }
      );

      setSemesters(mappedSemesters);
      // Set to first semester if not already set and semesters exist
      if (
        mappedSemesters.length > 0 &&
        currentSemesterIndex >= mappedSemesters.length
      ) {
        setCurrentSemesterIndex(0);
      }
    }
  }, [degreePlanData]);

  useEffect(() => {
    const metadataMap = new Map<
      string,
      { prerequisites: string[]; dependents: string[] }
    >();

    if (allRelationships) {
      Object.entries(allRelationships).forEach(([courseCode, relations]) => {
        metadataMap.set(courseCode, relations);
      });
    }

    if (coursesData) {
      coursesData.forEach((course) => {
        if (!metadataMap.has(course.course_code)) {
          metadataMap.set(course.course_code, {
            prerequisites: course.prerequisiteCodes || [],
            dependents: course.dependentCodes || [],
          });
        }
      });
    }

    setCourseMetadataMap(metadataMap);
  }, [allRelationships, coursesData]);

  // Memoize mapToCategory function
  const mapToCategory = useCallback((categories: string[]): Category => {
    if (!categories || categories.length === 0) {
      return "FREE_ELECTIVES";
    }

    // Check if "Specialization" is explicitly in the categories array
    const hasSpecialization = categories.some((cat) =>
      cat.toLowerCase().includes("specialization")
    );

    if (hasSpecialization) {
      return "SPECIALIZATION";
    }

    for (const category of categories) {
      const normalized = category.toUpperCase().replace(/[\s_-]/g, "_");

      if (normalized.includes("GENERAL") || normalized.includes("GENED")) {
        return "GENERAL_EDUCATION";
      }
      if (normalized.includes("COMPUTER") || normalized === "CS") {
        return "COMPUTER_SCIENCE";
      }
      if (normalized.includes("MINOR")) {
        return "MINOR";
      }
      if (
        normalized.includes("ENGINEERING") ||
        normalized.includes("MATHS") ||
        normalized === "ESM"
      ) {
        return "ENGINEERING_SCIENCE_MATHS";
      }
      if (normalized.includes("FREE") || normalized.includes("ELECTIVE")) {
        return "FREE_ELECTIVES";
      }
    }

    return "FREE_ELECTIVES";
  }, []);

  // Memoize coursesByCategory computation
  useEffect(() => {
    if (coursesData) {
      const mappedCourses: DraggableCourse[] = coursesData.map((course) => ({
        id: course.id,
        courseCode: course.course_code,
        courseTitle: course.course_title,
        credits: course.sch_credits,
        category: mapToCategory(course.categories),
        description: course.description,
        prerequisites: course.prerequisiteCodes || [],
        dependents: course.dependentCodes || [],
        isEligible: course.isEligible,
      }));

      const grouped = mappedCourses.reduce(
        (acc: CoursesByCategory, course: DraggableCourse) => {
          const category = course.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(course);
          return acc;
        },
        {} as CoursesByCategory
      );

      setCoursesByCategory(grouped);
    }
  }, [coursesData, mapToCategory]);

  useEffect(() => {
    // Only refetch if we have a current semester (query is not skipped)
    if (currentSemester) {
      refetchCourses();
    }
  }, [currentSemesterIndex, currentSemester, refetchCourses]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const course = active.data.current?.course as DraggableCourse;
    if (course) {
      setActiveDragCourse(course);
    }
  }, []);

  const saveCourseToDatabase = useCallback(
    async (semesterId: string, course: DraggableCourse) => {
      setIsSaving(true);
      try {
        await createPlannedCourse({
          planSemesterId: semesterId,
          courseCode: course.courseCode,
          courseTitle: course.courseTitle,
          credits: course.credits,
          category: course.category,
        }).unwrap();
        toast.success(`${course.courseCode} added to semester`);
        // Explicitly refetch eligible courses to update the list
        refetchCourses();
      } catch (error) {
        toast.error("Failed to save course");
        console.error("Error saving course:", error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [createPlannedCourse, refetchCourses]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragCourse(null);

      // Only process if dropped over a valid semester drop zone
      if (!over || over.data.current?.type !== "semester") {
        return;
      }

      const draggedCourse = active.data.current?.course as DraggableCourse;
      const targetSemesterId = over.id as string;

      if (!draggedCourse || !draggedCourse.isEligible) {
        if (!draggedCourse?.isEligible) {
          toast.error("This course is not eligible");
        }
        return;
      }

      const targetSemester = semesters.find(
        (sem) => sem.id === targetSemesterId
      );
      if (!targetSemester) {
        toast.error("Invalid semester");
        return;
      }

      const alreadyExists = targetSemester.courses.some(
        (c) => c.courseCode === draggedCourse.courseCode
      );
      if (alreadyExists) {
        toast.error("Course already exists in this semester");
        return;
      }

      const validation = validateCourseAddition(
        targetSemester.term,
        targetSemester.courses,
        draggedCourse.credits
      );

      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }

      const isFromSemester = semesters.some((sem) =>
        sem.courses.some((c) => c.courseCode === draggedCourse.courseCode)
      );

      const previousState = [...semesters];

      setSemesters((prev) =>
        prev.map((sem) => {
          if (
            isFromSemester &&
            sem.courses.some((c) => c.courseCode === draggedCourse.courseCode)
          ) {
            return {
              ...sem,
              courses: sem.courses.filter(
                (c) => c.courseCode !== draggedCourse.courseCode
              ),
              totalCredits: sem.courses
                .filter((c) => c.courseCode !== draggedCourse.courseCode)
                .reduce((sum, c) => sum + c.credits, 0),
            };
          }

          if (sem.id === targetSemesterId) {
            return {
              ...sem,
              courses: [...sem.courses, draggedCourse],
              totalCredits: sem.totalCredits + draggedCourse.credits,
            };
          }

          return sem;
        })
      );

      try {
        await saveCourseToDatabase(targetSemesterId, draggedCourse);
      } catch (error) {
        setSemesters(previousState);
      }
    },
    [semesters, saveCourseToDatabase]
  );

  const findDependentCourses = useCallback(
    (courseCode: string, currentSemesterIndex: number): string[] => {
      const allDependents = new Set<string>();
      const visited = new Set<string>();

      const findDependentsRecursive = (code: string) => {
        if (visited.has(code)) return;
        visited.add(code);

        const metadata = courseMetadataMap.get(code);
        if (
          !metadata ||
          !metadata.dependents ||
          metadata.dependents.length === 0
        )
          return;

        // Check all semesters after the current one for dependent courses
        for (let i = currentSemesterIndex + 1; i < semesters.length; i++) {
          const semester = semesters[i];
          for (const course of semester.courses) {
            if (
              metadata.dependents.includes(course.courseCode) &&
              !allDependents.has(course.courseCode)
            ) {
              allDependents.add(course.courseCode);
              // Recursively find dependents of this dependent course
              findDependentsRecursive(course.courseCode);
            }
          }
        }
      };

      findDependentsRecursive(courseCode);
      return Array.from(allDependents);
    },
    [courseMetadataMap, semesters]
  );

  const performCourseRemoval = useCallback(
    async (courseId: string, removeDependents = false) => {
      const previousState = [...semesters];

      let coursesToRemove = [courseId];

      if (removeDependents && courseToDelete) {
        const dependentCourseIds = semesters
          .flatMap((sem) => sem.courses)
          .filter((c) => courseToDelete.dependents.includes(c.courseCode))
          .map((c) => c.id);
        coursesToRemove = [courseId, ...dependentCourseIds];
      }

      // Optimistically update UI
      setSemesters((prev) =>
        prev.map((sem) => ({
          ...sem,
          courses: sem.courses.filter((c) => !coursesToRemove.includes(c.id)),
          totalCredits: sem.courses
            .filter((c) => !coursesToRemove.includes(c.id))
            .reduce((sum, c) => sum + c.credits, 0),
        }))
      );

      try {
        if (removeDependents) {
          // Use the bulk delete endpoint for better performance
          const result = await deletePlannedCourseWithDependents(
            courseId
          ).unwrap();
          toast.success(
            result.deletedCount > 1
              ? `Removed ${
                  result.deletedCount
                } courses: ${result.deletedCourses.join(", ")}`
              : "Course removed"
          );
        } else {
          // Single course deletion
          await deletePlannedCourse(courseId).unwrap();
          toast.success("Course removed");
        }
      } catch (error) {
        // Revert on error
        setSemesters(previousState);
        toast.error("Failed to remove course");
        console.error("Error removing course:", error);
      }

      setCourseToDelete(null);
    },
    [
      semesters,
      courseToDelete,
      deletePlannedCourseWithDependents,
      deletePlannedCourse,
    ]
  );

  const handleRemoveCourse = useCallback(
    async (courseId: string) => {
      let courseToRemove: DraggableCourse | undefined;
      let semesterIndex = -1;

      for (let i = 0; i < semesters.length; i++) {
        const course = semesters[i].courses.find((c) => c.id === courseId);
        if (course) {
          courseToRemove = course;
          semesterIndex = i;
          break;
        }
      }

      if (!courseToRemove || semesterIndex === -1) return;

      const dependents = findDependentCourses(
        courseToRemove.courseCode,
        semesterIndex
      );

      if (dependents.length > 0) {
        setCourseToDelete({
          courseId,
          courseCode: courseToRemove.courseCode,
          dependents,
        });
        return;
      }

      await performCourseRemoval(courseId);
    },
    [semesters, findDependentCourses, performCourseRemoval]
  );

  const handleAddSemester = () => {
    if (!degreePlanData) {
      toast.error("Degree plan not found");
      return;
    }

    const lastSemester =
      semesters.length > 0 ? semesters[semesters.length - 1] : null;

    if (lastSemester && lastSemester.courses.length === 0) {
      toast.error(
        "Cannot create a new semester. The previous semester is empty."
      );
      return;
    }

    const availableTerms = lastSemester
      ? getValidNextTerms(lastSemester.term)
      : (["FALL", "SPRING", "SUMMER", "WINTER"] as Term[]);

    const nextYear = lastSemester
      ? lastSemester.term === "FALL" &&
        availableTerms.includes("SPRING" as Term)
        ? lastSemester.year + 1
        : lastSemester.year
      : new Date().getFullYear();

    setSelectedTerm(availableTerms[0]);
    setSelectedYear(nextYear);
    setShowAddSemesterDialog(true);
  };

  const confirmAddSemester = async () => {
    if (!degreePlanData || !selectedTerm) {
      toast.error("Please select a term");
      return;
    }

    const nthSemestre = semesters.length + 1;

    console.log("Creating semester with:", {
      term: selectedTerm,
      year: selectedYear,
      nth_semestre: nthSemestre,
    });

    try {
      const result = await createPlanSemester({
        degreePlanId: degreePlanData.id,
        year: selectedYear,
        term: selectedTerm,
        nth_semestre: nthSemestre,
      }).unwrap();

      console.log("Received semester from API:", {
        term: result.term,
        year: result.year,
        id: result.id,
      });

      setShowAddSemesterDialog(false);
      toast.success(`New semester added: ${result.term} ${result.year}`);

      // Wait for the cache to update automatically via invalidation
      setTimeout(() => {
        setCurrentSemesterIndex(semesters.length); // Will be the new last index
      }, 200);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to add semester";
      toast.error(errorMessage);
      console.error("Error adding semester:", error);
    }
  };

  const handlePreviousSemester = () => {
    if (currentSemesterIndex > 0) {
      setCurrentSemesterIndex(currentSemesterIndex - 1);
    }
  };

  const handleNextSemester = () => {
    if (currentSemesterIndex < semesters.length - 1) {
      setCurrentSemesterIndex(currentSemesterIndex + 1);
    }
  };

  const handleRequestReview = async () => {
    if (!degreePlanData?.id) {
      toast.error("No degree plan found");
      return;
    }

    if (semesters.length === 0) {
      toast.error("Cannot request review for an empty degree plan");
      return;
    }

    // Check if any semester has no courses
    const emptySemesters = semesters.filter((sem) => sem.courses.length === 0);
    if (emptySemesters.length > 0) {
      toast.error(
        `Cannot request review. ${emptySemesters.length} semester(s) have no courses. Please add courses or remove empty semesters.`
      );
      return;
    }

    try {
      await createDegreePlanReview({
        degreePlanId: degreePlanData.id,
      }).unwrap();
      toast.success("Review request submitted successfully");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to request review";
      toast.error(errorMessage);
      console.error("Error requesting review:", error);
    }
  };

  const handleExportPlan = async () => {
    if (!degreePlanData || !user) {
      toast.error("Unable to export degree plan");
      return;
    }

    if (
      semesters.length === 0 ||
      (semesters.length === 1 && semesters[0].courses.length === 0)
    ) {
      toast.error("Cannot export an empty degree plan");
      return;
    }

    setIsExporting(true);
    try {
      await exportDegreePlanToWord(degreePlanData, user);
      toast.success("Degree plan exported successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to export degree plan");
      console.error("Error exporting degree plan:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const totalCreditsPlanned = semesters.reduce(
    (sum, sem) => sum + sem.totalCredits,
    0
  );
  const totalCoursesPlanned = semesters.reduce(
    (sum, sem) => sum + sem.courses.length,
    0
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isSmallScreen) {
    return <ScreenSizeWarning />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-none bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Degree Plan Builder
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCoursesPlanned} courses · {totalCreditsPlanned} credits
              planned
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportPlan}
              variant="outline"
              disabled={
                isExporting ||
                semesters.length === 0 ||
                (semesters.length === 1 && semesters[0].courses.length === 0)
              }
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export Plan
            </Button>
            <Button
              onClick={handleRequestReview}
              variant="default"
              disabled={isRequestingReview || semesters.length === 0}
              className="flex items-center gap-2"
            >
              {isRequestingReview ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Request Review
            </Button>
            <Button
              onClick={handleAddSemester}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Semester
            </Button>
          </div>
        </div>

        {semesters.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePreviousSemester}
              disabled={currentSemesterIndex === 0}
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Select
              value={currentSemesterIndex.toString()}
              onValueChange={(value) =>
                setCurrentSemesterIndex(parseInt(value))
              }
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester, index) => (
                  <SelectItem key={semester.id} value={index.toString()}>
                    {semester.semesterName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleNextSemester}
              disabled={currentSemesterIndex === semesters.length - 1}
              variant="outline"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isSaving && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Saving...</span>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="h-full flex">
            <div className="flex-1 overflow-hidden p-6">
              {semesters.length === 0 ? (
                <Card className="h-full flex flex-col items-center justify-center p-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">
                    No Semesters Yet
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Get started by adding your first semester to plan your
                    courses
                  </p>
                  <Button onClick={handleAddSemester} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Semester
                  </Button>
                </Card>
              ) : currentSemester ? (
                <div className="h-full">
                  <SemesterDropZone
                    semester={currentSemester}
                    onRemoveCourse={handleRemoveCourse}
                    mentorComment={
                      currentSemester
                        ? reviewRequestsMap.get(currentSemester.id)
                            ?.mentorComment
                        : undefined
                    }
                    advisorComment={
                      currentSemester
                        ? reviewRequestsMap.get(currentSemester.id)
                            ?.advisorComment
                        : undefined
                    }
                    reviewStatus={overallStatus}
                    rejectionReason={generalRejectionReason}
                  />
                </div>
              ) : (
                <Card className="h-full flex flex-col items-center justify-center p-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No semester selected. Use the navigation to select a
                    semester.
                  </p>
                </Card>
              )}
            </div>

            <div className="w-[500px] border-l border-border p-6 overflow-hidden">
              <EligibleCoursesPanel
                coursesByCategory={coursesByCategory}
                onSearchChange={setSearchQuery}
                isLoading={isLoadingCourses}
              />
            </div>
          </div>

          <DragOverlay>
            {activeDragCourse ? (
              <div className="opacity-80">
                <CourseCard course={activeDragCourse} isDraggable={false} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AlertDialog
        open={!!courseToDelete}
        onOpenChange={(open) => !open && setCourseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Course with Dependencies</AlertDialogTitle>
            <AlertDialogDescription>
              The course <strong>{courseToDelete?.courseCode}</strong> has the
              following dependent courses (direct and indirect):{" "}
              <strong>{courseToDelete?.dependents.join(", ")}</strong>.
              <br />
              <br />
              Removing this course will also remove all{" "}
              {courseToDelete?.dependents.length} dependent course(s) from your
              degree plan. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                courseToDelete &&
                performCourseRemoval(courseToDelete.courseId, true)
              }
            >
              Remove All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={showAddSemesterDialog}
        onOpenChange={setShowAddSemesterDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Semester</DialogTitle>
            <DialogDescription>
              {semesters.length > 0 ? (
                <>
                  Select a term for the new semester. Based on your previous
                  semester ({semesters[semesters.length - 1].semesterName}), you
                  can choose from the available options.
                </>
              ) : (
                <>Choose the term for your first semester.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="term">Term</Label>
              <Select
                value={selectedTerm || ""}
                onValueChange={(value) => setSelectedTerm(value as Term)}
              >
                <SelectTrigger id="term">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.length > 0 ? (
                    getValidNextTerms(semesters[semesters.length - 1].term).map(
                      (term) => (
                        <SelectItem key={term} value={term}>
                          {term}
                        </SelectItem>
                      )
                    )
                  ) : (
                    <>
                      <SelectItem value="FALL">FALL</SelectItem>
                      <SelectItem value="SPRING">SPRING</SelectItem>
                      <SelectItem value="SUMMER">SUMMER</SelectItem>
                      <SelectItem value="WINTER">WINTER</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i - 2;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddSemesterDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmAddSemester}>Add Semester</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
