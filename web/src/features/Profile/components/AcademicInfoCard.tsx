import CardLayout from "@/shared/CardLayout";
import { GraduationCap, BookOpen, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllMinorsQuery } from "@/store/api/minorApi";
import { useUpdatePersonalInfoMutation } from "@/store/api/authApi";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store";
import { useState } from "react";
import { toast } from "sonner";

interface AcademicInfoCardProps {
  major?: string;
  minor?: string;
  classification?: string;
  expectedGraduation?: string;
  isFYEStudent?: boolean;
  editableMinor?: boolean;
  userId?: string;
}

export const AcademicInfoCard = ({
  major,
  minor,
  classification,
  expectedGraduation,
  isFYEStudent,
  editableMinor = false,
  userId,
}: AcademicInfoCardProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [updatePersonalInfo, { isLoading: isUpdating }] =
    useUpdatePersonalInfoMutation();
  const { data: minorsData } = useGetAllMinorsQuery();
  const [selectedMinor, setSelectedMinor] = useState(minor || "");
  const getClassificationColor = (classification?: string) => {
    switch (classification) {
      case "FRESHMAN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SOPHOMORE":
        return "bg-green-100 text-green-800 border-green-200";
      case "JUNIOR":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SENIOR":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleMinorChange = async (value: string) => {
    setSelectedMinor(value);
    try {
      const result = await updatePersonalInfo({
        minor: value === "none" ? null : value,
      }).unwrap();
      dispatch(updateUser(result.data));
      toast.success("Minor updated successfully");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update minor");
    }
  };

  return (
    <CardLayout
      title={
        <>
          <GraduationCap className="h-5 w-5" />
          <span>Academic Information</span>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Major</p>
            <p className="text-base font-semibold">
              {major || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Minor</p>
            {editableMinor &&
            currentUser &&
            currentUser.id === userId &&
            (currentUser.role === "STUDENT" ||
              currentUser.role === "MENTOR") ? (
              <Select
                value={selectedMinor || "none"}
                onValueChange={handleMinorChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select minor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {minorsData?.data?.map((m) => (
                    <SelectItem key={m.code} value={m.name}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-base font-semibold">{minor || "None"}</p>
            )}
          </div>
        </div>

        {classification && (
          <div className="flex items-start gap-3">
            <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Classification
              </p>
              <Badge
                variant="outline"
                className={`mt-1 ${getClassificationColor(classification)}`}
              >
                {classification}
              </Badge>
            </div>
          </div>
        )}

        {expectedGraduation && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Expected Graduation
              </p>
              <p className="text-base font-semibold">
                {new Date(expectedGraduation).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        )}

        {classification === "FRESHMAN" && isFYEStudent !== undefined && (
          <div className="flex items-start gap-3">
            <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                FYE Student
              </p>
              <Badge
                variant={isFYEStudent ? "default" : "secondary"}
                className="mt-1"
              >
                {isFYEStudent ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </CardLayout>
  );
};
