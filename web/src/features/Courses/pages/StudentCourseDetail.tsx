import { useParams } from "react-router-dom";
import CourseDetailView from "@/shared/CourseDetailView";

const StudentCourseDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Invalid course ID</p>
      </div>
    );
  }

  return (
    <CourseDetailView
      courseId={id}
      canEdit={false}
      basePath="/student/courses"
    />
  );
};

export default StudentCourseDetail;
