export const base_url =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL;

// Determines whether a given user object should be treated as an admin.
// Special case: user with id 100 is always considered an admin regardless of role.
export const isAdminUser = (user) =>
  user?.user_role === "admin" || user?.id === 100;
