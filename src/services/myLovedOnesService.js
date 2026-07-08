import apiClient from "./apiClient";

export const myLovedOnesService = {
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

  updatePatientProfile: async (formData) => {
    const response = await apiClient.post("/patientprofile_create_update/", formData);
    return response.data;
  },

  patchPatientProfile: async (formData) => {
    const response = await apiClient.patch("/patientprofile_create_update/", formData);
    return response.data;
  },
};
