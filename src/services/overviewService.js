import apiClient from "./apiClient";

export const overviewService = {
  getSponsorPatients: async (sponsorId) => {
    const response = await apiClient.post("/sponsorid_patientprofile_list/", {
      sponsorid: Number(sponsorId),
    });
    return response.data;
  },

  getDoctors: async () => {
    const response = await apiClient.get("/doctorprofile_list/");
    return response.data;
  },

  getDoctorAppointments: async (doctorProfileId) => {
    const response = await apiClient.post("/vb_doctorappoinment_list/", {
      doctorprofileid: doctorProfileId,
    });
    return response.data;
  },

  getPatientAppointments: async (patientProfileId) => {
    const response = await apiClient.post("/vb_patientappoinment_list/", {
      patientprofileid: patientProfileId,
    });
    return response.data;
  },

  getCaretakers: async () => {
    const response = await apiClient.get("/caretakerprofile_list/");
    return response.data;
  },

  createOrUpdateAppointment: async (formData) => {
    const response = await apiClient.post("/verimed_bookappoinment_create_update/", formData);
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get("/user_view/");
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await apiClient.get("/verimed_bookappoinment_create_update/");
    return response.data;
  },
};
