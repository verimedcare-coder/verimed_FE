import apiClient from "./apiClient";
import { filterSponsorPatients, toValidId } from "../utils/sponsorIsolation";

export const headerService = {
  getSponsorProfiles: async () => {
    const response = await apiClient.get("/sponsorprofile_list/");
    return response.data;
  },

  getSponsorPatients: async (sponsorId) => {
    const validSponsorId = toValidId(sponsorId);
    if (!validSponsorId) return [];
    const response = await apiClient.post("/sponsorid_patientprofile_list/", {
      sponsorid: validSponsorId,
    });
    return filterSponsorPatients(
      Array.isArray(response.data) ? response.data : [],
      validSponsorId,
      true,
    );
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
