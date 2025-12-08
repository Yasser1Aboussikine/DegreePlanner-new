
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleBasedLayout } from "./Layouts";
// import Home from './features/LandingPage/pages/Home'
import { SignIn as SignInPage, SignUp as SignUpPage } from "./features/Auth";
import { DegreePlanBuilder } from "./features/DegreePlan/pages/DegreePlanBuilder";
import { StudentDashboard } from "./features/Dashboards/pages/StudentDashboard";
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

// Placeholder Dashboard component
const DashboardPlaceholder = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
    <p className="text-muted-foreground">Dashboard content coming soon...</p>
  </div>
);



function App() {
  return (
    <BrowserRouter>

      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes - Role-based Layout will handle routing */}
        <Route path="/" element={<RoleBasedLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Common routes for all roles */}
          <Route path="dashboard" element={<DashboardPlaceholder />} />

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
            <Route path="dashboard" element={<DashboardPlaceholder />} />
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
            <Route path="dashboard" element={<DashboardPlaceholder />} />
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
            <Route path="chat" element={<div>Advisor Chat</div>} />
            <Route
              path="review-requests"
              element={<AdvisorReviewRequestsPage />}
            />
          </Route>

          {/* Registrar routes */}
          <Route path="registrar">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPlaceholder />} />
            <Route path="profile" element={<RegistrarProfilePage />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/create" element={<RegistrarCreateCourse />} />
            <Route path="courses/:id" element={<RegistrarCourseDetail />} />
            <Route path="assign" element={<div>Registrar Assign</div>} />
          </Route>

          {/* Mentor routes */}
          <Route path="mentor">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPlaceholder />} />
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
