import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import { StudentLayout } from "./StudentLayout";
import { AdminLayout } from "./AdminLayout";
import { AdvisorLayout } from "./AdvisorLayout";
import { RegistrarLayout } from "./RegistrarLayout";
import { MentorLayout } from "./MentorLayout";

// Component Props
interface RoleBasedLayoutProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({
  allowedRoles,
  requireAuth = true,
}) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  console.log("RoleBasedLayout - user:", user);
  console.log("RoleBasedLayout - isAuthenticated:", isAuthenticated);

  // Authentication check
  if (requireAuth && !isAuthenticated) {
    console.log("Not authenticated, redirecting to /signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // For unauthenticated users
  if (!user || !isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Role-based layout selection
  switch (user.role) {
    case "STUDENT":
      return <StudentLayout />;
    case "ADMIN":
      return <AdminLayout />;
    case "ADVISOR":
      return <AdvisorLayout />;
    case "REGISTRAR":
      return <RegistrarLayout />;
    case "MENTOR":
      return <MentorLayout />;
    default:
      return <Navigate to="/signin" replace />;
  }
};
