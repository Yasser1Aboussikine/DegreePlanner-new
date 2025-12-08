import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck } from "lucide-react";
import { useGetMentorAssignmentsByMentorIdQuery } from "@/store/api";

interface MyStudentsCardProps {
  mentorId: string;
}

export const MyStudentsCard = ({ mentorId }: MyStudentsCardProps) => {
  const { data, isLoading } = useGetMentorAssignmentsByMentorIdQuery(mentorId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const assignments = data?.data || [];
  const studentCount = assignments.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          My Students
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-3xl font-bold">{studentCount}</p>
            <p className="text-sm text-muted-foreground">
              {studentCount === 1 ? "Student" : "Students"} Assigned
            </p>
          </div>
          <UserCheck className="h-12 w-12 text-muted-foreground opacity-20" />
        </div>

        {studentCount > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Recent Students</p>
            <div className="space-y-2">
              {assignments.slice(0, 3).map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{assignment.student?.name || "Unknown"}</span>
                  <span className="text-muted-foreground text-xs">
                    {assignment.student?.classification}
                  </span>
                </div>
              ))}
              {studentCount > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{studentCount - 3} more
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
