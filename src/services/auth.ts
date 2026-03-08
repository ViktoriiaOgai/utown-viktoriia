import { api } from "./api";

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