// src/routes/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === "Admin" ? "/dashboard" : "/profile"} />;
  }

  return <>{children}</>;
}
