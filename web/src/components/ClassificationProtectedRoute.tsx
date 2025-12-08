import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ClassificationProtectedRouteProps {
  children: React.ReactNode;
  allowedClassifications: string[];
  redirectTo?: string;
}

export const ClassificationProtectedRoute = ({
  children,
  allowedClassifications,
  redirectTo = "/student/dashboard",
}: ClassificationProtectedRouteProps) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user?.classification) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedClassifications.includes(user.classification)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
