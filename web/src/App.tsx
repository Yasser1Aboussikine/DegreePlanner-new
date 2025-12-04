import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleBasedLayout } from "./Layouts";
import HeroSection from "./features/Courses/Test";
import SignInPage from "./features/Login/pages/SignIn";
import SignUpPage from "./features/SignUp/pages/SignUp";

// Placeholder Dashboard component
const DashboardPlaceholder = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
    <p className="text-gray-600">Dashboard content coming soon...</p>
  </div>
);

// Placeholder Profile component
const ProfilePlaceholder = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Profile</h1>
    <p className="text-gray-600">Profile content coming soon...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/landing" element={<HeroSection />} />

        {/* Protected Routes - Role-based Layout will handle routing */}
        <Route path="/" element={<RoleBasedLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Common routes for all roles */}
          <Route path="dashboard" element={<DashboardPlaceholder />} />
          <Route path="profile" element={<ProfilePlaceholder />} />

          {/* Student routes */}
          <Route path="student">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPlaceholder />} />
            <Route path="profile" element={<ProfilePlaceholder />} />
            <Route path="courses" element={<div>Student Courses</div>} />
            <Route
              path="degree-plan"
              element={<div>Student Degree Plan</div>}
            />
          </Route>

          {/* Admin routes */}
          <Route path="admin">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPlaceholder />} />
            <Route path="profile" element={<ProfilePlaceholder />} />
            <Route path="courses" element={<div>Admin Courses</div>} />
            <Route
              path="degree-plans"
              element={<div>Admin Degree Plans</div>}
            />
            <Route path="users" element={<div>Admin Users</div>} />
            <Route path="assign" element={<div>Admin Assign</div>} />
          </Route>

          {/* Advisor routes */}
          <Route path="advisor">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPlaceholder />} />
            <Route path="profile" element={<ProfilePlaceholder />} />
            <Route path="students" element={<div>Advisor Students</div>} />
            <Route path="chat" element={<div>Advisor Chat</div>} />
            <Route path="approve" element={<div>Advisor Approve</div>} />
          </Route>

          {/* Registrar routes */}
          <Route path="registrar">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPlaceholder />} />
            <Route path="profile" element={<ProfilePlaceholder />} />
            <Route path="courses" element={<div>Registrar Courses</div>} />
            <Route path="assign" element={<div>Registrar Assign</div>} />
          </Route>

          {/* Mentor routes */}
          <Route path="mentor">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPlaceholder />} />
            <Route path="profile" element={<ProfilePlaceholder />} />
            <Route path="courses" element={<div>Mentor Courses</div>} />
            <Route path="degree-plan" element={<div>Mentor Degree Plan</div>} />
            <Route path="students" element={<div>Mentor Students</div>} />
            <Route path="chat" element={<div>Mentor Chat</div>} />
            <Route path="approve" element={<div>Mentor Approve</div>} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
