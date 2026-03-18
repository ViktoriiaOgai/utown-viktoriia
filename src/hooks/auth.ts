import { api } from "../services/api";

export const register = (
  phone: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string,
) => {
  return api.post("/auth/register", {
    username: phone,
    password,
    firstName,
    lastName,
    role,
  });
};

export const login = (phone: string, password: string) => {
  return api.post("/auth/login", {
    username: phone,
    password,
  });
};

export const requestPasswordReset = (phone: string) => {
  return api.post("/auth/password/forgot", {
    username: phone,
  });
};

export const resetPassword = (
  username: string,
  newPassword: string
) => {
  return api.post("/auth/password/reset", {
    username,
    code: "123456",
    newPassword,
  });
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

export const getToken = () => {
  const user = getStoredUser();

  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    user?.accessToken ||
    user?.token ||
    ""
  );
};

export const getRole = () => {
  const user = getStoredUser();

  return (
    localStorage.getItem("role") ||
    user?.role ||
    ""
  );
};

export const isAdminRole = (role?: string) => {
  const currentRole = role || getRole();
  return ["ADMIN", "SUPER_ADMIN"].includes(String(currentRole).toUpperCase());
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.removeItem("fullName");
};