import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getToken, getRole, isAdminRole } from "../hooks/auth";

type RouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: RouteProps) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: RouteProps) {
  const token = getToken();
  const role = getRole();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!role) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdminRole(role)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
