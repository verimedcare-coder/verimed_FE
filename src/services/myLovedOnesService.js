import apiClient from "./apiClient";
import { filterSponsorPatients, toValidId } from "../utils/sponsorIsolation";

export const myLovedOnesService = {
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

  getPatientAppointments: async (patientProfileId) => {
    const response = await apiClient.post("/vb_patientappoinment_list/", {
      patientprofileid: patientProfileId,
    });
    return response.data;
  },

  updatePatientProfile: async (formData) => {
    const response = await apiClient.post("/patientprofile_create_update/", formData);
    return response.data;
  },

  patchPatientProfile: async (formData) => {
    const response = await apiClient.patch("/patientprofile_create_update/", formData);
    return response.data;
  },
};
