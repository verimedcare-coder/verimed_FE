import apiClient from "./apiClient";

export const userManagementService = {
  // Fetch all 5 unique lists in parallel (Deduplication Step 1)
  fetchAllLists: async () => {
    const [userRes, sponsorRes, caretakerRes, patientRes, doctorRes] = await Promise.all([
      apiClient.get("/user_view/"),
      apiClient.get("/sponsorprofile_list/"),
      apiClient.get("/caretakerprofile_list/"),
      apiClient.get("/patientprofile_list/"),
      apiClient.get("/doctorprofile_list/"),
    ]);

    return {
      allUsers: userRes.data || [],
      sponsors: sponsorRes.data || [],
      caretakers: caretakerRes.data || [],
      patients: patientRes.data || [],
      doctors: doctorRes.data || [],
    };
  },

  updateUserStatus: async (userId, newStatus) => {
    const updateData = { updateid: userId, is_active_state: newStatus };
    const formdata = new FormData();
    formdata.append("user_update_data", JSON.stringify(updateData));
    const response = await apiClient.patch("/user_update/", formdata);
    return response.data;
  },

  createUser: async (formData) => {
    const response = await apiClient.post("/user_create/", formData);
    return response.data;
  },

  updateUser: async (formData) => {
    const response = await apiClient.patch("/user_update/", formData);
    return response.data;
  },

  createOrUpdatePatientProfile: async (formData) => {
    const response = await apiClient.post("/patientprofile_create_update/", formData);
    return response.data;
  },

  updateDoctorProfile: async (formData) => {
    const response = await apiClient.patch("/doctorprofile_update/", formData);
    return response.data;
  },

  updatePatientProfile: async (formData) => {
    const response = await apiClient.patch("/patientprofile_update/", formData);
    return response.data;
  },

  updateCaretakerProfile: async (formData) => {
    const response = await apiClient.patch("/caretakerprofile_update/", formData);
    return response.data;
  },

  updateSponsorProfile: async (formData) => {
    const response = await apiClient.patch("/sponsorprofile_update/", formData);
    return response.data;
  },
};
