import apiClient from "./apiClient";

export const doctorFormService = {
  createDoctorProfile: async (formData) => {
    const response = await apiClient.post("/doctorprofile_list/", formData);
    return response.data;
  },

  updateDoctorProfile: async (formData) => {
    const response = await apiClient.patch("/doctorprofile_update/", formData);
    return response.data;
  },
};
