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
import { TranscriptUploadStep } from "../components/TranscriptUploadStep";
import {
  signUpSchema,
  type SignUpFormData,
} from "@/schemas/auth.schema";
import { useSignupMutation } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store";

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      major: "",
      minor: "",
      classification: undefined,
      isFYEStudent: false,
      joinDate: "",
      expectedGraduation: "",
    },
  });

  const {
    handleSubmit,
    trigger,
  } = form;

  const handleStepChange = async (newStep: number) => {
    let isValid = false;

    if (currentStep === 1 && newStep > currentStep) {
      isValid = await trigger(["name", "email", "password", "confirmPassword"]);
    } else if (currentStep === 2 && newStep > currentStep) {
      isValid = await trigger([
        "major",
        "classification",
        "joinDate",
        "expectedGraduation",
      ]);
    } else {
      isValid = true;
    }

    if (isValid) {
      setCurrentStep(newStep);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    const toastId = toast.loading("Creating your account...");

    try {
      const { confirmPassword, transcriptFile, ...signupData } = data;

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
        err?.data?.message || err?.message || "Failed to create account. Please try again.",
        { id: toastId }
      );
    }
  };

  const handleFinalStepCompleted = async () => {
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl border-border">
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
              stepCircleContainerClassName="bg-background"
              stepContainerClassName="bg-background"
              contentClassName="bg-background"
              footerClassName="bg-background"
              nextButtonProps={{
                disabled: isLoading,
                className: "bg-primary hover:bg-primary/90 text-primary-foreground"
              }}
              backButtonProps={{
                className: "text-foreground hover:text-foreground/80"
              }}
            >
              <Step>
                <PersonalInfoStep form={form} />
              </Step>
              <Step>
                <AcademicInfoStep form={form} />
              </Step>
              <Step>
                <TranscriptUploadStep form={form} />
              </Step>
            </Stepper>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground border-t border-border pt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
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
