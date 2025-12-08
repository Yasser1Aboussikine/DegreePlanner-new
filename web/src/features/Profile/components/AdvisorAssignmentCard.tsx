import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Mail, Calendar } from "lucide-react";
import { useGetAdvisorAssignmentsByStudentIdQuery } from "@/store/api";

interface AdvisorAssignmentCardProps {
  studentId: string;
}

export const AdvisorAssignmentCard = ({
  studentId,
}: AdvisorAssignmentCardProps) => {
  const { data, isLoading } =
    useGetAdvisorAssignmentsByStudentIdQuery(studentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Advisor Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const assignment = data?.data?.[0];

  if (!assignment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Advisor Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No advisor assigned yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Advisor Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-medium">
              {assignment.advisor?.name || "Unknown"}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {assignment.advisor?.email}
            </div>
          </div>
          <Badge variant="secondary">{assignment.advisor?.role}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Assigned on{" "}
            {assignment.createdAt
              ? new Date(assignment.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
