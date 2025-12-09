import { useState } from "react";
import CardLayout from "@/shared/CardLayout";
import { User, Mail, Calendar, Shield, Edit2, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePersonalInfoMutation } from "@/store/api/authApi";
import { toast } from "sonner";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name || "");
  const [editEmail, setEditEmail] = useState(email);
  const [updatePersonalInfo, { isLoading }] = useUpdatePersonalInfoMutation();

  const handleSave = async () => {
    try {
      await updatePersonalInfo({
        name: editName,
        email: editEmail,
      }).unwrap();

      toast.success("Personal information updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update personal information");
    }
  };

  const handleCancel = () => {
    setEditName(name || "");
    setEditEmail(email);
    setIsEditing(false);
  };

  return (
    <CardLayout
      title={
        <>
          <User className="h-5 w-5" />
          <span>Personal Information</span>
        </>
      }
      action={
        !isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Full Name
            </p>
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            ) : (
              <p className="text-base font-semibold">{name || "Not provided"}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            {isEditing ? (
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
              />
            ) : (
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
            )}
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
