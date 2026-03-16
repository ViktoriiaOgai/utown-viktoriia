import { api } from "@/services/api";

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

export const login = (
    phone: string,
  password: string
) => {
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
    newPassword
  });
};
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("fullName");
};