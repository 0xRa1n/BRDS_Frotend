import { Navigate } from "react-router";
import { toast } from "sonner";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem("admin_role");

  const isAuthenticated = role && (role.toLowerCase() === "admin" || role.toLowerCase() === "staff");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Unauthorized access. Please login.", { id: "admin-auth" });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
