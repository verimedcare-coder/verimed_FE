import apiClient from "./apiClient";

export const siderService = {
  getUsers: async () => {
    const response = await apiClient.get("/user_view/");
    return response.data;
  },

  getSponsors: async () => {
    const response = await apiClient.get("/sponsorprofile_list/");
    return response.data;
  },

  getCaretakers: async () => {
    const response = await apiClient.get("/caretakerprofile_list/");
    return response.data;
  },

  getDoctors: async () => {
    const response = await apiClient.get("/doctorprofile_list/");
    return response.data;
  },

  getPatients: async () => {
    const response = await apiClient.get("/patientprofile_list/");
    return response.data;
  },
};
