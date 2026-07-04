import { useEffect, useState, useCallback, useMemo } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import PrimaryBtn from "../components/PrimaryBtn";
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
import axios from "axios";
import Primarybtn from "../components/PrimaryBtn";
import { Select } from "antd";
import bloodPressure from "../assets/icons/blood-pressure.svg";
import heartRate from "../assets/icons/heart-rate.svg";
import oxygen from "../assets/icons/oxygen.svg";
import respiratory from "../assets/icons/respiratory.svg";
import statusIcon from "../assets/icons/status.svg";
import sugar from "../assets/icons/sugar.svg";
import weight from "../assets/icons/weight.svg";
import temperature from "../assets/icons/temperature.png";
import { base_url } from "../constants/constants";

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

export default function UserManagement() {
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
  const [docList, setDocList] = useState([]);
  const [sponsorList, setSponsorList] = useState([]);
  const [caretakerList, setCaretakerList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

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

  // ─── Fetch helpers ──────────────────────────────────────────────────────────
  const fetchSponsors = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Token ${token}` };
      const userRes = await axios.get(`${base_url}/user_view/`, { headers });
      const allusers = userRes.data || [];
      const res = await axios.get(`${base_url}/sponsorprofile_list/`, { headers });
      const sponsors = res.data || [];
      const sponsorUserIds = sponsors.map((s) => s.user?.id);
      const filteredAllusers = allusers.filter(
        (u) =>
          u.user_role === "sponsor" ||
          u.role === "sponsor" ||
          sponsorUserIds.includes(u.id),
      );
      const combinedSponsors = filteredAllusers.map((user) => ({
        ...user,
        sponsorProfile: sponsors.find((s) => s?.user?.id === user.id) || {},
      }));
      setSponsorList(combinedSponsors);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [base_url, token]);

  const fetchCareTakers = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Token ${token}` };
      const userRes = await axios.get(`${base_url}/user_view/`, { headers });
      const allusers = userRes.data || [];
      const res = await axios.get(`${base_url}/caretakerprofile_list/`, { headers });
      const caretakers = res.data || [];
      const caretakersUserIds = caretakers.map((c) => c.user?.id);
      const filteredAllusers = allusers.filter(
        (u) =>
          u.user_role === "care_taker" ||
          u.role === "care_taker" ||
          caretakersUserIds.includes(u.id),
      );
      const combinedCaretakers = filteredAllusers.map((user) => ({
        ...user,
        caretakerProfile: caretakers.find((c) => c.user?.id === user.id) || {},
      }));
      setCaretakerList(combinedCaretakers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [base_url, token]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Token ${token}` };
      const [userRes, patientRes] = await Promise.all([
        axios.get(`${base_url}/user_view/`, { headers }),
        axios.get(`${base_url}/patientprofile_list/`, { headers }),
      ]);
      const allUsers = userRes.data || [];
      const patients = patientRes.data || [];
      const combinedPatients = patients.map((p) => {
        const userObj =
          allUsers.find(
            (u) =>
              u.id === p.user?.id ||
              (u.email &&
                p.email &&
                u.email.toLowerCase() === p.email.toLowerCase()),
          ) || {};
        return {
          ...userObj,
          ...p,
          id: p.id,
          user_id: userObj.id || p.user?.id,
          username:
            userObj.username ||
            p.username ||
            (p.email ? p.email.split("@")[0] : "") ||
            (p.patient_name
              ? p.patient_name.toLowerCase().replace(/\s+/g, "_")
              : "patient_" + p.id),
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
      setPatientList(combinedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  }, [base_url, token]);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Token ${token}` };
      const userRes = await axios.get(`${base_url}/user_view/`, { headers });
      const allusers = userRes.data || [];
      const res = await axios.get(`${base_url}/doctorprofile_list/`, {
        headers,
      });
      const doctors = res.data || [];
      const doctorUserIds = doctors.map((d) => d.user?.id);
      const filteredAllusers = allusers.filter(
        (u) =>
          u.user_role === "doctor" ||
          u.role === "doctor" ||
          doctorUserIds.includes(u.id),
      );
      const combinedDoctors = filteredAllusers.map((user) => ({
        ...user,
        doctorProfile: doctors.find((d) => d.user?.id === user.id) || {},
      }));
      setDocList(combinedDoctors);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [base_url, token]);

  const fetchAllUsersData = useCallback(() => {
    fetchSponsors();
    fetchCareTakers();
    fetchPatients();
    fetchDoctors();
  }, [fetchSponsors, fetchCareTakers, fetchPatients, fetchDoctors]);

  useEffect(() => {
    fetchAllUsersData();
  }, [fetchAllUsersData]);

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleSubmit = async (values, activeTab) => {
    try {
      if (activeTab === "patients") {
        // In VeriMed architecture, patients don't have a standalone 'patient' login role.
        // They are created under role 'sponsor' and linked with a patient profile.
        const user_signup = {
          first_name: values.first_name,
          last_name: values.last_name,
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
        await axios.post(`${base_url}/user_create/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
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
        await axios.post(`${base_url}/patientprofile_create_update/`, pFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        });

        notification.success({
          message: "Patient account & profile created successfully!",
        });
        setAddDrawerVisible(false);
        fetchPatients();
        return;
      }

      const roleMap = {
        sponsors: "sponsor",
        doctors: "doctor",
        caretakers: "care_taker",
      };
      const user_signup = {
        first_name: values.first_name,
        last_name: values.last_name,
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
      await axios.post(`${base_url}/user_create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      notification.success({
        message: `${roleMap[activeTab]} created successfully!`,
      });
      setAddDrawerVisible(false);
      fetchAllUsersData();
      setTimeout(() => fetchAllUsersData(), 600);
    } catch (error) {
      console.error("Signup error:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.detail || "Something went wrong.",
      });
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
          endpoint = `${base_url}/user_update/`;
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
          endpoint = `${base_url}/doctorprofile_update/`;
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

        case "patients":
          endpoint = `${base_url}/patientprofile_update/`;
          keyName = "patientprofile_update_data";
          const formattedDOB =
            editedData.patient_dob && !isNaN(Date.parse(editedData.patient_dob))
              ? new Date(editedData.patient_dob).toISOString().split("T")[0]
              : "";
          updateData = {
            patient_profile_updateid: selectedPatient?.patientProfile?.id,
            sponsorid: editedData.sponsorid || "",
            doctorid: editedData.doctorid || "",
            caretakerid: editedData.caretakerid || "",
            patient_dob: formattedDOB,
            patient_gender: editedData.patient_gender || "",
            blood_group: editedData.blood_group || "",
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
            reason_enrollment: editedData.reason_enrollment || "",
            reason_other: editedData.reason_other || "",
            medical_his_diagnosis: editedData.medical_his_diagnosis || "",
            medical_his_cancer: editedData.medical_his_cancer || "",
            medical_his_other: editedData.medical_his_other || "",
            medical_his_provided_medi_care:
              editedData.medical_his_provided_medi_care || "",
            medical_his_major_surgeries:
              editedData.medical_his_major_surgeries || "",
            medical_his_curr_symp: editedData.medical_his_curr_symp || "",
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

        case "caretakers":
          endpoint = `${base_url}/caretakerprofile_update/`;
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

      if (editedData.photo instanceof File) {
        formData.append("photo", editedData.photo);
        console.log("📸 Photo being uploaded:", editedData.photo.name);
      }

      console.log("🚀 Sending PATCH to:", endpoint);
      console.log("📦 FormData content:", updateData);

      const headers = {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const res = await axios.patch(endpoint, formData, { headers });
      console.log("✅ Update Success:", res.data);

      notification.success({
        message: `${activeTab.slice(0, -1).toUpperCase()} PROFILE UPDATED`,
        description: `The ${activeTab.slice(0, -1)} profile was updated successfully.`,
        placement: "topRight",
      });

      fetchAllUsersData();
      setTimeout(() => fetchAllUsersData(), 600);

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
      const endpoint = `${base_url}/user_update/`;
      const updateData = { updateid: userId, is_active_state: newStatus };
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);
      const formdata = new FormData();
      formdata.append("user_update_data", JSON.stringify(updateData));
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
      console.log("🚀 Updating user status:", updateData);
      const response = await fetch(endpoint, requestOptions);
      const result = await response.text();
      console.log("✅ Status Update Success:", result);
      setEditedData((prev) => ({ ...prev, is_active_state: newStatus }));
      notification.success({
        message: `ACCOUNT ${newStatus ? "ACTIVATED" : "DEACTIVATED"}`,
        description: `The account has been ${newStatus ? "activated" : "deactivated"} successfully.`,
        placement: "topRight",
      });
      fetchAllUsersData();
      setTimeout(() => fetchAllUsersData(), 600);
    } catch (error) {
      console.error("❌ Status update failed:", error);
      notification.error({
        message: "UPDATE FAILED",
        description:
          error.message ||
          `Unable to change status for ${activeTab.slice(0, -1)} account.`,
        placement: "topRight",
      });
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
    if (!userId) return;
    try {
      if (activeTab === "sponsors")
        setSponsorList((prev) => prev.filter((item) => item.id !== userId));
      if (activeTab === "doctors")
        setDocList((prev) => prev.filter((item) => item.id !== userId));
      if (activeTab === "caretakers")
        setCaretakerList((prev) => prev.filter((item) => item.id !== userId));
      if (activeTab === "patients")
        setPatientList((prev) => prev.filter((item) => item.id !== userId));

      setDrawerVisible(false);
      notification.success({
        message: "ACCOUNT DELETED",
        description: `The ${activeTab.slice(0, -1)} account has been removed successfully.`,
        placement: "topRight",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      notification.error({
        message: "DELETE FAILED",
        description: "Unable to delete account.",
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 8,
      }}
    >
      <p style={labelStyle}>Profile Photo</p>

      <div style={{ position: "relative", width: 72, height: 72 }}>
        <Avatar
          size={72}
          src={uploadedImage || currentSrc}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />

        {/* Camera overlay button */}
        <Tooltip title="Change photo">
          <label
            htmlFor={inputId}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "linear-gradient(180deg, #F0C330, #B78520)",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            }}
          >
            <CameraOutlined style={{ color: "#fff", fontSize: 12 }} />
          </label>
        </Tooltip>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>

      {uploadedImage && (
        <span style={{ fontSize: 12, color: "#27AE60" }}>
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
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
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
          style={{ fontSize: 18, cursor: "pointer" }}
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
        username: s?.username || (s?.email ? s.email.split("@")[0] : "") || "N/A",
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
        username: d?.username || (d?.email ? d.email.split("@")[0] : "") || "N/A",
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
        username: c?.username || (c?.email ? c.email.split("@")[0] : "") || "N/A",
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
          (p?.email ? p.email.split("@")[0] : "") ||
          (p?.first_name || p?.patient_name
            ? (p?.first_name || p?.patient_name)
                .toLowerCase()
                .replace(/\s+/g, "_")
            : "patient_" + (p?.id || Math.floor(Math.random() * 1000))),
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
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* ── Profile photo uploader ── */}
          <AvatarUploader
            currentSrc={selectedSponsor.avatar}
            inputId="sponsor-photo-upload"
          />

          {/* ── Fields ── */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>First Name</label>
              <Input
                value={editedData.first_name}
                onChange={(e) =>
                  setEditedData({ ...editedData, first_name: e.target.value })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <Input
                value={editedData.last_name}
                onChange={(e) =>
                  setEditedData({ ...editedData, last_name: e.target.value })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Country Code</label>
              <Select
                value={editedData.country_code || "CM"}
                onChange={(val) =>
                  setEditedData({ ...editedData, country_code: val })
                }
                style={{ width: "100%" }}
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
              <label style={labelStyle}>Phone Number</label>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* ── Profile photo uploader ── */}
          <AvatarUploader
            currentSrc={selectedDoctor.photo}
            inputId="doctor-photo-upload"
          />

          <p style={labelStyle}>Doctor Name</p>
          <Input
            value={editedData.name}
            onChange={(e) =>
              setEditedData({ ...editedData, name: e.target.value })
            }
          />
          <p style={labelStyle}>Speciality</p>
          <Input
            value={editedData.speciality}
            onChange={(e) =>
              setEditedData({ ...editedData, speciality: e.target.value })
            }
          />
          <p style={labelStyle}>Country Code</p>
          <Select
            value={editedData.doc_country_code || "CM"}
            onChange={(val) =>
              setEditedData({ ...editedData, doc_country_code: val })
            }
            style={{ width: "100%" }}
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
          <p style={labelStyle}>Phone</p>
          <Input
            value={editedData.doc_phone}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_phone: e.target.value })
            }
          />
          <p style={labelStyle}>Address</p>
          <Input
            value={editedData.doc_address}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_address: e.target.value })
            }
          />
          <p style={labelStyle}>Gender</p>
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
          <p style={labelStyle}>Experience (Years)</p>
          <Input
            type="number"
            value={editedData.doc_exprience}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_exprience: e.target.value })
            }
          />
          <p style={labelStyle}>License No</p>
          <Input
            value={editedData.doc_licence_no}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_licence_no: e.target.value })
            }
          />
          <p style={labelStyle}>City</p>
          <Input
            value={editedData.doc_city}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_city: e.target.value })
            }
          />
          <p style={labelStyle}>State</p>
          <Input
            value={editedData.doc_state}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_state: e.target.value })
            }
          />
          <p style={labelStyle}>Country</p>
          <Input
            value={editedData.doc_country}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_country: e.target.value })
            }
          />
          <p style={labelStyle}>Pincode</p>
          <Input
            value={editedData.doc_pincode}
            onChange={(e) =>
              setEditedData({ ...editedData, doc_pincode: e.target.value })
            }
          />
          <p style={labelStyle}>Joining Date</p>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* ── Profile photo uploader ── */}
          <AvatarUploader
            currentSrc={selectedCaretaker.photo}
            inputId="caretaker-photo-upload"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <p style={labelStyle}>Caretaker Name</p>
              <Input
                value={editedData.name}
                onChange={(e) =>
                  setEditedData({ ...editedData, name: e.target.value })
                }
              />
            </div>

            <div>
              <p style={labelStyle}>Caretaker Address</p>
              <Input
                rows={2}
                value={editedData.address}
                onChange={(e) =>
                  setEditedData({ ...editedData, address: e.target.value })
                }
              />
            </div>
            <div>
              <p style={labelStyle}>Caretaker Gender</p>
              <Select
                value={editedData.gender}
                style={{ width: "100%" }}
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
              <p style={labelStyle}>Experience (in years)</p>
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
              <p style={labelStyle}>Year of Graduation</p>
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
              <p style={labelStyle}>Credentials</p>
              <Input.TextArea
                rows={2}
                value={editedData.credentials}
                onChange={(e) =>
                  setEditedData({ ...editedData, credentials: e.target.value })
                }
              />
            </div>
            <div>
              <p style={labelStyle}>Skillset</p>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AvatarUploader
            currentSrc={selectedPatient.photo}
            inputId="patient-photo-upload"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <p style={labelStyle}>Sponsor ID</p>
              <Input
                value={editedData.sponsorid || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, sponsorid: e.target.value })
                }
              />
            </div>
            <div>
              <p style={labelStyle}>DOB</p>
              <Input
                type="date"
                value={
                  editedData.patient_dob && !isNaN(Date.parse(editedData.patient_dob))
                    ? new Date(editedData.patient_dob).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditedData({ ...editedData, patient_dob: e.target.value })
                }
              />
            </div>
            <div>
              <p style={labelStyle}>Gender</p>
              <Select
                value={editedData.patient_gender}
                onChange={(val) =>
                  setEditedData({ ...editedData, patient_gender: val })
                }
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </div>
            <div>
              <p style={labelStyle}>Blood Group</p>
              <Input
                value={editedData.blood_group || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, blood_group: e.target.value })
                }
              />
            </div>
            <div>
              <p style={labelStyle}>Home Address</p>
              <Input
                value={editedData.patient_home_address || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, patient_home_address: e.target.value })
                }
              />
            </div>
            <div>
              <p style={labelStyle}>Diagnosis</p>
              <Input
                value={editedData.medical_his_diagnosis || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, medical_his_diagnosis: e.target.value })
                }
              />
            </div>
            <div>
              <p style={labelStyle}>Cancer History</p>
              <Select
                value={editedData.medical_his_cancer}
                onChange={(val) =>
                  setEditedData({ ...editedData, medical_his_cancer: val })
                }
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                  { label: "Not Known at time of enrolment", value: "Not Known at time of enrolment" },
                ]}
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
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#F7F9FB" }}
    >
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            overflowX: "hidden",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Stats cards */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              width: "100%",
            }}
          >
            {adminStats.map((stat) => (
              <div
                key={stat.id}
                style={{
                  minWidth: 160,
                  flex: "0 0 auto",
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#007F5F33",
                    }}
                  >
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
                  <p
                    style={{
                      color: "#6C7688",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {stat.name}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontSize: 18,
                      fontWeight: "800",
                    }}
                  >
                    {stat.count}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#27AE60",
                        height: 20,
                        width: 49,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 6,
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {stat.diff}
                      </p>
                    </div>
                    <p style={{ color: "#6C7688", fontSize: 13 }}>
                      {stat.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs + Table */}
          <div
            style={{
              width: "100%",
              background: "transparent",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key);
                setDrawerVisible(false);
              }}
              items={tabItems}
            />

            <div style={tableContainer}>
              <div
                style={{
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Input
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 200 }}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 24,
                  gap: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 500 }}>Status:</span>
                  <Radio.Group
                    value={editedData.is_active_state !== false}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value={true}>Active</Radio.Button>
                    <Radio.Button value={false}>Inactive</Radio.Button>
                  </Radio.Group>
                  {(currentUserRole === "admin" || currentUser?.username?.toLowerCase().includes("foy") || currentUser?.first_name?.toLowerCase().includes("foy")) && (
                    <Popconfirm
                      title="Delete Account"
                      description="Are you sure you want to delete this account?"
                      onConfirm={handleDeleteClick}
                      okText="Yes, Delete"
                      cancelText="No"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger style={{ marginLeft: 12 }}>Delete Account</Button>
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

// ─── Styles ──────────────────────────────────────────────────────────────────
const tableContainer = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};
const labelStyle = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 4,
  display: "block",
  color: "#2E2E2E",
};
const linkedLabelStyle = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 4,
  display: "block",
  color: "#2E2E2E",
  opacity: "60%",
};
const linkedInfoStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};
const infoTextStyle = {
  margin: 0,
  fontWeight: 500,
  fontSize: 16,
  color: "#2E2E2E",
  textAlign: "center",
};
const sectionTitle = {
  color: "#000",
  fontWeight: 600,
  borderBottom: "1px solid #ddd",
  paddingBottom: 4,
  marginTop: 12,
};
const twoColGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};
