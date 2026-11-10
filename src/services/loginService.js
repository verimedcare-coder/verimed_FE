import apiClient from "./apiClient";
import {
  filterSponsorAppointments,
  filterSponsorPatients,
  toValidId,
} from "../utils/sponsorIsolation";

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

  getSponsorAppointments: async (sponsorId, ownedPatientIds = []) => {
    const validSponsorId = toValidId(sponsorId);
    if (!validSponsorId) return [];

    try {
      const response = await apiClient.post("/vb_sponsorappoinment_list/", {
        sponsorid: validSponsorId,
      });
      return filterSponsorAppointments(
        Array.isArray(response.data) ? response.data : [],
        validSponsorId,
        ownedPatientIds,
      );
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 404 && status !== 405) {
        throw error;
      }
      const fallbackRes = await apiClient.get(
        "/verimed_bookappoinment_create_update/",
        { params: { sponsor_id: validSponsorId } },
      );
      return filterSponsorAppointments(
        Array.isArray(fallbackRes.data) ? fallbackRes.data : [],
        validSponsorId,
        ownedPatientIds,
      );
    }
  },

  getPatientAppointments: async (patientProfileId) => {
    const response = await apiClient.post("/vb_patientappoinment_list/", {
      patientprofileid: patientProfileId,
    });
    return response.data;
  },
};
