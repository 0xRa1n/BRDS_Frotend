import { Navigate, useLocation } from "react-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("jwt_token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
