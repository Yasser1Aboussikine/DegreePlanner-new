import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { GripVertical, Lock } from "lucide-react";
import type { DraggableCourse } from "../types/dndTypes";
import { getCategoryBorderClass } from "@/utils/categoryColors";
import { memo } from "react";

interface CourseCardProps {
  course: DraggableCourse;
  isDraggable?: boolean;
  isInSemester?: boolean;
}

export const CourseCard = memo(function CourseCard({
  course,
  isDraggable = true,
  isInSemester = false,
}: CourseCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: course.id,
      data: {
        type: "course",
        course,
      },
      disabled: !isDraggable || !course.isEligible,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative`}>
      <Card
        {...(isDraggable && course.isEligible
          ? { ...listeners, ...attributes }
          : {})}
        className={`p-3 transition-all duration-200 ${
          isDragging
            ? "shadow-lg ring-2 ring-primary"
            : "hover:shadow-md hover:ring-1 hover:ring-primary/50"
        } ${
          !course.isEligible
            ? "bg-muted/50 opacity-50 cursor-not-allowed"
            : isDraggable && course.isEligible
            ? "cursor-grab active:cursor-grabbing"
            : ""
        }`}
      >
        <div className="flex items-start gap-2">
          {isDraggable && course.isEligible && (
            <div className="text-muted-foreground mt-1">
              <GripVertical className="h-5 w-5" />
            </div>
          )}

          {!course.isEligible && (
            <div className="text-muted-foreground mt-1">
              <Lock className="h-5 w-5" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-card-foreground truncate">
                  {course.courseCode}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {course.courseTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background text-foreground border ${getCategoryBorderClass(
                  course.category
                )}`}
              >
                {course.category.replace(/_/g, " ")}
              </span>

              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                {course.credits} SCH
              </span>
            </div>

            {course.description && !isInSemester && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {course.description}
              </p>
            )}

            {!course.isEligible && (
              <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                <Lock className="h-3 w-3" />
                <span>Prerequisites not met</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});
