import { useState, useEffect } from "react";
import { AuthContext } from "./auth-context";
import type { User } from "@/types";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const navigate = useNavigate();

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("authUser");
      if (!stored || stored === "null") {
        setUser(undefined); // explicitly not logged in
      } else {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse authUser", err);
      setUser(undefined);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const match = users.find((u) => u.email === email && u.password === password);
    if (match) {
      localStorage.setItem("authUser", JSON.stringify(match));
      setUser(match);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    navigate("/login");
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem("authUser", JSON.stringify(updated));

    // Optionally update in users list
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
