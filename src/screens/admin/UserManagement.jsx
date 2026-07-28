/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userManagementService } from "../../services/userManagementService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import {
  Tabs,
  Table,
  Input,
  Button,
  Tag,
  Space,
  Drawer,
  Avatar,
  Form,
  Upload,
  Spin,
  notification,
  message,
  Tooltip,
  Radio,
  Popconfirm,
} from "antd";
import {
  EllipsisOutlined,
  PlusOutlined,
  UploadOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiClient";
import Primarybtn from "../../components/common/PrimaryBtn";
import { Select, AutoComplete } from "antd";
import bloodPressure from "../../assets/icons/blood-pressure.svg";
import heartRate from "../../assets/icons/heart-rate.svg";
import oxygen from "../../assets/icons/oxygen.svg";
import respiratory from "../../assets/icons/respiratory.svg";
import statusIcon from "../../assets/icons/status.svg";
import sugar from "../../assets/icons/sugar.svg";
import weight from "../../assets/icons/weight.svg";
import temperature from "../../assets/icons/temperature.png";
import { base_url } from "../../constants/constants";

const linkedPatients = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    name: "Mr. Samuel N. (VM–976–324)",
    doctor: "Dr. Paul M.",
    caretaker: "Nurse Clarisse A.",
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Ms. Grace N. (VM–845–123)",
    doctor: "Dr. Linda S.",
    caretaker: "Nurse Alex P.",
  },
];
const NOT_KNOWN_OPTIONS = [
  {
    label: "Not Known at time of enrolment",
    value: "Not Known at time of enrolment",
  },
];
const BLOOD_GROUP_OPTIONS = [
  { label: "A+", value: "A+" },
  { label: "A−", value: "A−" },
  { label: "B+", value: "B+" },
  { label: "B−", value: "B−" },
  { label: "AB+", value: "AB+" },
  { label: "AB−", value: "AB−" },
  { label: "O+", value: "O+" },
  { label: "O−", value: "O−" },
  {
    label: "Not Known at time of enrolment",
    value: "Not Known at time of enrolment",
  },
];
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];
const YES_NO_NOT_KNOWN_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  {
    label: "Not Known at time of enrolment",
    value: "Not Known at time of enrolment",
  },
];

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("sponsors");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editedData, setEditedData] = useState({});
  // uploadedImage: preview URL shown in avatar
  const [uploadedImage, setUploadedImage] = useState(null);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");

  const {
    data: listsData,
    isLoading: queryLoading,
    refetch: fetchAllUsersData,
  } = useQuery({
    queryKey: ["userManagementLists", token],
    queryFn: () => userManagementService.fetchAllLists(),
    enabled: !!token,
  });

  const allusers = listsData?.allUsers || [];
  const sponsorsData = listsData?.sponsors || [];
  const caretakersData = listsData?.caretakers || [];
  const patientsData = listsData?.patients || [];
  const doctorsData = listsData?.doctors || [];

  const sponsorList = useMemo(() => {
    const sponsorUserIds = sponsorsData.map((s) => s.user?.id);
    const filteredAllusers = allusers.filter(
      (u) =>
        u.user_role === "sponsor" ||
        u.role === "sponsor" ||
        sponsorUserIds.includes(u.id),
    );
    return filteredAllusers.map((user) => ({
      ...user,
      sponsorProfile: sponsorsData.find((s) => s?.user?.id === user.id) || {},
    }));
  }, [allusers, sponsorsData]);

  const caretakerList = useMemo(() => {
    const caretakersUserIds = caretakersData.map((c) => c.user?.id);
    const filteredAllusers = allusers.filter(
      (u) =>
        u.user_role === "care_taker" ||
        u.role === "care_taker" ||
        caretakersUserIds.includes(u.id),
    );
    return filteredAllusers.map((user) => ({
      ...user,
      caretakerProfile:
        caretakersData.find((c) => c.user?.id === user.id) || {},
    }));
  }, [allusers, caretakersData]);

  const patientList = useMemo(() => {
    return patientsData.map((p) => {
      const userObj = allusers.find((u) => u.id === p.user?.id) || {};
      return {
        ...userObj,
        ...p,
        id: p.id,
        user_id: userObj.id || p.user?.id,
        first_name: p.patient_name
          ? p.patient_name.split(" ")[0]
          : userObj.first_name || "Patient",
        last_name: p.patient_name
          ? p.patient_name.split(" ").slice(1).join(" ")
          : userObj.last_name || "",
        email: p.email || userObj.email || "",
        phone: p.phone || userObj.phone || "",
        patientProfile: p,
      };
    });
  }, [allusers, patientsData]);

  const docList = useMemo(() => {
    const doctorUserIds = doctorsData.map((d) => d.user?.id);
    const filteredAllusers = allusers.filter(
      (u) =>
        u.user_role === "doctor" ||
        u.role === "doctor" ||
        doctorUserIds.includes(u.id),
    );
    return filteredAllusers.map((user) => ({
      ...user,
      doctorProfile: doctorsData.find((d) => d.user?.id === user.id) || {},
    }));
  }, [allusers, doctorsData]);

  const loading = queryLoading;

  const trimPhoneNumber = (phone) => {
    if (phone === undefined || phone === null) return "";
    let formatted = String(phone).trim();
    while (/^\+\d+-/.test(formatted)) {
      formatted = formatted.replace(/^\+\d+-/, "");
    }
    return formatted.replace(/\D/g, "");
  };

  // ─── Image change handler ───────────────────────────────────────────────────
  // Stores both a preview URL (uploadedImage) and the raw File (editedData.photo)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (event) => setUploadedImage(event.target.result);
    reader.readAsDataURL(file);

    // Raw file stored in editedData so handleUpdateClick can append it
    setEditedData((prev) => ({ ...prev, photo: file }));
  };

  // ─── Fetch helpers (Optimized via TanStack Query) ──────────────────────────

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleSubmit = async (values, activeTab) => {
    try {
      if (activeTab === "patients") {
        // In VeriMed architecture, patients don't have a standalone 'patient' login role.
        // They are created under role 'sponsor' and linked with a patient profile.
        const generatedUsername =
          values.username ||
          `${values.first_name.toLowerCase().replace(/\s+/g, "")}_${values.last_name.toLowerCase().replace(/\s+/g, "")}`;
        const user_signup = {
          first_name: values.first_name,
          last_name: values.last_name,
          username: generatedUsername,
          role: "sponsor",
          email: values.email,
          countrycode: values.countrycode || "CM",
          phone: trimPhoneNumber(values.phone),
          password: values.password,
          is_active_state: true,
        };
        const formData = new FormData();
        formData.append("user_signup", JSON.stringify(user_signup));
        if (values.photo) {
          formData.append("photo", values.photo);
        }
        await apiClient.post("/user_create/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Step 2: Create the patient profile in the backend
        const patientprofile_data = {
          sponsorid: values.sponsorid ? Number(values.sponsorid) : null,
          caretakerid: null,
          patient_name: `${values.first_name} ${values.last_name}`.trim(),
          country_code: values.countrycode || "CM",
          phone: trimPhoneNumber(values.phone),
          email: values.email || "",
        };
        const pFormData = new FormData();
        pFormData.append(
          "patientprofile_data",
          JSON.stringify(patientprofile_data),
        );
        pFormData.append("medication", "[]");
        if (values.photo) {
          pFormData.append("patient_photo", values.photo);
        }
        await apiClient.post("/patientprofile_create_update/", pFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        notification.success({
          message: "Patient account & profile created successfully!",
        });
        setAddDrawerVisible(false);
        fetchAllUsersData();
        return;
      }

      const roleMap = {
        sponsors: "sponsor",
        doctors: "doctor",
        caretakers: "care_taker",
      };
      const generatedUsername =
        values.username ||
        `${values.first_name.toLowerCase().replace(/\s+/g, "")}_${values.last_name.toLowerCase().replace(/\s+/g, "")}`;
      const user_signup = {
        first_name: values.first_name,
        last_name: values.last_name,
        username: generatedUsername,
        role: roleMap[activeTab],
        email: values.email,
        countrycode: values.countrycode || "CM",
        phone: trimPhoneNumber(values.phone),
        password: values.password,
        is_active_state: true,
      };
      const formData = new FormData();
      formData.append("user_signup", JSON.stringify(user_signup));
      if (values.photo) {
        formData.append("photo", values.photo);
      }
      await apiClient.post("/user_create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      notification.success({
        message: `${roleMap[activeTab]} created successfully!`,
      });
      setAddDrawerVisible(false);
      fetchAllUsersData();
    } catch (error) {
      console.error("Signup error:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.detail || "Something went wrong.",
      });
    } finally {
      // Completed create user request
    }
  };

  // ─── Update ─────────────────────────────────────────────────────────────────
  const handleUpdateClick = async () => {
    if (!editedData) return;

    try {
      let endpoint = "";
      let formData = new FormData();
      let keyName = "";
      let updateData = {};

      switch (activeTab) {
        case "sponsors":
          endpoint = "/user_update/";
          keyName = "user_update_data";
          updateData = {
            updateid: selectedSponsor?.id,
            first_name: editedData.first_name || "",
            last_name: editedData.last_name || "",
            phone: trimPhoneNumber(editedData.phone) || "",
            countrycode: editedData.country_code,
            is_active_state: true,
          };
          break;

        case "doctors":
          endpoint = "/doctorprofile_update/";
          keyName = "doctorprofile_update_data";
          updateData = {
            doc_profile_updateid: selectedDoctor?.doctorProfile?.id || "",
            dep: editedData.dep || 2,
            doc_address: editedData.doc_address || "",
            doc_exprience: editedData.doc_exprience || "",
            doc_gender: editedData.doc_gender || "",
            speciality: editedData.speciality || "",
            doc_country_code: editedData.doc_country_code || "CM",
            doc_phone: trimPhoneNumber(editedData.doc_phone) || "",
            joining_date: editedData.joining_date || "",
            doc_licence_no: editedData.doc_licence_no || "",
            doc_city: editedData.doc_city || "",
            doc_state: editedData.doc_state || "",
            doc_country: editedData.doc_country || "",
            doc_pincode: editedData.doc_pincode || "",
          };
          break;

        case "patients": {
          endpoint = "/patientprofile_create_update/";
          keyName = "patientprofile_data";
          const formattedDOB =
            editedData.patient_dob && !isNaN(Date.parse(editedData.patient_dob))
              ? new Date(editedData.patient_dob).toISOString().split("T")[0]
              : "";
          updateData = {
            id: selectedPatient?.patientProfile?.id,
            patient_profile_updateid: selectedPatient?.patientProfile?.id,
            updateid: selectedPatient?.patientProfile?.id,
            patientprofileid: selectedPatient?.patientProfile?.id,
            reason_enrollment:
              selectedPatient?.patientProfile?.reason_enrollment ||
              editedData.reason_enrollment ||
              "Patient",
            reason:
              selectedPatient?.patientProfile?.reason_enrollment ||
              editedData.reason_enrollment ||
              "Patient",
            sponsorid: editedData.sponsorid || "",
            doctorid: editedData.doctorid || "",
            caretakerid: editedData.caretakerid || "",
            patient_dob: formattedDOB,
            patient_gender: editedData.patient_gender || "",
            blood_group: editedData.blood_group || "",
            height: editedData.height || "",
            weight: editedData.weight || "",
            blood_pressure: editedData.blood_pressure || editedData.bp || "",
            blood_sugar: editedData.blood_sugar || editedData.sugar || "",
            heart_rate: editedData.heart_rate || editedData.heartRate || "",
            oxygen: editedData.oxygen || "",
            temperature: editedData.temperature || "",
            respiratory_rate:
              editedData.respiratory_rate || editedData.respiratoryRate || "",
            patient_home_address: editedData.patient_home_address || "",
            primary_language: editedData.primary_language || "",
            religion: editedData.religion || "",
            escalate_to_physician: editedData.escalate_to_physician || "",
            emer_con_name: editedData.emer_con_name || "",
            emer_con_relation: editedData.emer_con_relation || "",
            emer_con_coun_of_residen: editedData.emer_con_coun_of_residen || "",
            emer_con_country_code: editedData.emer_con_country_code || "",
            emer_con_phone: editedData.emer_con_phone || "",
            emer_con_email: editedData.emer_con_email || "",
            local_con_name: editedData.local_con_name || "",
            local_con_relation: editedData.local_con_relation || "",
            local_con_country_code: editedData.local_con_country_code || "",
            local_con_phone: editedData.local_con_phone || "",
            reason_other: editedData.reason_other || "",
            medical_his_diagnosis: editedData.medical_his_diagnosis || "",
            medical_his_cancer: editedData.medical_his_cancer || "",
            medical_his_other: editedData.medical_his_other || "",
            medical_his_provided_medi_care:
              editedData.medical_his_provided_medi_care || "",
            medical_his_major_surgeries:
              editedData.medical_his_major_surgeries || "",
            medical_his_curr_symp: editedData.medical_his_curr_symp || "",
            last_doctor_visit: editedData.last_doctor_visit || null,
            has_regular_doctor: editedData.has_regular_doctor || "",
            regular_doctor_name: editedData.regular_doctor_name || "",
            medication_name: editedData.medication_name || "",
            medication_dose: editedData.medication_dose || "",
            medication_frequency: editedData.medication_frequency || "",
            medication_reason: editedData.medication_reason || "",
            medication_issues: editedData.medication_issues || false,
            medication_issues_explain:
              editedData.medication_issues_explain || "",
            allergies_issues: editedData.allergies_issues || false,
            allergies_drug: editedData.allergies_drug || "",
            allergies_food: editedData.allergies_food || "",
            functional_bathe: editedData.functional_bathe || "",
            functional_dress: editedData.functional_dress || "",
            functional_eat: editedData.functional_eat || "",
            functional_walk: editedData.functional_walk || "",
            functional_use_bathroom: editedData.functional_use_bathroom || "",
            functional_daily_activity:
              editedData.functional_daily_activity || "",
            functional_manage_finance:
              editedData.functional_manage_finance || "",
            functional_any_falls: editedData.functional_any_falls || false,
            functional_how_many: editedData.functional_how_many || "",
            functional_memory_pbms: editedData.functional_memory_pbms || false,
            lifestyle_daily_routine: editedData.lifestyle_daily_routine || "",
            lifestyle_dietary_habits: editedData.lifestyle_dietary_habits || "",
            lifestyle_sleep_quality: editedData.lifestyle_sleep_quality || "",
            lifestyle_physical_activity:
              editedData.lifestyle_physical_activity || "",
            lifestyle_alcohol_use: editedData.lifestyle_alcohol_use || "",
            lifestyle_pain_complaints:
              editedData.lifestyle_pain_complaints || "",
            lifestyle_pain_where: editedData.lifestyle_pain_where || "",
            social_emotion_health: editedData.social_emotion_health || "",
            social_spiritual_needs: editedData.social_spiritual_needs || "",
            social_trusted_person: editedData.social_trusted_person || false,
            social_name: editedData.social_name || "",
            goals_family_hope: editedData.goals_family_hope || "",
            goals_special_instructions:
              editedData.goals_special_instructions || "",
            goals_term_membership: editedData.goals_term_membership || "",
          };

          formData.append(keyName, JSON.stringify(updateData));
          if (editedData.patient_upload_files?.length > 0) {
            editedData.patient_upload_files.forEach((file) => {
              formData.append("patient_upload_files", file);
            });
          }
          formData.append(
            "patient_files_ids",
            Array.isArray(editedData.patient_files_ids)
              ? JSON.stringify(editedData.patient_files_ids)
              : editedData.patient_files_ids
                ? JSON.stringify([editedData.patient_files_ids])
                : "[]",
          );
          formData.append(
            "patient_files_name",
            editedData.patient_files_name || "",
          );
          break;
        }

        case "caretakers":
          endpoint = "/caretakerprofile_update/";
          keyName = "caretakerprofile_update_data";
          updateData = {
            caretaker_profile_updateid:
              selectedCaretaker?.caretakerProfile?.id || "",
            caretaker_address: editedData.address || "",
            caretaker_exprience: editedData.experience || 0,
            care_gender: editedData.gender || "",
            credentials: editedData.credentials || "",
            yr_of_graduation: editedData.yr_graduation || "",
            skillset: editedData.skillset || "",
          };
          break;

        default:
          console.warn("⚠️ Unknown user type:", activeTab);
          return;
      }

      formData.append(keyName, JSON.stringify(updateData));
      if (activeTab === "patients") {
        formData.append(
          "patientprofile_data",
          JSON.stringify(updateData),
        );
      }

      if (
        editedData.photo &&
        typeof editedData.photo === "object" &&
        editedData.photo.name
      ) {
        formData.append("photo", editedData.photo);
        console.log("📸 Photo being uploaded:", editedData.photo.name);
      }

      console.log("🚀 Sending PATCH to:", endpoint);
      console.log("📦 FormData content:", updateData);

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const res = await apiClient.patch(endpoint, formData, { headers });
      console.log("✅ Update Success:", res.data);

      notification.success({
        message: `${activeTab.slice(0, -1).toUpperCase()} PROFILE UPDATED`,
        description: `The ${activeTab.slice(0, -1)} profile was updated successfully.`,
        placement: "topRight",
      });

      fetchAllUsersData();

      setDrawerVisible(false);
      setUploadedImage(null);
    } catch (error) {
      console.error("Update failed:", error);
      notification.error({
        message: "UPDATE FAILED",
        description:
          error.response?.data?.detail ||
          `Unable to update ${activeTab.slice(0, -1)} profile.`,
        placement: "topRight",
      });
    } finally {
      // Completed update user request
    }
  };

  const handleStatusChange = async (newStatus) => {
    let userId = null;
    switch (activeTab) {
      case "sponsors":
        userId = selectedSponsor?.id;
        break;
      case "doctors":
        userId = selectedDoctor?.id;
        break;
      case "caretakers":
        userId = selectedCaretaker?.id;
        break;
      case "patients":
        userId = selectedPatient?.id;
        break;
      default:
        console.warn("⚠️ Unknown user type:", activeTab);
        return;
    }
    if (!userId) {
      notification.error({
        message: "ERROR",
        description: "Unable to identify user ID.",
        placement: "topRight",
      });
      return;
    }
    try {
      const endpoint = "/user_update/";
      const updateData = { updateid: userId, is_active_state: newStatus };
      const formdata = new FormData();
      formdata.append("user_update_data", JSON.stringify(updateData));
      console.log("🚀 Updating user status:", updateData);
      const response = await apiClient.patch(endpoint, formdata);
      const result = response.data;
      console.log("✅ Status Update Success:", result);
      setEditedData((prev) => ({ ...prev, is_active_state: newStatus }));
      notification.success({
        message: `ACCOUNT ${newStatus ? "ACTIVATED" : "DEACTIVATED"}`,
        description: `The account has been ${newStatus ? "activated" : "deactivated"} successfully.`,
        placement: "topRight",
      });
      fetchAllUsersData();
    } catch (error) {
      console.error("❌ Status update failed:", error);
      notification.error({
        message: "UPDATE FAILED",
        description:
          error.message ||
          `Unable to change status for ${activeTab.slice(0, -1)} account.`,
        placement: "topRight",
      });
    } finally {
      // Completed status change request
    }
  };

  const handleDeleteClick = async () => {
    let userId = null;
    switch (activeTab) {
      case "sponsors":
        userId = selectedSponsor?.id;
        break;
      case "doctors":
        userId = selectedDoctor?.id;
        break;
      case "caretakers":
        userId = selectedCaretaker?.id;
        break;
      case "patients":
        userId = selectedPatient?.id;
        break;
      default:
        return;
    }

    if (!userId) {
      notification.error({
        message: "DELETE FAILED",
        description: "Unable to identify user ID.",
        placement: "topRight",
      });
      return;
    }

    try {
      const payload = { deleteids: [userId] };
      await apiClient.delete("/user_delete/", {
        data: payload,
      });

      queryClient.setQueryData(["userManagementLists", token], (oldData) => {
        if (!oldData) return oldData;
        return {
          allUsers:
            oldData.allUsers?.filter((item) => item.id !== userId) || [],
          sponsors:
            oldData.sponsors?.filter(
              (item) => item.id !== userId && item.user?.id !== userId,
            ) || [],
          caretakers:
            oldData.caretakers?.filter(
              (item) => item.id !== userId && item.user?.id !== userId,
            ) || [],
          patients:
            oldData.patients?.filter(
              (item) => item.id !== userId && item.user?.id !== userId,
            ) || [],
          doctors:
            oldData.doctors?.filter(
              (item) => item.id !== userId && item.user?.id !== userId,
            ) || [],
        };
      });

      setDrawerVisible(false);
      fetchAllUsersData();
      notification.success({
        message: "ACCOUNT DELETED",
        description: `The ${activeTab.slice(0, -1)} account has been removed successfully.`,
        placement: "topRight",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      notification.error({
        message: "DELETE FAILED",
        description:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to delete account.",
        placement: "topRight",
      });
    }
  };

  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: "100/67 mmHg",
      color: "#27AE60",
    },
    { icon: heartRate, label: "Heart Rate", value: "89 bpm", color: "#EF1E1E" },
    { icon: sugar, label: "Sugar", value: "180", color: "#27AE60" },
    { icon: oxygen, label: "Oxygen", value: "96", color: "#27AE60" },
    {
      icon: temperature,
      label: "Temperature",
      value: "101 °C",
      color: "#27AE60",
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: "24 rpm",
      color: "#EF1E1E",
    },
    { icon: weight, label: "Weight", value: "100 kg", color: "#27AE60" },
    { icon: statusIcon, label: "Status", value: "Stable", color: "#27AE60" },
  ];

  const currentUserData = localStorage.getItem("userData");
  const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
  const currentUserRole = currentUser?.user_role || currentUser?.role || "";

  const handleEditClick = (record) => {
    // Reset preview whenever a new record is opened
    setUploadedImage(null);

    switch (activeTab) {
      case "sponsors":
        setSelectedSponsor(record);
        setEditedData({
          ...record,
          sponsor_address: record.sponsorProfile?.sponsor_address || "",
          sponsor_gender: record.sponsorProfile?.sponsor_gender || "",
          work_employment: record.sponsorProfile?.work_employment || "",
          how_found_us: record.sponsorProfile?.how_found_us || "",
          phone: trimPhoneNumber(
            record.phone || record.sponsorProfile?.phone || "",
          ),
          country_code: record.country_code || record.countrycode || "CM",
          photo: null, // will be set by handleImageChange if user picks a file
        });
        break;
      case "doctors":
        setSelectedDoctor(record);
        setEditedData({
          ...record,
          doc_profile_updateid: record.doctorProfile?.id || "",
          dep: record.doctorProfile?.dep || 2,
          doc_address: record.doctorProfile?.doc_address || "",
          doc_exprience: record.doctorProfile?.doc_exprience || "",
          doc_gender: record.doctorProfile?.doc_gender || record.gender || "",
          speciality: record.doctorProfile?.speciality || "",
          doc_country_code: record.doctorProfile?.doc_country_code || "CM",
          doc_phone: trimPhoneNumber(
            record.doctorProfile?.doc_phone || record.phone || "",
          ),
          joining_date: record.doctorProfile?.joining_date || "",
          doc_licence_no: record.doctorProfile?.doc_licence_no || "",
          doc_city: record.doctorProfile?.doc_city || "",
          doc_state: record.doctorProfile?.doc_state || "",
          doc_country: record.doctorProfile?.doc_country || "",
          doc_pincode: record.doctorProfile?.doc_pincode || "",
          photo: null,
        });
        break;
      case "caretakers":
        setSelectedCaretaker(record);
        setEditedData({
          ...record,
          name: record.name || "",
          address: record.caretakerProfile?.caretaker_address || "",
          gender: record.caretakerProfile?.care_gender || "",
          experience: record.caretakerProfile?.caretaker_exprience || "",
          yr_graduation: record.caretakerProfile?.yr_of_graduation || "",
          credentials: record.caretakerProfile?.credentials || "",
          skillset: record.caretakerProfile?.skillset || "",
          photo: null,
        });
        break;
      case "patients":
        setSelectedPatient(record);
        setEditedData({
          ...record,
          patient_profile_updateid: record.patientProfile?.id || "",
          sponsorid: record.patientProfile?.sponsorid || "",
          doctorid: record.patientProfile?.doctorid || "",
          caretakerid: record.patientProfile?.caretakerid || "",
          patient_dob: record.patientProfile?.patient_dob || "",
          patient_gender: record.patientProfile?.patient_gender || "",
          blood_group: record.patientProfile?.blood_group || "",
          patient_home_address:
            record.patientProfile?.patient_home_address || "",
          primary_language: record.patientProfile?.primary_language || "",
          religion: record.patientProfile?.religion || "",
          escalate_to_physician:
            record.patientProfile?.escalate_to_physician || "",
          emer_con_name: record.patientProfile?.emer_con_name || "",
          emer_con_relation: record.patientProfile?.emer_con_relation || "",
          emer_con_coun_of_residen:
            record.patientProfile?.emer_con_coun_of_residen || "",
          emer_con_country_code:
            record.patientProfile?.emer_con_country_code || "",
          emer_con_phone: record.patientProfile?.emer_con_phone || "",
          emer_con_email: record.patientProfile?.emer_con_email || "",
          local_con_name: record.patientProfile?.local_con_name || "",
          local_con_relation: record.patientProfile?.local_con_relation || "",
          local_con_country_code:
            record.patientProfile?.local_con_country_code || "",
          local_con_phone: record.patientProfile?.local_con_phone || "",
          reason_enrollment: record.patientProfile?.reason_enrollment || "",
          reason_other: record.patientProfile?.reason_other || "",
          medical_his_diagnosis:
            record.patientProfile?.medical_his_diagnosis || "",
          medical_his_cancer: record.patientProfile?.medical_his_cancer || "",
          medical_his_other: record.patientProfile?.medical_his_other || "",
          medical_his_provided_medi_care:
            record.patientProfile?.medical_his_provided_medi_care || "",
          medical_his_major_surgeries:
            record.patientProfile?.medical_his_major_surgeries || "",
          medical_his_curr_symp:
            record.patientProfile?.medical_his_curr_symp || "",
          last_doctor_visit: record.patientProfile?.last_doctor_visit || "",
          has_regular_doctor: record.patientProfile?.has_regular_doctor || "",
          regular_doctor_name: record.patientProfile?.regular_doctor_name || "",
          medication_name: record.patientProfile?.medication_name || "",
          medication_dose: record.patientProfile?.medication_dose || "",
          medication_frequency:
            record.patientProfile?.medication_frequency || "",
          medication_reason: record.patientProfile?.medication_reason || "",
          medication_issues: record.patientProfile?.medication_issues || false,
          medication_issues_explain:
            record.patientProfile?.medication_issues_explain || "",
          allergies_issues: record.patientProfile?.allergies_issues || false,
          allergies_drug: record.patientProfile?.allergies_drug || "",
          allergies_food: record.patientProfile?.allergies_food || "",
          functional_bathe: record.patientProfile?.functional_bathe || "",
          functional_dress: record.patientProfile?.functional_dress || "",
          functional_eat: record.patientProfile?.functional_eat || "",
          functional_walk: record.patientProfile?.functional_walk || "",
          functional_use_bathroom:
            record.patientProfile?.functional_use_bathroom || "",
          functional_daily_activity:
            record.patientProfile?.functional_daily_activity || "",
          functional_manage_finance:
            record.patientProfile?.functional_manage_finance || "",
          functional_any_falls:
            record.patientProfile?.functional_any_falls || false,
          functional_how_many: record.patientProfile?.functional_how_many || "",
          functional_memory_pbms:
            record.patientProfile?.functional_memory_pbms || false,
          lifestyle_daily_routine:
            record.patientProfile?.lifestyle_daily_routine || "",
          lifestyle_dietary_habits:
            record.patientProfile?.lifestyle_dietary_habits || "",
          lifestyle_sleep_quality:
            record.patientProfile?.lifestyle_sleep_quality || "",
          lifestyle_physical_activity:
            record.patientProfile?.lifestyle_physical_activity || "",
          lifestyle_alcohol_use:
            record.patientProfile?.lifestyle_alcohol_use || "",
          lifestyle_pain_complaints:
            record.patientProfile?.lifestyle_pain_complaints || "",
          lifestyle_pain_where:
            record.patientProfile?.lifestyle_pain_where || "",
          social_emotion_health:
            record.patientProfile?.social_emotion_health || "",
          social_spiritual_needs:
            record.patientProfile?.social_spiritual_needs || "",
          social_trusted_person:
            record.patientProfile?.social_trusted_person || false,
          social_name: record.patientProfile?.social_name || "",
          goals_family_hope: record.patientProfile?.goals_family_hope || "",
          goals_special_instructions:
            record.patientProfile?.goals_special_instructions || "",
          goals_term_membership:
            record.patientProfile?.goals_term_membership || "",
          patient_files_ids: record.patientProfile?.patient_files_ids || "",
          patient_files_name: record.patientProfile?.patient_files_name || "",
          patient_upload_files: [],
          photo: null,
        });
        break;
      default:
        break;
    }
    setDrawerVisible(true);
  };

  // ─── Reusable avatar uploader ───────────────────────────────────────────────
  const AvatarUploader = ({ currentSrc, inputId }) => (
    <div className="flex items-center gap-[16px] mb-[8px]">
      <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
        Profile Photo
      </p>

      <div className="relative w-[72px] h-[72px]">
        <Avatar
          size={72}
          src={uploadedImage || currentSrc}
          className="rounded-full object-cover"
        />

        {/* Camera overlay button */}
        <Tooltip title="Change photo">
          <label
            htmlFor={inputId}
            className="absolute bottom-0 right-0 bg-[linear-gradient(180deg,#F0C330,#B78520)] rounded-full w-[24px] h-[24px] flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
          >
            <CameraOutlined className="text-[#fff] text-[12px]" />
          </label>
        </Tooltip>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {uploadedImage && (
        <span className="text-[12px] text-[#27AE60]">
          ✓ New photo selected — save to apply
        </span>
      )}
    </div>
  );

  const columns = [
    { title: "User Name", dataIndex: "username", key: "username" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <img
            src={record.avatar}
            alt={text}
            className="w-[32px] h-[32px] rounded-full object-cover"
          />
          {text}
        </Space>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Patients Linked",
      dataIndex: "patientsLinked",
      key: "patientsLinked",
    },
    { title: "Membership", dataIndex: "membership", key: "membership" },
    {
      title: "Status",
      dataIndex: "is_active_state",
      key: "is_active_state",
      render: (status) => (
        <Tag color={status === true ? "green" : "red"}>
          {status === true ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <EllipsisOutlined
          className="text-[18px] cursor-pointer"
          onClick={() => handleEditClick(record)}
        />
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const dataMap = {
      sponsors: sponsorList.map((s) => ({
        ...s,
        key: s?.id || Math.random(),
        username:
          s?.username ||
          (s?.first_name && s?.last_name
            ? `${s.first_name.toLowerCase()}_${s.last_name.toLowerCase()}`
            : "N/A"),
        avatar: s?.photo_view_url || s?.photo,
        name: (s?.first_name || "") + " " + (s?.last_name || ""),
        email: s?.email,
        phone: trimPhoneNumber(s?.phone),
        country: s?.country_code || s?.country,
        patientsLinked: s.sponsorProfile?.patients_count || 0,
        membership: s.sponsorProfile?.membership_plan || "N/A",
        status: s.is_active ? "Active" : "Inactive",
      })),
      doctors: docList.map((d) => ({
        ...d,
        key: d?.id || Math.random(),
        username:
          d?.username ||
          d?.user?.username ||
          (d?.first_name && d?.last_name
            ? `${d.first_name.toLowerCase()}_${d.last_name.toLowerCase()}`
            : d?.email?.split("@")[0] || "N/A"),
        avatar: d?.photo_view_url || d?.photo,
        name: (d?.first_name || "") + " " + (d?.last_name || ""),
        email: d?.email,
        phone: trimPhoneNumber(d?.phone),
        country: d?.country_code || d?.country,
        patientsLinked: d.doctorProfile?.patients_count || 0,
        membership: d.doctorProfile?.membership_plan || "N/A",
        status: d.is_active ? "Active" : "Inactive",
      })),
      caretakers: caretakerList.map((c) => ({
        ...c,
        key: c?.id || Math.random(),
        username:
          c?.username ||
          c?.user?.username ||
          (c?.first_name && c?.last_name
            ? `${c.first_name.toLowerCase()}_${c.last_name.toLowerCase()}`
            : c?.email?.split("@")[0] || "N/A"),
        avatar: c?.photo_view_url || c?.photo,
        name: (c?.first_name || "") + " " + (c?.last_name || ""),
        email: c?.email,
        phone: trimPhoneNumber(c?.phone),
        country: c?.country_code || c?.country,
        patientsLinked: c.caretakerProfile?.patients_count || 0,
        membership: c.caretakerProfile?.membership_plan || "N/A",
        status: c.is_active ? "Active" : "Inactive",
      })),
      patients: patientList.map((p) => ({
        ...p,
        key: p?.id || Math.random(),
        username:
          p?.username ||
          p?.user?.username ||
          p?.patientProfile?.user?.username ||
          (p?.first_name && p?.last_name
            ? `${p.first_name.toLowerCase()}_${p.last_name.toLowerCase()}`
            : p?.email?.split("@")[0] || `patient_${p?.id || "N/A"}`),
        avatar: p?.photo_view_url || p?.photo,
        name: (p?.first_name || "") + " " + (p?.last_name || ""),
        email: p?.email,
        phone: trimPhoneNumber(p?.phone),
        country: p?.country_code || p?.country,
        patientsLinked: 0,
        membership: p.patientProfile?.membership_plan || "N/A",
        status: p.is_active !== false ? "Active" : "Inactive",
        age: p.patientProfile?.age || p?.age || "N/A",
        gender: p.patientProfile?.patient_gender || p?.gender || "N/A",
        Condition:
          p.patientProfile?.medical_condition ||
          p.patientProfile?.medical_his_diagnosis ||
          "N/A",
        CareTaker: "N/A",
        Doctor: "N/A",
        EnrolmentDate: "N/A",
      })),
    };
    const data = dataMap[activeTab] || [];
    return data.filter(
      (d) => d.name && d.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [sponsorList, docList, caretakerList, patientList, activeTab, searchText]);

  const drawerTitleMap = {
    sponsors: "Sponsor Detailed View",
    doctors: "Doctor Detailed View",
    caretakers: "Caretaker Detailed View",
    patients: "Patient Detailed View",
  };

  const UserForm = ({ onFinish, activeTab }) => {
    const [form] = Form.useForm();
    const normFile = (e) => (Array.isArray(e) ? e : e && e.file.originFileObj);
    return (
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ countrycode: "CM" }}
      >
        {activeTab === "patients" && (
          <Form.Item
            name="sponsorid"
            label="Select Sponsor"
            rules={[
              {
                required: true,
                message: "Please select a sponsor for this patient",
              },
            ]}
          >
            <Select
              placeholder="Select sponsor"
              showSearch
              optionFilterProp="children"
            >
              {sponsorList?.map((s) => (
                <Select.Option
                  key={s.sponsorProfile?.id || s.id}
                  value={s.sponsorProfile?.id || s.id}
                >
                  {s.first_name} {s.last_name} ({s.email}) — ID:{" "}
                  {s.sponsorProfile?.id || s.id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: "Please enter last name" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="countrycode"
          label="Country Code"
          rules={[{ required: true, message: "Please select country code" }]}
        >
          <Select>
            <Select.Option value="IN">+91 (India)</Select.Option>
            <Select.Option value="US">+1 (USA)</Select.Option>
            <Select.Option value="GB">+44 (UK)</Select.Option>
            <Select.Option value="CA">+1 (Canada)</Select.Option>
            <Select.Option value="CM">+237 (Cameroon)</Select.Option>
            <Select.Option value="AU">+61 (Australia)</Select.Option>
            <Select.Option value="AE">+971 (UAE)</Select.Option>
            <Select.Option value="SG">+65 (Singapore)</Select.Option>
            <Select.Option value="MY">+60 (Malaysia)</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="photo"
          label="Upload Photo"
          valuePropName="file"
          getValueFromEvent={normFile}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create User
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const renderDrawerContent = () => {
    if (activeTab === "sponsors" && selectedSponsor)
      return (
        <div className="flex flex-col gap-[24px]">
          {/* ── Profile photo uploader ── */}
          <AvatarUploader
            currentSrc={selectedSponsor.avatar}
            inputId="sponsor-photo-upload"
          />

          {/* ── Fields ── */}
          <div className="flex-1 grid grid-cols-[1fr_1fr] gap-[16px]">
            <div>
              <label className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                First Name
              </label>
              <Input
                value={editedData.first_name}
                onChange={(e) =>
                  setEditedData({ ...editedData, first_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Last Name
              </label>
              <Input
                value={editedData.last_name}
                onChange={(e) =>
                  setEditedData({ ...editedData, last_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Country Code
              </label>
              <Select
                value={editedData.country_code || "CM"}
                onChange={(val) =>
                  setEditedData({ ...editedData, country_code: val })
                }
                className="w-full"
              >
                <Select.Option value="IN">+91 (India)</Select.Option>
                <Select.Option value="US">+1 (USA)</Select.Option>
                <Select.Option value="GB">+44 (UK)</Select.Option>
                <Select.Option value="CA">+1 (Canada)</Select.Option>
                <Select.Option value="CM">+237 (Cameroon)</Select.Option>
                <Select.Option value="AU">+61 (Australia)</Select.Option>
                <Select.Option value="AE">+971 (UAE)</Select.Option>
                <Select.Option value="SG">+65 (Singapore)</Select.Option>
                <Select.Option value="MY">+60 (Malaysia)</Select.Option>
              </Select>
            </div>
            <div>
              <label className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Phone Number
              </label>
              <Input
                value={editedData.phone}
                onChange={(e) =>
                  setEditedData({ ...editedData, phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      );

    if (activeTab === "doctors" && selectedDoctor)
      return (
        <div className="flex flex-col gap-[16px]">
          {/* ── Profile photo uploader ── */}
          <AvatarUploader
            currentSrc={selectedDoctor.photo}
            inputId="doctor-photo-upload"
          />

          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Doctor Name
          </p>
          <Input
            value={editedData.name}
            onChange={(e) =>
              setEditedData({ ...editedData, name: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Speciality
          </p>
          <Input
            value={editedData.speciality}
            onChange={(e) =>
              setEditedData({ ...editedData, speciality: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Country Code
          </p>
          <Select
            value={editedData.doc_country_code || "CM"}
            onChange={(val) =>
              setEditedData({ ...editedData, doc_country_code: val })
            }
            className="w-full"
          >
            <Select.Option value="IN">+91 (India)</Select.Option>
            <Select.Option value="US">+1 (USA)</Select.Option>
            <Select.Option value="GB">+44 (UK)</Select.Option>
            <Select.Option value="CA">+1 (Canada)</Select.Option>
            <Select.Option value="CM">+237 (Cameroon)</Select.Option>
            <Select.Option value="AU">+61 (Australia)</Select.Option>
            <Select.Option value="AE">+971 (UAE)</Select.Option>
            <Select.Option value="SG">+65 (Singapore)</Select.Option>
            <Select.Option value="MY">+60 (Malaysia)</Select.Option>
          </Select>
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Phone
          </p>
          <Input
            value={editedData.doc_phone}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_phone: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Address
          </p>
          <Input
            value={editedData.doc_address}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_address: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Gender
          </p>
          <Select
            value={editedData.doc_gender}
            onChange={(value) =>
              setEditedData({ ...editedData, doc_gender: value })
            }
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Experience (Years)
          </p>
          <Input
            type="number"
            value={editedData.doc_exprience}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_exprience: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            License No
          </p>
          <Input
            value={editedData.doc_licence_no}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_licence_no: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            City
          </p>
          <Input
            value={editedData.doc_city}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_city: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            State
          </p>
          <Input
            value={editedData.doc_state}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_state: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Country
          </p>
          <Input
            value={editedData.doc_country}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_country: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Pincode
          </p>
          <Input
            value={editedData.doc_pincode}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_pincode: e.target.value })
            }
          />
          <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
            Joining Date
          </p>
          <Input
            type="date"
            value={editedData.joining_date}
            onChange={(e) =>
              setEditedData({ ...editedData, joining_date: e.target.value })
            }
          />
        </div>
      );

    if (activeTab === "caretakers" && selectedCaretaker)
      return (
        <div className="flex flex-col gap-[16px]">
          {/* ── Profile photo uploader ── */}
          <AvatarUploader
            currentSrc={selectedCaretaker.photo}
            inputId="caretaker-photo-upload"
          />

          <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Caretaker Name
              </p>
              <Input
                value={editedData.name}
                onChange={(e) =>
                  setEditedData({ ...editedData, name: e.target.value })
                }
              />
            </div>

            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Caretaker Address
              </p>
              <Input
                rows={2}
                value={editedData.address}
                onChange={(e) =>
                  setEditedData({ ...editedData, address: e.target.value })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Caretaker Gender
              </p>
              <Select
                value={editedData.gender}
                className="w-full"
                onChange={(value) =>
                  setEditedData({ ...editedData, gender: value })
                }
              >
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Experience (in years)
              </p>
              <Input
                type="number"
                min={0}
                value={editedData.experience}
                onChange={(e) =>
                  setEditedData({ ...editedData, experience: e.target.value })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Year of Graduation
              </p>
              <Input
                value={editedData.yr_graduation}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    yr_graduation: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Credentials
              </p>
              <Input.TextArea
                rows={2}
                value={editedData.credentials}
                onChange={(e) =>
                  setEditedData({ ...editedData, credentials: e.target.value })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Skillset
              </p>
              <Input.TextArea
                rows={3}
                value={editedData.skillset}
                onChange={(e) =>
                  setEditedData({ ...editedData, skillset: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      );

    if (activeTab === "patients" && selectedPatient)
      return (
        <div className="flex flex-col gap-[16px]">
          <AvatarUploader
            currentSrc={selectedPatient.photo}
            inputId="patient-photo-upload"
          />
          <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Sponsor ID
              </p>
              <Input
                value={editedData.sponsorid || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, sponsorid: e.target.value })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                DOB
              </p>
              <Input
                type="date"
                value={
                  editedData.patient_dob &&
                  !isNaN(Date.parse(editedData.patient_dob))
                    ? new Date(editedData.patient_dob)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditedData({ ...editedData, patient_dob: e.target.value })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Gender
              </p>
              <Select
                value={editedData.patient_gender}
                onChange={(val) =>
                  setEditedData({ ...editedData, patient_gender: val })
                }
                options={GENDER_OPTIONS}
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Blood Group
              </p>
              <Select
                className="w-full"
                value={editedData.blood_group || undefined}
                placeholder="Select Blood Group"
                onChange={(val) =>
                  setEditedData({ ...editedData, blood_group: val })
                }
                options={BLOOD_GROUP_OPTIONS}
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Height
              </p>
              <AutoComplete
                className="w-full"
                value={editedData.height || undefined}
                placeholder="e.g. 175 cm or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, height: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Weight
              </p>
              <AutoComplete
                className="w-full"
                value={editedData.weight || undefined}
                placeholder="e.g. 70 kg or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, weight: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Blood Pressure
              </p>
              <AutoComplete
                className="w-full"
                value={editedData.blood_pressure || editedData.bp || undefined}
                placeholder="Enter Blood Pressure or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, blood_pressure: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Heart Rate
              </p>
              <AutoComplete
                className="w-full"
                value={
                  editedData.heart_rate || editedData.heartRate || undefined
                }
                placeholder="Enter Heart Rate or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, heart_rate: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Blood Sugar
              </p>
              <AutoComplete
                className="w-full"
                value={editedData.blood_sugar || editedData.sugar || undefined}
                placeholder="Enter Blood Sugar or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, blood_sugar: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Oxygen
              </p>
              <AutoComplete
                className="w-full"
                value={editedData.oxygen || undefined}
                placeholder="Enter Oxygen or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, oxygen: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Temperature
              </p>
              <AutoComplete
                className="w-full"
                value={editedData.temperature || undefined}
                placeholder="Enter Temperature or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, temperature: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Respiratory Rate
              </p>
              <AutoComplete
                className="w-full"
                value={
                  editedData.respiratory_rate ||
                  editedData.respiratoryRate ||
                  undefined
                }
                placeholder="Enter Respiratory Rate or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, respiratory_rate: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Home Address
              </p>
              <Input
                value={editedData.patient_home_address || ""}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    patient_home_address: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Diagnosis
              </p>
              <Input
                value={editedData.medical_his_diagnosis || ""}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_diagnosis: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Cancer History
              </p>
              <Select
                className="w-full"
                value={editedData.medical_his_cancer || undefined}
                placeholder="Select cancer history"
                onChange={(val) =>
                  setEditedData({ ...editedData, medical_his_cancer: val })
                }
                options={YES_NO_NOT_KNOWN_OPTIONS}
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Current Symptoms
              </p>
              <Input
                value={editedData.medical_his_curr_symp || ""}
                placeholder="Enter current symptoms"
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_curr_symp: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Last Doctor / Hospital Visit
              </p>
              <AutoComplete
                className="w-full"
                value={editedData.last_doctor_visit || undefined}
                placeholder="e.g. 2 months ago, June 2024, or select Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, last_doctor_visit: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Do you have a doctor you see regularly?
              </p>
              <Select
                className="w-full"
                value={editedData.has_regular_doctor || undefined}
                placeholder="Select Yes, No, or Not Known"
                onChange={(val) =>
                  setEditedData({ ...editedData, has_regular_doctor: val })
                }
                options={YES_NO_NOT_KNOWN_OPTIONS}
              />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                Regular Doctor's Name & Contact Info
              </p>
              <AutoComplete
                className="w-full"
                value={editedData.regular_doctor_name || undefined}
                placeholder="Enter doctor's name, clinic, or contact details"
                onChange={(val) =>
                  setEditedData({ ...editedData, regular_doctor_name: val })
                }
                options={NOT_KNOWN_OPTIONS}
                allowClear
              />
            </div>
          </div>
        </div>
      );

    return null;
  };

  const tabItems = [
    { key: "sponsors", label: "Sponsors" },
    ...(currentUserRole === "care_taker"
      ? []
      : [{ key: "doctors", label: "Doctors" }]),
    { key: "caretakers", label: "Caretakers" },
    { key: "patients", label: "Patients" },
  ];

  useEffect(() => {
    if (currentUserRole === "care_taker" && activeTab === "doctors") {
      setActiveTab("sponsors");
    }
  }, [currentUserRole, activeTab]);

  const adminStats = [
    {
      id: 1,
      name: "Total Sponsors",
      count: 88,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 2,
      name: "Total Doctors",
      count: 58,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 3,
      name: "Care Takers",
      count: 20,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 4,
      name: "Patients",
      count: 24,
      diff: "+25%",
      duration: "in last 7 Days",
    },
    {
      id: 5,
      name: "Active Memberships",
      count: 6,
      diff: "+15%",
      duration: "in last 7 Days",
    },
  ];

  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(255,255,255,0.7)] z-[9999] flex items-center justify-center">
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        <div className="p-[20px] overflow-y-auto gap-[20px] flex flex-col items-center overflow-x-hidden">
          {/* Stats cards */}
          <div className="flex items-center justify-between gap-[12px] w-full">
            {adminStats.map((stat) => (
              <div
                key={stat.id}
                className="min-w-[160px] flex-none bg-white rounded-[8px] p-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between"
              >
                <div className="flex items-center justify-start gap-[10px]">
                  <div className="h-[30px] w-[30px] rounded-[100px] flex items-center justify-center bg-[#007F5F33]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_484_11034)">
                        <path
                          d="M11.5 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V11"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 3V7"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 3V7"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 11H20"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.0001 22.0001L21.3501 18.7161C21.5556 18.5168 21.719 18.2783 21.8307 18.0147C21.9425 17.7512 22.0003 17.4679 22.0007 17.1817C22.0012 16.8954 21.9443 16.612 21.8334 16.3481C21.7225 16.0841 21.5599 15.8451 21.3551 15.6451C20.9373 15.2365 20.3763 15.0071 19.7918 15.006C19.2074 15.0049 18.6455 15.2321 18.2261 15.6391L18.0021 15.8591L17.7791 15.6391C17.3613 15.2307 16.8006 15.0016 16.2163 15.0005C15.6321 14.9994 15.0705 15.2264 14.6511 15.6331C14.4456 15.8324 14.2821 16.0708 14.1703 16.3343C14.0585 16.5978 14.0006 16.8811 14 17.1673C13.9994 17.4536 14.0562 17.7371 14.167 18.001C14.2778 18.265 14.4404 18.504 14.6451 18.7041L18.0001 22.0001Z"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_484_11034">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-[#6C7688] text-[14px] font-medium">
                    {stat.name}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[#2E2E2E] text-[18px] font-extrabold">
                    {stat.count}
                  </p>
                  <div className="flex flex-col items-end justify-center w-full">
                    <div className="bg-[#27AE60] h-[20px] w-[49px] flex items-center justify-center rounded-[6px]">
                      <p className="text-[white] text-[12px] font-medium">
                        {stat.diff}
                      </p>
                    </div>
                    <p className="text-[#6C7688] text-[13px]">
                      {stat.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs + Table */}
          <div className="w-full bg-transparent rounded-[8px] p-[16px]">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key);
                setDrawerVisible(false);
              }}
              items={tabItems}
            />

            <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-[16px] min-w-0">
              <div className="mb-[16px] flex justify-between">
                <Input
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-[200px]"
                />

                <PrimaryBtn
                  name={`Add ${activeTab.slice(0, -1)}`}
                  icon={<PlusOutlined />}
                  onClick={() => setAddDrawerVisible(true)}
                />

                <Drawer
                  title={`Add ${activeTab.slice(0, -1)}`}
                  width={720}
                  open={addDrawerVisible}
                  onClose={() => setAddDrawerVisible(false)}
                >
                  <UserForm
                    activeTab={activeTab}
                    onFinish={(values) => handleSubmit(values, activeTab)}
                  />
                </Drawer>
              </div>

              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                bordered
              />
            </div>

            {/* Edit / View drawer */}
            <Drawer
              title={drawerTitleMap[activeTab]}
              width={720}
              onClose={() => {
                setDrawerVisible(false);
                setUploadedImage(null);
              }}
              open={drawerVisible}
              bodyStyle={{ padding: 24 }}
            >
              {renderDrawerContent()}
              <div className="flex justify-end mt-[24px] gap-[20px]">
                <div className="flex items-center gap-[12px]">
                  <span className="font-medium">Status:</span>
                  <Radio.Group
                    value={editedData.is_active_state !== false}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value={true}>Active</Radio.Button>
                    <Radio.Button value={false}>Inactive</Radio.Button>
                  </Radio.Group>
                  {(currentUserRole === "admin" ||
                    currentUser?.username?.toLowerCase().includes("foy") ||
                    currentUser?.first_name?.toLowerCase().includes("foy")) && (
                    <Popconfirm
                      title="Delete Account"
                      description="Are you sure you want to delete this account?"
                      onConfirm={handleDeleteClick}
                      okText="Yes, Delete"
                      cancelText="No"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger className="ml-[12px]">
                        Delete Account
                      </Button>
                    </Popconfirm>
                  )}
                </div>
                <PrimaryBtn
                  name={`Save ${
                    activeTab.slice(0, -1).charAt(0).toUpperCase() +
                    activeTab.slice(1, -1)
                  }`}
                  type="primary"
                  size="large"
                  onClick={handleUpdateClick}
                />
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}
