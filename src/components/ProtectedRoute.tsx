import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getToken, isRestaurateurRole } from "../hooks/auth";

type RouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

const ROLE = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  RESTAURATEUR: "RESTAURATEUR",
};

const hasRole = (roles: string[], role: string) =>
  roles.some((r) => r.toUpperCase() === role.toUpperCase());

const getHomePathForRoles = (roles: string[]) => {
  if (hasRole(roles, ROLE.ADMIN) || hasRole(roles, ROLE.SUPER_ADMIN)) return "/admin/home";
  if (hasRole(roles, ROLE.RESTAURATEUR)) return "/restaurateur/home";
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

  if (!isRestaurateurRole(roles[0])) {
    return <Navigate to={getHomePathForRoles(roles)} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
