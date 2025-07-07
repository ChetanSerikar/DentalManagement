import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react"; // 👈 import icons
import type { User } from "@/types";

export default function Account() {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPassword(user.password || "");
    }
  }, [user]);

  const handleSave = () => {
    if (!user?.id || !user?.role) return;

    const updatedUser: User = {
      ...user,
      email,
      password,
    };

    updateUser?.(updatedUser);
    alert("Account updated.");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Account</h1>
      <div className="space-y-4">
        {/* Email Field */}
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Password Field with Toggle */}
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <Button className="w-full" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
