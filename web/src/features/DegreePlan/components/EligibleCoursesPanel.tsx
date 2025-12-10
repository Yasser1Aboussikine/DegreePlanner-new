import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui";
import { CourseCard } from "./CourseCard";
import { Search, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import type { CoursesByCategory } from "../types/dndTypes";

interface EligibleCoursesPanelProps {
  coursesByCategory: CoursesByCategory;
  onSearchChange?: (search: string) => void;
  isLoading?: boolean;
}

export function EligibleCoursesPanel({
  coursesByCategory,
  onSearchChange,
  isLoading = false,
}: EligibleCoursesPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearchChange]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getCategoryDisplayName = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const totalCourses = Object.values(coursesByCategory).reduce(
    (sum, courses) => sum + courses.length,
    0
  );

  const eligibleCount = Object.values(coursesByCategory).reduce(
    (sum, courses) => sum + courses.filter((c) => c.isEligible).length,
    0
  );

  return (
    <Card className="h-full flex flex-col bg-card p-4">
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-card-foreground">
              Eligible Courses
            </h2>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">{eligibleCount}</span>
            {" / "}
            {totalCourses} Available
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {isLoading ? (
          <LoadingSpinner />
        ) : Object.keys(coursesByCategory).length === 0 ? (
          <Card className="p-8 text-center bg-card">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchQuery
                ? "No courses found matching your search"
                : "No eligible courses available"}
            </p>
          </Card>
        ) : (
          Object.entries(coursesByCategory).map(([category, courses]) => (
            <Card key={category} className="bg-card">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-2 flex items-center justify-between rounded-t-lg"
              >
                <div className="flex items-center gap-2">
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <h3 className="font-semibold text-card-foreground">
                    {getCategoryDisplayName(category)}
                  </h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {courses.length} course{courses.length !== 1 ? "s" : ""}
                </span>
              </button>

              {expandedCategories.has(category) && (
                <div className="p-2 pt-0 space-y-2">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isDraggable={course.isEligible}
                      isInSemester={false}
                    />
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </Card>
  );
}
