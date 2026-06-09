import { Navigate } from "react-router";
import { toast } from "sonner";
import { useEffect } from "react";

export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem("admin_role");

  const isAuthenticated = role && role.toLowerCase() === "admin";

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Super Admin privileges required.", { id: "superadmin-auth" });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
