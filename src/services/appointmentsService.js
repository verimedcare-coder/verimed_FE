import apiClient from "./apiClient";
import {
  filterSponsorAppointments,
  filterSponsorPatients,
  toValidId,
} from "../utils/sponsorIsolation";

export const appointmentsService = {
  getAllAppointments: async () => {
    const response = await apiClient.get("/verimed_bookappoinment_create_update/");
    return response.data;
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

  getDepartments: async () => {
    const response = await apiClient.get("/verimed_department_create_update/");
    return response.data;
  },

  getDoctors: async () => {
    const response = await apiClient.get("/doctorprofile_list/");
    return response.data;
  },

  getSponsors: async () => {
    const response = await apiClient.get("/sponsorprofile_list/");
    return response.data;
  },

  getPatients: async () => {
    const response = await apiClient.get("/patientprofile_list/");
    return response.data;
  },

  getCaretakers: async () => {
    const response = await apiClient.get("/caretakerprofile_list/");
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get("/user_view/");
    return response.data;
  },

  getPatientAppointments: async (patientProfileId) => {
    const response = await apiClient.post("/vb_patientappoinment_list/", {
      patientprofileid: patientProfileId,
    });
    return response.data;
  },

  getDoctorAppointments: async (doctorProfileId) => {
    const response = await apiClient.post("/vb_doctorappoinment_list/", {
      doctorprofileid: doctorProfileId,
    });
    return response.data;
  },

  createOrUpdateAppointment: async (formData) => {
    const response = await apiClient.post("/verimed_bookappoinment_create_update/", formData);
    return response.data;
  },
};
