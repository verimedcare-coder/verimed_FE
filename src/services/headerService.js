import apiClient from "./apiClient";

export const headerService = {
  getSponsorPatients: async (sponsorId) => {
    const response = await apiClient.post("/sponsorid_patientprofile_list/", {
      sponsorid: Number(sponsorId),
    });
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get("/user_view/");
    return response.data;
  },

  getCaretakers: async () => {
    const response = await apiClient.get("/caretakerprofile_list/");
    return response.data;
  },
};
