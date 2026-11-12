import apiClient from "./apiClient";

export const myPatientsService = {
  getAllAppointments: async () => {
    const response = await apiClient.get("/verimed_bookappoinment_create_update/");
    return response.data;
  },

  getDoctorAppointments: async (doctorProfileId) => {
    const response = await apiClient.post("/vb_doctorappoinment_list/", {
      doctorprofileid: doctorProfileId,
    });
    return response.data;
  },

  updateAppointment: async (formData) => {
    const response = await apiClient.patch("/verimed_bookappoinment_create_update/", formData);
    return response.data;
  },
};
