import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getToken } from "../hooks/auth";
import { getHomePathForRoles, hasRole, ROLE } from "@/utils/roleHelpers";

type RouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
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

  if (!hasRole(roles, ROLE.ADMIN)) {
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

  if (!hasRole(roles, ROLE.RESTAURATEUR)) {
    return <Navigate to={getHomePathForRoles(roles)} replace />;
  }

  return <>{children}</>;
}
