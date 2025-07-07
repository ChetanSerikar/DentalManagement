import { useAuth } from "@/context/auth-context";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: "Patients", path: "/patients", icon: <Users className="w-4 h-4" /> },
  { name: "Appointments", path: "/appointments", icon: <Stethoscope className="w-4 h-4" /> },
  { name: "Calendar", path: "/calendar", icon: <CalendarDays className="w-4 h-4" /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    if (!isDesktop) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isDesktop]);

  if (user?.role !== "Admin") return <>{children}</>;

  const pageTitle =
    navItems.find((item) => pathname.startsWith(item.path))?.name || "Dashboard";

  const avatarLetters =
    user.email?.split("@")[0].substring(0, 2).toUpperCase() || "AD";

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "w-64" : "w-0 md:w-0"}
          bg-background border-r h-full fixed md:relative z-30 transition-all duration-300 overflow-hidden
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold truncate">ENTNT Admin</h1>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (!isDesktop) setSidebarOpen(false);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      }`
                    }
                  >
                    {item.icon}
                    <span className={`${!sidebarOpen && "hidden md:inline"}`}>
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Profile and Logout */}
          <div className="border-t p-4 flex flex-col gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 w-full justify-start gap-3"
                >
                  <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center font-bold text-primary uppercase">
                    {avatarLetters}
                  </div>
                  <div className="flex-1 text-left truncate">
                    <p className="text-sm font-medium text-foreground">
                      {user.email}
                    </p>
                  </div>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-60 p-2 space-y-2" align="start">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  asChild
                >
                  <Link to="/account">Manage Account</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden ml-0 md:ml-0">
        {/* Header */}
        <header className="bg-background border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
