import { useParams, useNavigate } from "react-router-dom";
import {
  useGetStudentsByMentorIdQuery,
  useGetMentorAssignmentsByMentorIdQuery,
  useCreateMentorAssignmentMutation,
  useDeleteMentorAssignmentMutation,
  useGetStudentsByAdvisorIdQuery,
  useGetAdvisorAssignmentsByAdvisorIdQuery,
  useCreateAdvisorAssignmentMutation,
  useDeleteAdvisorAssignmentMutation,
} from "@/store/api";
import { StudentCard, AssignStudentDialog } from "../components";
import { AlertCircle, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui";

export const AssignedStudentsPage = () => {
  const { type, id } = useParams<{
    type: "mentors" | "advisors";
    id: string;
  }>();
  const navigate = useNavigate();

  const isMentor = type === "mentors";

  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = isMentor
    ? useGetStudentsByMentorIdQuery(id || "", { skip: !id })
    : useGetStudentsByAdvisorIdQuery(id || "", { skip: !id });

  const { data: assignmentsData } = isMentor
    ? useGetMentorAssignmentsByMentorIdQuery(id || "", { skip: !id })
    : useGetAdvisorAssignmentsByAdvisorIdQuery(id || "", { skip: !id });

  const [createMentorAssignment, { isLoading: isCreatingMentor }] =
    useCreateMentorAssignmentMutation();
  const [deleteMentorAssignment, { isLoading: isDeletingMentor }] =
    useDeleteMentorAssignmentMutation();
  const [createAdvisorAssignment, { isLoading: isCreatingAdvisor }] =
    useCreateAdvisorAssignmentMutation();
  const [deleteAdvisorAssignment, { isLoading: isDeletingAdvisor }] =
    useDeleteAdvisorAssignmentMutation();

  const students = studentsData?.data || [];
  const assignments = assignmentsData?.data || [];

  const handleAssignStudent = async (studentId: string) => {
    const toastId = toast.loading(`Assigning student...`);

    try {
      if (isMentor) {
        await createMentorAssignment({ mentorId: id!, studentId }).unwrap();
      } else {
        await createAdvisorAssignment({ advisorId: id!, studentId }).unwrap();
      }

      toast.success(
        `Student assigned successfully! Note: Each student can only have one ${
          isMentor ? "mentor" : "advisor"
        }. If this student was previously assigned, the old assignment was replaced.`,
        { id: toastId, duration: 5000 }
      );
    } catch (error: any) {
      console.error("Error assigning student:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to assign student";
      toast.error(errorMessage, { id: toastId, duration: 5000 });
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      if (isMentor) {
        await deleteMentorAssignment(assignmentId).unwrap();
      } else {
        await deleteAdvisorAssignment(assignmentId).unwrap();
      }
    } catch (error) {
      console.error("Error removing assignment:", error);
    }
  };

  const getAssignmentId = (studentId: string) => {
    const assignment = assignments.find((a) => {
      if (isMentor && "mentorId" in a) {
        return a.mentorId === id && a.studentId === studentId;
      } else if (!isMentor && "advisorId" in a) {
        return a.advisorId === id && a.studentId === studentId;
      }
      return false;
    });
    return assignment?.id || "";
  };

  if (studentsError) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Error Loading Students
          </h2>
          <p className="text-muted-foreground mt-2">
            Failed to load assigned students. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <Button
          onClick={() => navigate("/admin/assign")}
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {isMentor ? "Mentors" : "Advisors"}
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Assigned Students
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage student assignments for this{" "}
              {isMentor ? "mentor" : "advisor"}
            </p>
          </div>
          <AssignStudentDialog
            onAssign={handleAssignStudent}
            isAssigning={isMentor ? isCreatingMentor : isCreatingAdvisor}
            type={isMentor ? "mentor" : "advisor"}
          />
        </div>
      </div>

      <Card className="bg-card text-card-foreground border border-border p-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Total Assigned: {students.length}
          </h2>
        </div>
      </Card>

      <div className="mt-6">
        {studentsLoading ? (
          <LoadingSpinner />
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">
                No Students Assigned
              </h2>
              <p className="text-muted-foreground mt-2">
                This {isMentor ? "mentor" : "advisor"} has no assigned students
                yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              if (!student.id || !student.email) return null;
              return (
                <StudentCard
                  key={student.id}
                  student={student as any}
                  assignmentId={getAssignmentId(student.id)}
                  onRemove={handleRemoveAssignment}
                  isRemoving={isMentor ? isDeletingMentor : isDeletingAdvisor}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedStudentsPage;
