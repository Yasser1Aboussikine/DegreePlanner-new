import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import type { SignUpFormData } from "@/schemas/auth.schema";
import { useGetAllMinorsQuery } from "@/store";

interface AcademicInfoStepProps {
  form: UseFormReturn<SignUpFormData>;
}

export const AcademicInfoStep = ({ form }: AcademicInfoStepProps) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = form;

  const { data: minorsData, isLoading: minorsLoading } = useGetAllMinorsQuery();
  const minors = minorsData?.data || [];
  const selectedMinor = watch("minor");
  const selectedClassification = watch("classification");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="major">Major *</Label>
        <Input
          id="major"
          value="Computer Science"
          disabled
          className="bg-muted border-border"
        />
        <p className="text-xs text-muted-foreground">
          Currently only Computer Science is available
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minor">Minor (Optional)</Label>
        <Select
          value={selectedMinor || "none"}
          onValueChange={(value) =>
            setValue("minor", value === "none" ? undefined : value)
          }
        >
          <SelectTrigger className="bg-background border-border">
            <SelectValue
              placeholder={
                minorsLoading ? "Loading minors..." : "Select a minor"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {minors.map((minor) => (
              <SelectItem key={minor.code} value={minor.name}>
                {minor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.minor && (
          <p className="text-sm text-destructive">{errors.minor.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="classification">Classification *</Label>
        <Select
          value={selectedClassification || ""}
          onValueChange={(value) => {
            setValue("classification", value as any);
            trigger("classification");
          }}
        >
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Select classification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FRESHMAN">Freshman</SelectItem>
            <SelectItem value="SOPHOMORE">Sophomore</SelectItem>
            <SelectItem value="JUNIOR">Junior</SelectItem>
            <SelectItem value="SENIOR">Senior</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.classification && (
          <p className="text-sm text-destructive">
            {errors.classification.message}
          </p>
        )}
      </div>

      {selectedClassification === "FRESHMAN" && (
        <div className="flex items-center space-x-2">
          <input
            id="isFYEStudent"
            type="checkbox"
            {...register("isFYEStudent")}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <Label htmlFor="isFYEStudent" className="cursor-pointer">
            I am a First Year Experience (FYE) student
          </Label>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="joinDate">Join Date *</Label>
        <DatePicker
          date={watch("joinDate") ? new Date(watch("joinDate")) : undefined}
          onDateChange={(date) => {
            setValue("joinDate", date ? date.toISOString() : "");
            trigger("joinDate");
          }}
          placeholder="Select join date"
          error={!!errors.joinDate}
          fromYear={2000}
          toYear={new Date().getFullYear() + 1}
        />
        {errors.joinDate && (
          <p className="text-sm text-destructive">{errors.joinDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedGraduation">Expected Graduation *</Label>
        <DatePicker
          date={
            watch("expectedGraduation")
              ? new Date(watch("expectedGraduation"))
              : undefined
          }
          onDateChange={(date) => {
            setValue("expectedGraduation", date ? date.toISOString() : "");
            trigger("expectedGraduation");
          }}
          placeholder="Select expected graduation date"
          error={!!errors.expectedGraduation}
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 10}
        />
        {errors.expectedGraduation && (
          <p className="text-sm text-destructive">
            {errors.expectedGraduation.message}
          </p>
        )}
      </div>
    </div>
  );
};
