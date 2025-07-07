// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("Admin" | "Patient")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (user === null) {
    // Auth is still loading
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but wrong role
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
