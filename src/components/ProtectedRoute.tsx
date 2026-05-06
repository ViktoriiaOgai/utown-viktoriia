import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getToken, isAdminRole, isRestaurateurRole } from "../hooks/auth";

type RouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

const getHomePathForRoles = (roles: string[]) => {
  if (isAdminRole(roles)) return "/admin/home";
  if (isRestaurateurRole(roles)) return "/restaurateur/home";
  return "/home";
};

export function ProtectedRoute({ children, allowedRoles }: RouteProps) {
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roles: string[] = user.roles || [];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !roles.some((r) => allowedRoles.includes(r))) {
    return <Navigate to={getHomePathForRoles(roles)} replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: RouteProps) {
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roles: string[] = user.roles || [];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminRole(roles)) {
    return <Navigate to={getHomePathForRoles(roles)} replace />;
  }

  return <>{children}</>;
}

export function RestaurateurRoute({ children }: RouteProps) {
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roles: string[] = user.roles || [];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isRestaurateurRole(roles)) {
    return <Navigate to={getHomePathForRoles(roles)} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
