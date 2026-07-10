/**
 * Secure Storage Utility
 * Encapsulates localStorage interactions with safe accessors and error boundaries.
 */

const TOKEN_KEY = "token";
const USER_KEY = "user_data";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving token from storage:", error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error setting token in storage:", error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token from storage:", error);
  }
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error retrieving user from storage:", error);
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error("Error setting user in storage:", error);
  }
};

export const clearAuthStorage = () => {
  removeToken();
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error clearing auth storage:", error);
  }
};
