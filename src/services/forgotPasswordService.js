import apiClient from "./apiClient";

export const forgotPasswordService = {
  sendOtp: async (data) => {
    const response = await apiClient.post("/send_otp/", data);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await apiClient.post("/verify_otp/", data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await apiClient.post("/reset_password/", data);
    return response.data;
  },
};
