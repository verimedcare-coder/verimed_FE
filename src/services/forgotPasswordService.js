import apiClient from "./apiClient";

export const forgotPasswordService = {
  resetPassword: async ({ username, password }) => {
    const formData = new FormData();
    formData.append(
      "user_update_data",
      JSON.stringify({ username, password }),
    );
    const response = await apiClient.patch("/user_update_user/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
