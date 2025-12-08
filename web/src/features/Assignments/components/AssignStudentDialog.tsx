import { useState } from "react";
import { useGetUnassignedStudentsQuery as useGetUnassignedStudentsForMentorQuery } from "@/store/api/mentorAssignmentApi";
import { useGetUnassignedStudentsAndMentorsQuery as useGetUnassignedStudentsForAdvisorQuery } from "@/store/api/advisorAssignmentApi";
import { Button } from "@/components/ui/button";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserPlus } from "lucide-react";

interface AssignStudentDialogProps {
  onAssign: (studentId: string) => void;
  isAssigning: boolean;
  type?: "mentor" | "advisor"; // For advisor, we also include MENTOR role users
}

export const AssignStudentDialog = ({
  onAssign,
  isAssigning,
  type = "mentor",
}: AssignStudentDialogProps) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch unassigned students based on type
  const { data: mentorUnassignedData, isLoading: mentorLoading } =
    useGetUnassignedStudentsForMentorQuery(undefined, {
      skip: type !== "mentor",
    });

  const { data: advisorUnassignedData, isLoading: advisorLoading } =
    useGetUnassignedStudentsForAdvisorQuery(undefined, {
      skip: type !== "advisor",
    });

  const unassignedStudents =
    type === "mentor"
      ? mentorUnassignedData?.data || []
      : advisorUnassignedData?.data || [];

  const isLoading = type === "mentor" ? mentorLoading : advisorLoading;

  // Only show unassigned students
  const availableStudents = unassignedStudents;

  const handleAssign = () => {
    if (selectedStudentId) {
      onAssign(selectedStudentId);
      setSelectedStudentId("");
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Student
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card text-card-foreground border border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            {type === "advisor" ? "Assign Student/Mentor" : "Assign Student"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {type === "advisor"
              ? "Select a student or mentor to assign (mentors are students with part-time jobs). Each student can only have one advisor at a time."
              : "Select a student to assign. Each student can only have one mentor at a time."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : availableStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {type === "advisor"
                ? "No available students or mentors to assign"
                : "No available students to assign"}
            </p>
          ) : (
            <Select
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id!}>
                    {student.name || student.email}
                    {type === "advisor" && student.role && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({student.role})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAssign}
            disabled={!selectedStudentId || isAssigning}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
