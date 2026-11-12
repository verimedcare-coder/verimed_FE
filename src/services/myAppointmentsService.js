import apiClient from "./apiClient";

export const myAppointmentsService = {
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

  updateAppointment: async (formData) => {
    const response = await apiClient.patch("/verimed_bookappoinment_create_update/", formData);
    return response.data;
  },
};
