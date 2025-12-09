import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { useRequestPasswordResetMutation } from "@/store/api/passwordResetApi";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  emailOrUsername: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const toastId = toast.loading("Sending reset link...");

    try {
      await requestPasswordReset(data).unwrap();

      toast.success(
        "If an account exists with that email address, a password reset link has been sent.",
        { id: toastId, duration: 5000 }
      );

      setTimeout(() => navigate("/signin"), 2000);
    } catch (err: any) {
      console.error("Password reset request error:", err);
      toast.error(
        err?.data?.message || "Failed to process request. Please try again.",
        { id: toastId }
      );
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/signin")}
            className="w-fit -ml-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
          <CardTitle className="text-3xl font-bold text-foreground">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername" className="text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emailOrUsername"
                  type="email"
                  placeholder="name@example.com"
                  {...register("emailOrUsername")}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                />
              </div>
              {errors.emailOrUsername && (
                <p className="text-sm text-destructive">
                  {errors.emailOrUsername.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-medium cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
