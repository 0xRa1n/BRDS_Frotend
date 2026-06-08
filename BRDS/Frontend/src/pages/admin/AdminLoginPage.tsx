import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.admin.login({ username, password });
      localStorage.setItem("admin_token", res.token);
      localStorage.setItem("admin_role", res.role);
      if (res.fullName) {
        localStorage.setItem("admin_full_name", res.fullName);
      } else {
        localStorage.removeItem("admin_full_name");
      }
      toast.success("Login successful");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-lg shadow-sm border border-gray-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
            BC
          </div>
          <h1 className="text-xl font-bold text-[#1e293b] mb-1">
            BarangayConnect
          </h1>
          <p className="text-sm text-gray-500">Staff & Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm tracking-widest"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-slate-600 hover:text-slate-800 transition-colors">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
