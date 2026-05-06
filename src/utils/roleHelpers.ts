export const ROLE = {
  CLIENT: "CLIENT",
  RESTAURATEUR: "RESTAURATEUR",
  ADMIN: "ADMIN",
} as const;

export const getHomePathForRole = (role?: string): string => {
  switch (role) {
    case ROLE.RESTAURATEUR:
      return "/mobile-admin/restaurateur";

    case ROLE.ADMIN:
      return "/admin/home";

    case ROLE.CLIENT:
    default:
      return "/home";
  }
};

export const hasRole = (userRoles: string[] = [], role: string) => {
  return userRoles.includes(role);
};

export const getHomePathForRoles = (roles: string[] = []): string => {
  if (roles.includes(ROLE.ADMIN)) {
    return "/admin/home";
  }
  if (roles.includes(ROLE.RESTAURATEUR)) {
    return "/mobile-admin/restaurateur";
  }
  return "/home";
};
