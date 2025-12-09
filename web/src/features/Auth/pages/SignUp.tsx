import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Stepper, { Step } from "@/components/Stepper";
import { PersonalInfoStep } from "../components/PersonalInfoStep";
import { AcademicInfoStep } from "../components/AcademicInfoStep";
import { signUpSchema, type SignUpFormData } from "@/schemas/auth.schema";
import { useSignupMutation } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store";

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();

  // Calculate default dates
  const defaultJoinDate = new Date();
  const defaultExpectedGraduation = new Date(defaultJoinDate);
  defaultExpectedGraduation.setFullYear(defaultExpectedGraduation.getFullYear() + 3);
  defaultExpectedGraduation.setMonth(defaultExpectedGraduation.getMonth() + 8);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      major: "Computer Science",
      minor: undefined,
      classification: undefined,
      isFYEStudent: false,
      joinDate: defaultJoinDate.toISOString(),
      expectedGraduation: defaultExpectedGraduation.toISOString(),
    },
  });

  const { handleSubmit, trigger } = form;

  const handleStepChange = async (newStep: number) => {
    // Only validate when moving forward
    if (newStep > currentStep) {
      let isValid = false;

      if (currentStep === 1) {
        // Validate personal info step
        isValid = await trigger([
          "name",
          "email",
          "password",
          "confirmPassword",
        ]);
      } else if (currentStep === 2) {
        // Validate academic info step
        isValid = await trigger([
          "classification",
          "joinDate",
          "expectedGraduation",
        ]);
      }

      // Only proceed if validation passed
      if (isValid) {
        setCurrentStep(newStep);
      }
    } else {
      // Allow going back without validation
      setCurrentStep(newStep);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    const toastId = toast.loading("Creating your account...");

    try {
      const { confirmPassword, ...signupData } = data;

      const result = await signup(signupData).unwrap();

      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        })
      );

      toast.success("Account created successfully!", { id: toastId });

      navigate("/signin");
    } catch (err: any) {
      console.error("Sign up error:", err);
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to create account. Please try again.",
        { id: toastId }
      );
    }
  };

  const handleFinalStepCompleted = async () => {
    // Validate all fields before submission
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(onSubmit)();
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-foreground">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join our academic planning platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stepper
              initialStep={currentStep}
              onStepChange={handleStepChange}
              onFinalStepCompleted={handleFinalStepCompleted}
              backButtonText="Back"
              nextButtonText="Next"
              className="p-0"
              nextButtonProps={{
                disabled: isLoading,
              }}
            >
              <Step>
                <PersonalInfoStep form={form} />
              </Step>
              <Step>
                <AcademicInfoStep form={form} />
              </Step>
            </Stepper>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground border-t border-border pt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
