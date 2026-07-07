import apiClient from "./apiClient";

export const membershipPlansService = {
  updateMembershipPlan: async (formData) => {
    const response = await apiClient.post("/verimed_bookappoinment_create_update/", formData);
    return response.data;
  },

  getSponsorProfiles: async () => {
    const response = await apiClient.get("/sponsorprofile_list/");
    return response.data;
  },
};
