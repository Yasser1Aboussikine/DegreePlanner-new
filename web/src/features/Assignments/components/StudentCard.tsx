import type { User } from "@/store/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, GraduationCap, Trash2 } from "lucide-react";

interface StudentCardProps {
  student: User;
  assignmentId: string;
  onRemove: (assignmentId: string) => void;
  isRemoving: boolean;
}

export const StudentCard = ({ student, assignmentId, onRemove, isRemoving }: StudentCardProps) => {
  return (
    <Card className="bg-card text-card-foreground border border-border p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{student.name || "N/A"}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{student.email}</span>
            </div>
          </div>
        </div>

        {student.major && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>{student.major}</span>
          </div>
        )}

        {student.classification && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Year:</span> {student.classification}
          </p>
        )}

        <Button
          onClick={() => onRemove(assignmentId)}
          disabled={isRemoving}
          variant="destructive"
          className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isRemoving ? "Removing..." : "Remove Assignment"}
        </Button>
      </div>
    </Card>
  );
};
