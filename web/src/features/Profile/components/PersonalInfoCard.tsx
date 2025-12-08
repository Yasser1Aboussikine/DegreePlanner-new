import CardLayout from "@/shared/CardLayout";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PersonalInfoCardProps {
  name?: string;
  email: string;
  role: string;
  joinDate?: string;
  emailVerified?: boolean;
}

export const PersonalInfoCard = ({
  name,
  email,
  role,
  joinDate,
  emailVerified,
}: PersonalInfoCardProps) => {
  return (
    <CardLayout
      title={
        <>
          <User className="h-5 w-5" />
          <span>Personal Information</span>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Full Name
            </p>
            <p className="text-base font-semibold">{name || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">{email}</p>
              {emailVerified && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <Badge variant="default" className="mt-1">
              {role}
            </Badge>
          </div>
        </div>

        {joinDate && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">    
              <p className="text-sm font-medium text-muted-foreground">
                AUIer Since
              </p>
              <p className="text-base font-semibold">
                {new Date(joinDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </CardLayout>
  );
};
