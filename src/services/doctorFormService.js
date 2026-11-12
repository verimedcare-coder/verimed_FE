import apiClient from "./apiClient";

export const doctorFormService = {
  getDoctorReports: async () => {
    const response = await apiClient.get("/doctor_reports_curd/");
    return response.data;
  },

  submitDoctorReport: async (formData) => {
    const response = await apiClient.post("/doctor_reports_curd/", formData);
    return response.data;
  },

  updateDoctorReport: async (formData) => {
    const response = await apiClient.patch("/doctor_reports_curd/", formData);
    return response.data;
  },

  updateDoctorProfile: async (formData) => {
    const response = await apiClient.patch("/doctorprofile_update/", formData);
    return response.data;
  },
};
