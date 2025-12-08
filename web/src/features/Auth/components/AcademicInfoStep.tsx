import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SignUpFormData } from "@/schemas/auth.schema";

interface AcademicInfoStepProps {
  form: UseFormReturn<SignUpFormData>;
}

export const AcademicInfoStep = ({ form }: AcademicInfoStepProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="major">Major *</Label>
        <Input
          id="major"
          placeholder="Computer Science"
          {...register("major")}
          className="bg-background border-border"
        />
        {errors.major && (
          <p className="text-sm text-destructive">{errors.major.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="minor">Minor (Optional)</Label>
        <Input
          id="minor"
          placeholder="Mathematics"
          {...register("minor")}
          className="bg-background border-border"
        />
        {errors.minor && (
          <p className="text-sm text-destructive">{errors.minor.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="classification">Classification *</Label>
        <select
          id="classification"
          {...register("classification")}
          className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select classification</option>
          <option value="FRESHMAN">Freshman</option>
          <option value="SOPHOMORE">Sophomore</option>
          <option value="JUNIOR">Junior</option>
          <option value="SENIOR">Senior</option>
          <option value="OTHER">Other</option>
        </select>
        {errors.classification && (
          <p className="text-sm text-destructive">
            {errors.classification.message}
          </p>
        )}
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="joinDate">Join Date *</Label>
        <Input
          id="joinDate"
          type="date"
          {...register("joinDate")}
          className="bg-background border-border"
        />
        {errors.joinDate && (
          <p className="text-sm text-destructive">{errors.joinDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedGraduation">Expected Graduation *</Label>
        <Input
          id="expectedGraduation"
          type="date"
          {...register("expectedGraduation")}
          className="bg-background border-border"
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
