"use client";

import { Menu, Sun, Moon, Search, X } from "lucide-react";
import { useState } from "react";
;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "./theme-provider";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminHeader({
  sidebarOpen,
  toggleSidebar,
}: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 border-b bg-background px-4 shadow-sm">
      {/* Left: Sidebar toggle + title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <span className="text-lg font-semibold tracking-tight hidden sm:inline-block">
          ENTNT Admin
        </span>
      </div>

      {/* Center: Global search */}
      <div className="flex-1 max-w-md mx-4 relative hidden sm:flex">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search patients, appointments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* Right: Theme toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600" />
          )}
        </Button>
      </div>
    </header>
  );
}
