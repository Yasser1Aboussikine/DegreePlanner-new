import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

export const RoleBasedRedirect = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  switch (user.role) {
    case "STUDENT":
      return <Navigate to="/student/dashboard" replace />;
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "ADVISOR":
      return <Navigate to="/advisor/dashboard" replace />;
    case "REGISTRAR":
      return <Navigate to="/registrar/dashboard" replace />;
    case "MENTOR":
      return <Navigate to="/mentor/dashboard" replace />;
    default:
      return <Navigate to="/home" replace />;
  }
};
