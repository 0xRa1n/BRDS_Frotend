import { Navigate, useLocation } from "react-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("is_authenticated");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
