import apiClient from "./apiClient";

export const appointmentsService = {
  getAllAppointments: async () => {
    const response = await apiClient.get("/verimed_bookappoinment_create_update/");
    return response.data;
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
