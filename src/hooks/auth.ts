import { api } from "../services/api";

export const register = (
  phone: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string
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

export const deleteAccount = (password: string) => {
  return api.delete("/users/profile", {
    data: { password },
  });
};

export const requestPasswordReset = (phone: string) => {
  return api.post("/auth/password/forgot", {
    username: phone,
  });
};

export const resetPassword = (username: string, code: string, newPassword: string) => {
  return api.post("/auth/password/reset", {
    username,
    code,
    newPassword,
  });
};

export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return api.post("/auth/password/change", data);
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
    null
  );
};

export const getRole = () => {
  const user = getStoredUser();

  // ✅ ИСПРАВЛЕНО: поддержка и roles и role
  return user?.roles?.[0] || user?.role || "";
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
};

export const getUserName = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.fullName || "";
  } catch {
    return "";
  }
};

export const getUserData = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

export const updateUserProfile = async (data: {
  fullName?: string;
  username?: string;
  address?: string;
}) => {
  await api.put("/users/profile", {
    fullName: data.fullName,
    username: data.username,
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const updatedUser = {
    ...currentUser,
    ...(data.fullName !== undefined && { fullName: data.fullName }),
    ...(data.username !== undefined && { phone: data.username }),
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));

  if (data.address && data.address.trim()) {
    localStorage.setItem("address", data.address);
    let addressId = null;

    try {
      const res = await api.get("/addresses/default");
      addressId = res.data.id;
    } catch {
      try {
        const res = await api.get("/addresses");
        if (res.data.length > 0) {
          addressId = res.data[0].id;
        }
      } catch {
        console.log("No addresses at all");
      }
    }

    const [city, ...rest] = data.address.trim().split(" ");

    if (!city || rest.length === 0) {
      throw new Error("Please enter address like: City Street");
    }

    const payload = {
      city,
      street: rest.join(" "),
      fullAddress: data.address,
      area: "Default",
      state: "Default",
      postcode: "00000",
      details: "",
      typeAddress: 0,
      latitude: 0,
      longitude: 0,
      intercomCode: "",
    };

    if (addressId) {
      await api.put(`/addresses/${addressId}`, payload);
    } else {
      await api.post("/addresses", payload);
    }
  }
};

export const getAddresses = () => {
  return api.get("/addresses");
};
