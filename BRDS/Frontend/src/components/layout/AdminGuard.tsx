import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const role = localStorage.getItem("admin_role");

    if (!token || !role || (role !== "admin" && role !== "staff")) {
      toast.error("Unauthorized access. Please login.", { id: "admin-auth" });
      navigate("/admin/login");
    }
  }, [navigate]);

  return <>{children}</>;
}
