export const base_url = "https://verimedramja.pythonanywhere.com/verimed";

// Determines whether a given user object should be treated as an admin.
// Special case: user with id 100 is always considered an admin regardless of role.
export const isAdminUser = (user) =>
  user?.user_role === "admin" || user?.id === 100;
