import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Mail } from "lucide-react";
import { useLoginMutation } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, selectIsAuthenticated } from "@/store";
import { toast } from "sonner";
import { signInSchema, type SignInFormData } from "@/schemas/auth.schema";

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const from = (location.state as any)?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: SignInFormData) => {
    const toastId = toast.loading("Signing in...");

    try {
      const result = await login(data).unwrap();

      console.log("Login successful, result:", result);

      // Backend wraps response in { success, message, data }
      const authData = result?.data || result;

      console.log("Auth data:", authData);

      // Store credentials in Redux and localStorage
      dispatch(
        setCredentials({
          user: authData.user,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
        })
      );

      toast.success("Login successful!", { id: toastId });

      // Always redirect to role-specific dashboard after login
      const dashboardPath = getDashboardPath(authData.user.role);
      console.log(`Navigating to dashboard: ${dashboardPath}`);
      navigate(dashboardPath, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(
        err?.data?.message || "Login failed. Please check your credentials.",
        { id: toastId }
      );
    }
  };

  const getDashboardPath = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "/student/dashboard";
      case "ADMIN":
        return "/admin/dashboard";
      case "ADVISOR":
        return "/advisor/dashboard";
      case "REGISTRAR":
        return "/registrar/dashboard";
      case "MENTOR":
        return "/mentor/dashboard";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-not-allowed border-border hover:bg-accent hover:text-accent-foreground"
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Outlook
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary [&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--background))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-primary hover:text-primary-hover hover:underline cursor-pointer transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary [&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--background))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-medium cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
