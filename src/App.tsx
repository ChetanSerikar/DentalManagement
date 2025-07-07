import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import PatientList from "@/pages/Patients/List";
import AddEditPatient from "@/pages/Patients/AddEdit";
import IncidentList from "@/pages/Appointments/List";
import CalendarView from "@/pages/Appointments/Calendar";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/auth-context";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import AddEditAppointment from "./pages/Appointments/AddEditAppointment";
import { ThemeProvider } from "./components/theme-provider";
import Account from "./pages/Account";
import { Toaster } from "./components/ui/sonner";

function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
        <p className="text-gray-600">You do not have permission to view this page.</p>
        <a href="/" className="text-blue-500 underline">Go back</a>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
    <ThemeProvider>
      <Routes>
        {/* Redirect root to appropriate dashboard/profile/login */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={user.role === "Admin" ? "/dashboard" : "/profile"}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public route (login only if not authenticated) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Admin-only pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <PatientList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <Account />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/add"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <AddEditPatient />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <AddEditPatient />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <IncidentList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <AddEditAppointment />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/add"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <AddEditAppointment />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Layout>
                <CalendarView />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Patient-only page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Common */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
    <Toaster />
    </>
  );
}
