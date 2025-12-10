import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleBasedLayout } from "./Layouts";
import { SignIn as SignInPage, SignUp as SignUpPage } from "./features/Auth";
import ForgotPasswordPage from "./features/Auth/pages/ForgotPassword";
import ResetPasswordPage from "./features/Auth/pages/ResetPassword";
import { DegreePlanBuilder } from "./features/DegreePlan/pages/DegreePlanBuilder";
import {
  StudentDashboard,
  MentorDashboard,
  AdvisorDashboard,
  RegistrarDashboard,
  AdminDashboard,
} from "./features/Dashboards/pages";
import AdminCourses from "./features/Courses/pages/AdminCourses";
import ViewOnlyCourses from "./features/Courses/pages/ViewOnlyCourses";
import { CourseDetailPage } from "./features/Courses/pages/CourseDetailPage";
import AdminCourseDetail from "./features/Courses/pages/AdminCourseDetail";
import AdminCreateCourse from "./features/Courses/pages/AdminCreateCourse";
import RegistrarCreateCourse from "./features/Courses/pages/RegistrarCreateCourse";
import RegistrarCourseDetail from "./features/Courses/pages/RegistrarCourseDetail";
import {
  AssignmentPage,
  AssignedStudentsPage,
  UsersPage,
  DegreePlansPage,
  UserProfilePage,
  AdvisorStudentsPage,
  MentorStudentsPage,
} from "./features/Users";
import { StudentChatPage, MentorGroupChatPage } from "./features/Chat/pages";
import {
  StudentProfilePage,
  MentorProfilePage,
  AdvisorProfilePage,
  AdminProfilePage,
  RegistrarProfilePage,
} from "./features/Profile/pages";
import {
  MentorReviewRequestsPage,
  AdvisorReviewRequestsPage,
  MentorStudentDegreePlanPage,
  AdvisorStudentDegreePlanPage,
} from "./features/Assignments";
import { ClassificationProtectedRoute } from "./components/ClassificationProtectedRoute";
import { RoleBasedRedirect } from "./components/RoleBasedRedirect";
import Home from "./features/LandingPage/pages/Home";

function App() {
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // Only inject Botpress if authenticated and role is STUDENT or MENTOR
    if (user && (user.role === "STUDENT" || user.role === "MENTOR")) {
      // Inject Botpress main script
      if (!document.getElementById("botpress-inject")) {
        const script = document.createElement("script");
        script.src = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
        script.id = "botpress-inject";
        document.body.appendChild(script);
      }
      // Inject Botpress config script
      if (!document.getElementById("botpress-config")) {
        const configScript = document.createElement("script");
        configScript.src =
          "https://files.bpcontent.cloud/2025/12/01/00/20251201001255-2IYA2VOU.js";
        configScript.defer = true;
        configScript.id = "botpress-config";
        document.body.appendChild(configScript);
      }
    } else {
      // Remove Botpress scripts if present
      const inject = document.getElementById("botpress-inject");
      if (inject) inject.remove();
      const config = document.getElementById("botpress-config");
      if (config) config.remove();
    }
  }, [user]);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/home" element={<Home />} />

        {/* Protected Routes - Role-based Layout will handle routing */}
        <Route path="/" element={<RoleBasedLayout />}>
          <Route index element={<RoleBasedRedirect />} />

          {/* Student routes */}
          <Route path="student">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="courses" element={<ViewOnlyCourses />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="degree-plan" element={<DegreePlanBuilder />} />
            <Route
              path="chat"
              element={
                <ClassificationProtectedRoute
                  allowedClassifications={["FRESHMAN", "SOPHOMORE"]}
                >
                  <StudentChatPage />
                </ClassificationProtectedRoute>
              }
            />
          </Route>

          {/* Admin routes */}
          <Route path="admin">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/create" element={<AdminCreateCourse />} />
            <Route path="courses/:id" element={<AdminCourseDetail />} />
            <Route path="degree-plans" element={<DegreePlansPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:userId/profile" element={<UserProfilePage />} />
            <Route path="assign" element={<AssignmentPage />} />
            <Route
              path="assign/:type/:id/students"
              element={<AssignedStudentsPage />}
            />
          </Route>

          {/* Advisor routes */}
          <Route path="advisor">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdvisorDashboard />} />
            <Route path="profile" element={<AdvisorProfilePage />} />
            <Route path="students" element={<AdvisorStudentsPage />} />
            <Route
              path="students/:userId/profile"
              element={<UserProfilePage />}
            />
            <Route
              path="students/:studentId/degree-plan"
              element={<AdvisorStudentDegreePlanPage />}
            />
            <Route path="courses" element={<ViewOnlyCourses />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route
              path="review-requests"
              element={<AdvisorReviewRequestsPage />}
            />
          </Route>

          {/* Registrar routes */}
          <Route path="registrar">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RegistrarDashboard />} />
            <Route path="profile" element={<RegistrarProfilePage />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/create" element={<RegistrarCreateCourse />} />
            <Route path="courses/:id" element={<RegistrarCourseDetail />} />
            <Route path="assign" element={<div>Registrar Assign</div>} />
          </Route>

          {/* Mentor routes */}
          <Route path="mentor">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MentorDashboard />} />
            <Route path="profile" element={<MentorProfilePage />} />
            <Route path="courses" element={<ViewOnlyCourses />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="degree-plan" element={<DegreePlanBuilder />} />
            <Route path="students" element={<MentorStudentsPage />} />
            <Route
              path="students/:userId/profile"
              element={<UserProfilePage />}
            />
            <Route
              path="students/:studentId/degree-plan"
              element={<MentorStudentDegreePlanPage />}
            />
            <Route path="chat" element={<MentorGroupChatPage />} />
            <Route
              path="review-requests"
              element={<MentorReviewRequestsPage />}
            />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
