import apiClient from "./apiClient";

export const loginService = {
  login: async (credentials) => {
    const response = await apiClient.post("/user_login/", credentials);
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get("/user_view/");
    return response.data;
  },

  getSponsorProfiles: async () => {
    const response = await apiClient.get("/sponsorprofile_list/");
    return response.data;
  },

  getSponsorPatients: async (sponsorId) => {
    const response = await apiClient.post("/sponsorid_patientprofile_list/", {
      sponsorid: Number(sponsorId),
    });
    return response.data;
  },

  getPatientAppointments: async (patientProfileId) => {
    const response = await apiClient.post("/vb_patientappoinment_list/", {
      patientprofileid: patientProfileId,
    });
    return response.data;
  },
};
