import CardLayout from "@/shared/CardLayout";
import { Activity, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AccountStatusCardProps {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const AccountStatusCard = ({
  isActive,
  createdAt,
  updatedAt,
}: AccountStatusCardProps) => {
  return (
    <CardLayout
      title={
        <>
          <Activity className="h-5 w-5" />
          <span>Account Status</span>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {isActive ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge
              variant={isActive ? "default" : "destructive"}
              className="mt-1"
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Account Created
            </p>
            <p className="text-base font-semibold">
              {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Last Updated
            </p>
            <p className="text-base font-semibold">
              {new Date(updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};
