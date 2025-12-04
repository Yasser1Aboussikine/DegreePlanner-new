import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
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

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [login, { isLoading }] = useLoginMutation();

  // Get the redirect path from location state, or default to "/"
  const from = (location.state as any)?.from?.pathname || "/";

  // If user is already authenticated, redirect them away from signin page
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async () => {
    const toastId = toast.loading("Signing in...");

    try {
      // Call the login mutation
      const result = await login({ email, password }).unwrap();

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

      console.log(`Credentials stored, navigating to ${from}`);

      toast.success("Login successful!", { id: toastId });

      // Navigate to previous route or home page
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(
        err?.data?.message || "Login failed. Please check your credentials.",
        { id: toastId }
      );
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer border-border hover:bg-accent hover:text-accent-foreground"
              disabled
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
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email && password) {
                    handleSubmit();
                  }
                }}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary [&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--background))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/forgot-password";
                  }}
                  className="text-sm text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email && password) {
                    handleSubmit();
                  }
                }}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary [&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--background))] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full font-medium cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  console.log("Navigate to sign up");
                }}
                className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
