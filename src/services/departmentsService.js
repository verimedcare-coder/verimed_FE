import apiClient from "./apiClient";

export const departmentsService = {
  getDepartments: async () => {
    const response = await apiClient.get("/verimed_department_create_update/");
    return response.data;
  },

  getDoctors: async () => {
    const response = await apiClient.get("/doctorprofile_list/");
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get("/user_view/");
    return response.data;
  },
};
