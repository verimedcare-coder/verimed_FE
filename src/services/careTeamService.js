import apiClient from "./apiClient";

export const careTeamService = {
  getDoctors: async () => {
    const response = await apiClient.get("/doctorprofile_list/");
    return response.data;
  },

  getPatientAppointments: async (patientProfileId) => {
    const response = await apiClient.post("/vb_patientappoinment_list/", {
      patientprofileid: patientProfileId,
    });
    return response.data;
  },
};
