import type { User } from "@/store/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

interface MentorAdvisorCardProps {
  user: User;
  type: "mentor" | "advisor";
  assignedCount?: number;
}

export const MentorAdvisorCard = ({ user, type, assignedCount = 0 }: MentorAdvisorCardProps) => {
  const navigate = useNavigate();

  const handleViewStudents = () => {
    navigate(`/admin/assign/${type}s/${user.id}/students`);
  };

  return (
    <Card className="bg-card text-card-foreground border border-border p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{user.name || "N/A"}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{assignedCount}</span>
          </div>
        </div>

        <Button
          onClick={handleViewStudents}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          See Assigned Students
        </Button>
      </div>
    </Card>
  );
};
