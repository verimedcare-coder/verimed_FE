import React, { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { headerService } from "../../services/headerService";
import {
  Layout,
  Select,
  Input,
  Button,
  Space,
  Tooltip,
  Dropdown,
  Modal,
  Avatar,
  Form,
  Upload,
  message,
  Checkbox,
  Radio,
  DatePicker,
  Spin,
  AutoComplete,
} from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  UploadOutlined,
  UserOutlined,
  HeartOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import flagIcon from "../../assets/icons/flag.svg";
import Primarybtn from "../common/PrimaryBtn";
import { useNavigate } from "react-router-dom";
import { base_url, isAdminUser, stripDialCode } from "../../constants/constants";
import {
  clearRoleSessionStorage,
  getStoredSponsorProfileId,
  persistSponsorProfile,
  resolveSponsorProfileFromList,
  toValidId,
} from "../../utils/sponsorIsolation";
import dayjs from "dayjs";
import { getData } from "country-list";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const enrollSchema = Yup.object().shape({
  patientName: Yup.string().required("Patient Name is required"),
  patientPhone: Yup.string().required("Phone Number is required"),
  country_code: Yup.string().required("Country Code is required"),
  patient_dob: Yup.date().nullable().required("Date of Birth is required"),
  patient_gender: Yup.string().required("Gender is required"),
});
const { Header } = Layout;
const { Option } = Select;

const UserForm = ({ onFinish }) => {
  const [form] = Form.useForm();

  const normFile = (e) => (Array.isArray(e) ? e : e && e.file.originFileObj);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{ countrycode: "IN" }}
      autoComplete="off"
    >
      <Form.Item
        name="first_name"
        label="First Name"
        rules={[{ required: true, message: "Please enter first name" }]}
      >
        <Input placeholder="Enter first name" autoComplete="off" />
      </Form.Item>

      <Form.Item
        name="last_name"
        label="Last Name"
        rules={[{ required: true, message: "Please enter last name" }]}
      >
        <Input placeholder="Enter last name" autoComplete="off" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter email" },
          { type: "email", message: "Enter a valid email address" },
        ]}
      >
        <Input placeholder="Enter email" autoComplete="off" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: "Please enter phone number" }]}
      >
        <Input placeholder="Enter phone number" autoComplete="off" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please enter password" }]}
      >
        <Input.Password
          placeholder="Enter password"
          autoComplete="new-password"
        />
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
          Enroll Patient
        </Button>
      </Form.Item>
    </Form>
  );
};

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

export default function HeaderComponent() {
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState("EN");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const navigate = useNavigate();
  const [medications, setMedications] = useState([
    {
      medication_name: "",
      medication_dose: "",
      medication_frequency: "",
      medication_reason: "",
      medication_issues: false,
      medication_issues_explain: "",
    },
  ]);

  const countryOptions = useMemo(() => {
    return getData().map((country) => ({
      label: country.name,
      value: country.code,
    }));
  }, []);

  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  const token = localStorage.getItem("token");
  const isSponsor = user?.user_role === "sponsor" && !isAdminUser(user);

  const handleLanguageChange = (lang) => setLanguage(lang);

  let careTakerPatients = [];
  try {
    careTakerPatients = JSON.parse(
      localStorage.getItem("careTakerPatients") || "[]",
    );
  } catch {
    careTakerPatients = [];
  }

  const items = [
    {
      key: "1",
      label: <span className="font-medium text-[#1F2937]">Enroll Yourself</span>,
      icon: <UserOutlined className="text-[#007F5F] text-[14px]" />,
    },
    {
      key: "2",
      label: <span className="font-medium text-[#1F2937]">Enroll Your Loved One</span>,
      icon: <HeartOutlined className="text-[#E11D48] text-[14px]" />,
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      localStorage.removeItem("patient_profile_updateid");
      const cleanPhone = user ? stripDialCode(user.phone) : "";
      const selfDefaults = {
        id: undefined,
        patient_profile_updateid: undefined,
        patientName: user
          ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
          : "",
        patientEmail: user ? user.email || "" : "",
        patientPhone: cleanPhone,
        country_code: user?.country_code || "",
        reason_enrollment: "Self",
        patient_upload_files: [],
      };
      form.resetFields();
      form.setFieldsValue(selfDefaults);
      setEditedData((prev) => ({
        ...prev,
        ...selfDefaults,
      }));
      setIsSecondModalVisible(true);
    } else if (e.key === "2") {
      localStorage.removeItem("patient_profile_updateid");
      const lovedOneDefaults = {
        id: undefined,
        patient_profile_updateid: undefined,
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        country_code: "",
        reason_enrollment: "Loved One",
        patient_upload_files: [],
      };
      form.resetFields();
      form.setFieldsValue(lovedOneDefaults);
      setEditedData((prev) => ({
        ...prev,
        ...lovedOneDefaults,
      }));
      setIsSecondModalVisible(true);
    }
  };

  const languageMenuItems = [
    { key: "EN", label: "English" },
    { key: "FR", label: "French" },
    { key: "ES", label: "Spanish" },
    { key: "DE", label: "German" },
  ];

  const handleLogout = () => {
    queryClient.clear();
    clearRoleSessionStorage();
    localStorage.clear();
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showPatientDetails = (patientId) => {
    try {
      const targetId = toValidId(patientId);
      const storedAppointments = JSON.parse(
        localStorage.getItem("sponsorAppointments") || "[]",
      );
      const sponsorPatientData = JSON.parse(
        localStorage.getItem("sponsorPatientData") || "[]",
      );

      const patientAppointments = storedAppointments.filter(
        (item) =>
          (targetId && toValidId(item?.patient?.id) === targetId) ||
          (targetId && toValidId(item?.patient?.user?.id) === targetId),
      );

      let patientDetails = null;

      if (patientAppointments.length > 0) {
        patientDetails =
          patientAppointments[0]?.patient?.user ||
          patientAppointments[0]?.patient ||
          null;
        localStorage.setItem(
          "selectedPatientAppointments",
          JSON.stringify(patientAppointments),
        );
      } else {
        localStorage.removeItem("selectedPatientAppointments");
        const match = sponsorPatientData.find(
          (p) =>
            (targetId && toValidId(p?.id) === targetId) ||
            (targetId && toValidId(p?.user?.id) === targetId),
        );
        if (match) {
          patientDetails = match.user || match;
        }
      }

      if (patientDetails) {
        localStorage.setItem(
          "selectedPatientDetails",
          JSON.stringify(patientDetails),
        );
      } else {
        localStorage.removeItem("selectedPatientDetails");
      }
    } catch (error) {
      console.error("Error retrieving patient details:", error);
    }
  };

  const handlePatientChange = (value) => {
    const valueStr = value !== null && value !== undefined ? String(value) : "";
    setSelectedPatient(valueStr || null);
    if (valueStr) {
      localStorage.setItem("selectedPatientId", valueStr);
    } else {
      localStorage.removeItem("selectedPatientId");
    }

    let selectedPatientObj = null;
    let selectedSource = null;
    if (
      Array.isArray(patients) &&
      patients.some((p) => String(p.id) === String(valueStr))
    ) {
      selectedPatientObj = patients.find((p) => String(p.id) === String(valueStr));
      selectedSource = "patients";
    } else if (
      Array.isArray(careTakerPatients) &&
      careTakerPatients.some((p) => String(p.id) === String(valueStr))
    ) {
      selectedPatientObj = careTakerPatients.find(
        (p) => String(p.id) === String(valueStr),
      );
      selectedSource = "careTakerPatients";
    }

    if (selectedPatientObj) {
      localStorage.setItem(
        "selectedPatientData",
        JSON.stringify(selectedPatientObj),
      );
      localStorage.setItem("selectedPatientSource", selectedSource);
      showPatientDetails(valueStr);
    } else {
      localStorage.removeItem("selectedPatientData");
      localStorage.removeItem("selectedPatientSource");
    }

    setEditedData(selectedPatientObj || {});
    window.dispatchEvent(new Event("patientChanged"));
  };

  const storedSponsorId = isSponsor ? getStoredSponsorProfileId() : null;
  const { data: sponsorProfilesList = [] } = useQuery({
    queryKey: ["sponsorProfiles", user?.id],
    queryFn: async () => {
      const res = await headerService.getSponsorProfiles();
      return Array.isArray(res) ? res : [];
    },
    enabled: !!token && isSponsor && !storedSponsorId,
  });

  const resolvedSponsorProfile = useMemo(
    () => resolveSponsorProfileFromList(sponsorProfilesList, user),
    [sponsorProfilesList, user],
  );

  const effectiveSponsorId = useMemo(
    () => storedSponsorId || toValidId(resolvedSponsorProfile?.id),
    [storedSponsorId, resolvedSponsorProfile],
  );

  useEffect(() => {
    if (resolvedSponsorProfile) {
      persistSponsorProfile(resolvedSponsorProfile);
    }
  }, [resolvedSponsorProfile]);

  const {
    data: fetchedPatients = [],
    isSuccess: isSponsorPatientsFetched,
  } = useQuery({
    queryKey: ["sponsorPatients", effectiveSponsorId],
    queryFn: async () => {
      const res = await headerService.getSponsorPatients(effectiveSponsorId);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!effectiveSponsorId && !!token && isSponsor,
  });

  useEffect(() => {
    if (!isSponsor) return;

    if (fetchedPatients.length > 0) {
      setPatients(fetchedPatients);
      const patientIds = fetchedPatients
        .map((p) => toValidId(p.id))
        .filter(Boolean);
      localStorage.setItem("sponsorPatientIds", JSON.stringify(patientIds));
      localStorage.setItem("sponsorPatientData", JSON.stringify(fetchedPatients));

      const storedSelectedId = localStorage.getItem("selectedPatientId");
      let foundPatient = null;
      if (storedSelectedId) {
        foundPatient = fetchedPatients.find(
          (p) => String(p.id) === String(storedSelectedId),
        );
      }
      if (foundPatient) {
        const foundIdStr = String(foundPatient.id);
        setSelectedPatient(foundIdStr);
        localStorage.setItem("selectedPatientId", foundIdStr);
        localStorage.setItem(
          "selectedPatientData",
          JSON.stringify(foundPatient),
        );
        showPatientDetails(foundPatient.id);
      } else {
        const firstPatientId = String(fetchedPatients[0].id);
        setSelectedPatient(firstPatientId);
        localStorage.setItem("selectedPatientId", firstPatientId);
        localStorage.setItem(
          "selectedPatientData",
          JSON.stringify(fetchedPatients[0]),
        );
        showPatientDetails(firstPatientId);
        window.dispatchEvent(new Event("patientChanged"));
      }
    } else if (isSponsorPatientsFetched) {
      setPatients([]);
      setSelectedPatient(null);
      localStorage.removeItem("sponsorPatientIds");
      localStorage.removeItem("sponsorPatientData");
      localStorage.removeItem("selectedPatientId");
      localStorage.removeItem("selectedPatientData");
      localStorage.removeItem("selectedPatientDetails");
      localStorage.removeItem("selectedPatientAppointments");
      window.dispatchEvent(new Event("patientChanged"));
    }
  }, [fetchedPatients, isSponsor, isSponsorPatientsFetched]);

  const checkIsLovedOne = (p) => {
    if (!p) return false;
    const reasonObj =
      p.reason_enrollment ||
      p.reason ||
      p.patient?.reason_enrollment ||
      p.patient?.reason ||
      p.enrollment_type ||
      p.patient?.enrollment_type ||
      "";
    const cleanReason = String(reasonObj).trim().toLowerCase();
    if (
      cleanReason === "loved one" ||
      cleanReason === "loved ones" ||
      cleanReason === "loved_one" ||
      cleanReason === "lovedone" ||
      cleanReason === "loved-one"
    ) {
      return true;
    }
    if (p.is_loved_one === true || p.patient?.is_loved_one === true) {
      return true;
    }
    return false;
  };

  const patientList = useMemo(() => {
    const list =
      Array.isArray(patients) && patients.length > 0
        ? patients
        : Array.isArray(careTakerPatients)
          ? careTakerPatients
          : [];
    const uniqueList = Array.from(
      new Map(list.map((p) => [String(p.id), p])).values(),
    );
    return uniqueList.filter((p) => !checkIsLovedOne(p));
  }, [patients, careTakerPatients]);

  const lovedOnesList = useMemo(() => {
    const list =
      Array.isArray(patients) && patients.length > 0
        ? patients
        : Array.isArray(careTakerPatients)
          ? careTakerPatients
          : [];
    const uniqueList = Array.from(
      new Map(list.map((p) => [String(p.id), p])).values(),
    );
    return uniqueList.filter((p) => checkIsLovedOne(p));
  }, [patients, careTakerPatients]);

  const { data: caretakerList = [] } = useQuery({
    queryKey: ["caretakers"],
    queryFn: async () => {
      const data = await headerService.getCaretakers();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });

  const handleEnrollSubmit = async (values) => {
    setLoading(true);
    try {
      const user_signup = {
        first_name: values.first_name,
        last_name: values.last_name,
        role: "sponsor",
        email: values.email,
        countrycode: "IN",
        phone: values.phone,
        password: values.password,
        is_active_state: true,
      };

      const formData = new FormData();
      formData.append("user_signup", JSON.stringify(user_signup));
      if (values.photo) formData.append("photo", values.photo);

      await axios.post(`${base_url}/user_create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      message.success("Sponsor enrolled successfully!");
      Modal.success({
        title: "Sponsor Enrolled",
        content:
          "Sponsor enrolled successfully! Please complete the patient profile details next.",
        centered: true,
      });

      const userViewRes = await axios.get(`${base_url}/user_view/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const allUsers = userViewRes.data;
      const matchedUser = allUsers.find(
        (u) =>
          u.first_name.toLowerCase() === values.first_name.toLowerCase() &&
          u.last_name.toLowerCase() === values.last_name.toLowerCase() &&
          u.user_role === "sponsor",
      );

      if (!matchedUser) {
        message.warning("User not found after enrollment.");
        return;
      }

      localStorage.setItem("enrolledUsername", matchedUser.username);

      const profileRes = await axios.get(`${base_url}/patientprofile_list/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const matchedProfile = profileRes.data.find(
        (p) =>
          p.user?.username === matchedUser.username ||
          (p.email &&
            matchedUser.email &&
            p.email.toLowerCase() === matchedUser.email.toLowerCase()),
      );

      if (matchedProfile) {
        localStorage.setItem("patient_profile_updateid", matchedProfile.id);
        setNewUser({
          username: matchedUser.username,
          profile_id: matchedProfile.id,
          first_name: matchedUser.first_name,
          last_name: matchedUser.last_name,
          email: matchedUser.email,
          phone: matchedUser.phone,
        });
      } else {
        message.warning("No patient profile found for this user.");
      }

      setIsModalVisible(false);
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error("Enrollment failed:", error);
      message.error("Something went wrong while enrolling the patient.");
      Modal.error({
        title: "Enrollment Failed",
        content:
          error.response?.data?.error ||
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Something went wrong while enrolling the patient. Please check your inputs.",
        centered: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = async (formValues = {}) => {
    const mergedData = {
      ...editedData,
      ...Object.fromEntries(
        Object.entries(formValues || {}).filter(([, val]) => val !== undefined),
      ),
    };

    try {
      await enrollSchema.validate(mergedData, { abortEarly: false });
    } catch (error) {
      if (error.name === "ValidationError") {
        error.inner.forEach((err) => {
          toast.error(err.message, { position: "top-right", autoClose: 3000 });
        });
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();

      const resolvedSponsorId =
        effectiveSponsorId || getStoredSponsorProfileId();

      const formattedDOB = mergedData.patient_dob
        ? dayjs(mergedData.patient_dob).format("YYYY-MM-DD")
        : null;

      const parsedAge =
        mergedData.age !== undefined &&
        mergedData.age !== null &&
        String(mergedData.age).trim() !== "" &&
        !Number.isNaN(Number(mergedData.age))
          ? parseInt(mergedData.age, 10)
          : null;

      const cleanPatientPhone = stripDialCode(mergedData.patientPhone);
      const cleanEmerPhone = stripDialCode(mergedData.emer_con_phone);
      const cleanLocalPhone = stripDialCode(mergedData.local_con_phone);
      const emerCountryCode = mergedData.emer_con_country_code || "";

      const medicationArray = medications.map((m) => ({
        name: m.medication_name || "",
        dose: m.medication_dose || "",
        frequency: m.medication_frequency || "",
        reason: m.medication_reason || "",
        issues: {
          has_issues: m.medication_issues || false,
          explain: m.medication_issues_explain || "",
        },
      }));

      const storedUpdateId =
        localStorage.getItem("patient_profile_updateid") ||
        mergedData.id ||
        mergedData.patient_profile_updateid ||
        null;

      const patientprofile_data = {
        id: storedUpdateId ? Number(storedUpdateId) : null,
        patient_profile_updateid: storedUpdateId
          ? Number(storedUpdateId)
          : null,
        updateid: storedUpdateId ? Number(storedUpdateId) : null,
        patientprofileid: storedUpdateId ? Number(storedUpdateId) : null,
        reason_enrollment:
          mergedData.reason_enrollment || mergedData.reason || "Patient",
        reason: mergedData.reason_enrollment || mergedData.reason || "Patient",
        sponsorid: resolvedSponsorId || null,
        caretakerid: mergedData.caretakerid || null,

        patient_name: mergedData.patientName || "",
        country_code: mergedData.country_code || "",
        phone: cleanPatientPhone,
        email: mergedData.patientEmail || "",

        age: parsedAge,
        height: mergedData.height || "",
        weight: mergedData.weight || "",

        blood_pressure: mergedData.bp || mergedData.blood_pressure || "",
        blood_sugar: mergedData.sugar || mergedData.blood_sugar || "",
        heart_rate: mergedData.heartRate || mergedData.heart_rate || "",
        oxygen: mergedData.oxygen || "",
        temperature: mergedData.temperature || "",
        respiratory_rate:
          mergedData.respiratoryRate || mergedData.respiratory_rate || "",

        patient_dob: formattedDOB,
        patient_gender: mergedData.patient_gender || "",
        blood_group: mergedData.blood_group || "",
        patient_home_address: mergedData.patient_home_address || "",
        primary_language: mergedData.primary_language || "",
        religion: mergedData.religion || "",
        escalate_to_physician: mergedData.escalate_to_physician || "",

        emer_con_name: mergedData.emer_con_name || "",
        emer_con_relation: mergedData.emer_con_relation || "",
        emer_con_coun_of_residen: mergedData.emer_con_coun_of_residen || "",
        emer_con_country_code: emerCountryCode,
        emer_con_phone: cleanEmerPhone,
        emer_con_email: mergedData.emer_con_email || "",

        local_con_name: mergedData.local_con_name || "",
        local_con_relation: mergedData.local_con_relation || "",
        local_con_country_code: mergedData.local_con_country_code || "",
        local_con_phone: cleanLocalPhone,

        reason_other: mergedData.reason_other || null,

        medical_his_diagnosis: mergedData.medical_his_diagnosis || "",
        medical_his_cancer: mergedData.medical_his_cancer || null,
        medical_his_other: mergedData.medical_his_other || "",
        medical_his_provided_medi_care:
          mergedData.medical_his_provided_medi_care || "",
        medical_his_major_surgeries:
          mergedData.medical_his_major_surgeries || "",
        medical_his_curr_symp: mergedData.medical_his_curr_symp || "",
        last_doctor_visit: mergedData.last_doctor_visit || null,
        has_regular_doctor: mergedData.has_regular_doctor || "",
        regular_doctor_name: mergedData.regular_doctor_name || "",

        allergies_issues: mergedData.allergies_issues || false,
        allergies_drug: mergedData.allergies_drug || "",
        allergies_food: mergedData.allergies_food || "",

        functional_bathe: mergedData.functional_bathe || "",
        functional_dress: mergedData.functional_dress || "",
        functional_eat: mergedData.functional_eat || "",
        functional_walk: mergedData.functional_walk || "",
        functional_use_bathroom: mergedData.functional_use_bathroom || "",
        functional_daily_activity: mergedData.functional_daily_activity || "",
        functional_manage_finance: mergedData.functional_manage_finance || "",
        functional_any_falls: mergedData.functional_any_falls || false,
        functional_how_many: mergedData.functional_how_many || null,
        functional_memory_pbms: mergedData.functional_memory_pbms || false,

        lifestyle_daily_routine: mergedData.lifestyle_daily_routine || "",
        lifestyle_dietary_habits: mergedData.lifestyle_dietary_habits || "",
        lifestyle_sleep_quality: mergedData.lifestyle_sleep_quality || "",
        lifestyle_physical_activity:
          mergedData.lifestyle_physical_activity || "",
        lifestyle_alcohol_use: mergedData.lifestyle_alcohol_use || "",
        lifestyle_pain_complaints: mergedData.lifestyle_pain_complaints || "",
        lifestyle_pain_where: mergedData.lifestyle_pain_where || "",

        social_emotion_health: mergedData.social_emotion_health || "",
        social_spiritual_needs: mergedData.social_spiritual_needs || "",
        social_trusted_person: mergedData.social_trusted_person || false,
        social_name: mergedData.social_name || "",

        goals_family_hope: mergedData.goals_family_hope || "",
        goals_special_instructions: mergedData.goals_special_instructions || "",
        goals_term_membership: mergedData.goals_term_membership || "",
      };

      const formKey = storedUpdateId
        ? "patientprofile_update_data"
        : "patientprofile_data";
      formData.append(formKey, JSON.stringify(patientprofile_data));

      formData.append("medication", JSON.stringify(medicationArray));

      // Profile Photo
      const photoList =
        formValues?.profile_photo ||
        mergedData.profile_photo ||
        formValues?.photo ||
        mergedData.photo;
      if (photoList && photoList.length > 0) {
        const fileObj = photoList[0].originFileObj || photoList[0];
        formData.append("patient_photo", fileObj);
        formData.append("photo", fileObj);
        formData.append("user_photo", fileObj);
      }

      // Upload files (only append when files are present so backend counts stay 1:1)
      const filesToUpload = Array.isArray(mergedData.patient_upload_files)
        ? mergedData.patient_upload_files
            .map((f) => ({
              file: f.originFileObj || f,
              name: (f.name || f.originFileObj?.name || "document").replace(
                /,/g,
                "_",
              ),
            }))
            .filter(
              (item) => item.file instanceof File || item.file instanceof Blob,
            )
        : [];

      if (filesToUpload.length > 0) {
        filesToUpload.forEach(({ file }) => {
          formData.append("patient_upload_files", file);
        });
        formData.append(
          "patient_files_name",
          filesToUpload.map(({ name }) => name).join(","),
        );
        if (storedUpdateId) {
          formData.append(
            "patient_files_ids",
            Array(filesToUpload.length).fill("null").join(","),
          );
        }
      }

      const endpoint = `${base_url}/patientprofile_create_update/`;
      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = storedUpdateId
        ? await axios.patch(endpoint, formData, config)
        : await axios.post(endpoint, formData, config);

      console.log("Update Response:", response.data);

      queryClient.invalidateQueries({ queryKey: ["sponsorPatients"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      message.success("Patient details updated successfully!");
      Modal.success({
        title: "Enrollment Complete",
        content: "Patient details updated and enrolled successfully!",
        centered: true,
      });
      localStorage.removeItem("patient_profile_updateid");
      setIsSecondModalVisible(false);
    } catch (error) {
      console.error("Update failed:", error);

      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);

        const errMsg =
          error.response.data?.error ||
          error.response.data?.message ||
          error.response.data?.detail ||
          "Unable to update patient profile.";
        message.error(errMsg);
        Modal.error({
          title: "Update Failed",
          content: errMsg,
          centered: true,
        });
      } else {
        message.error("Unable to update patient profile.");
        Modal.error({
          title: "Update Failed",
          content: "Unable to update patient profile. Please try again.",
          centered: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Header className="flex justify-between items-center py-[12px] px-[24px] bg-white border-b-[1px] border-solid border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-auto min-h-[68px] leading-normal gap-[16px] flex-nowrap">
        {loading && (
          <div className="fixed inset-0 w-screen h-screen bg-[rgba(255,255,255,0.6)] z-[9999] flex items-center justify-center">
            <Spin tip="Updating..." size="large" />
          </div>
        )}

        {/* Left Side: Responsive Greeting */}
        <div className="flex flex-col justify-center mr-[8px] overflow-hidden min-w-[140px] flex-[0_1_auto]">
          <div className="text-[18px] font-bold text-[#1E293B] whitespace-nowrap overflow-hidden text-ellipsis">
            Welcome Back,{" "}
            <span className="text-[#007F5F]">
              {user?.first_name || user?.username || "User"}
            </span>
            !
          </div>
          {user?.username && (
            <div className="text-[12px] text-[#64748B] font-medium whitespace-nowrap overflow-hidden mt-[2px] text-ellipsis">
              {user?.username}
            </div>
          )}
        </div>

        {/* Right Side: Action Controls */}
        <div className="flex items-center gap-[12px] shrink-0 flex-nowrap">
          {isSponsor && (
            <Select
              value={
                [...patientList, ...lovedOnesList].some(
                  (p) => String(p.id) === String(selectedPatient),
                )
                  ? String(selectedPatient)
                  : null
              }
              onChange={handlePatientChange}
              className="w-[200px] rounded-[8px] min-w-[170px]"
              placeholder="Select Patient or Loved One"
              optionLabelProp="label"
            >
              <Select.OptGroup label="Self">
                {patientList.map((p) => {
                  const name =
                    p.patient_name ||
                    p.patient?.patient_name ||
                    "Unknown Patient";
                  return (
                    <Option key={p.id} value={String(p.id)} label={name}>
                      <div className="flex items-center gap-[8px]">
                        <UserOutlined className="text-[#007F5F]" />
                        <span>{name}</span>
                      </div>
                    </Option>
                  );
                })}
              </Select.OptGroup>
              {lovedOnesList.length > 0 && (
                <Select.OptGroup label="Loved Ones">
                  {lovedOnesList.map((p) => {
                    const name =
                      p.patient_name ||
                      p.patient?.patient_name ||
                      "Unknown Loved One";
                    return (
                      <Option key={p.id} value={String(p.id)} label={name}>
                        <div className="flex items-center gap-[8px]">
                          <HeartOutlined className="text-[#FF4D4F]" />
                          <span>{name}</span>
                        </div>
                      </Option>
                    );
                  })}
                </Select.OptGroup>
              )}
            </Select>
          )}

          {(isSponsor || isAdminUser(user)) && (
            <Dropdown
              menu={{ items, onClick: handleMenuClick }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                type="button"
                className="flex items-center gap-[7px] bg-gradient-to-r from-[#007F5F] to-[#009E75] hover:from-[#006B50] hover:to-[#008764] text-white font-semibold text-[13px] h-[36px] px-[14px] rounded-[8px] border-none shadow-[0_2px_6px_rgba(0,127,95,0.25)] hover:shadow-[0_4px_10px_rgba(0,127,95,0.35)] transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-[0.98]"
              >
                <UserAddOutlined className="text-[15px]" />
                <span>Enroll Patient</span>
                <DownOutlined className="text-[10px] opacity-80 ml-[2px]" />
              </button>
            </Dropdown>
          )}

          <Dropdown
            menu={{
              items: languageMenuItems,
              onClick: (e) => handleLanguageChange(e.key),
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className="flex items-center gap-[6px] py-[6px] px-[10px] cursor-pointer rounded-[6px] border-[1px] border-solid border-[#E5E7EB] bg-[#FAFAFA]">
              <img src={flagIcon} alt="Flag" className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-semibold text-[#374151]">
                {language}
              </span>
              <DownOutlined className="text-[10px] text-[#6B7280]" />
            </div>
          </Dropdown>

          <Tooltip title="Logout">
            <Button
              shape="circle"
              icon={<LogoutOutlined className="text-[#FF4545] text-[16px]" />}
              className="bg-[#FF454514] rounded-[8px] w-[36px] h-[36px] flex items-center justify-center border-solid border-[#FF4545]"
              onClick={handleLogout}
            />
          </Tooltip>
        </div>
      </Header>

      {/* patient update modal */}
      <Modal
        title="Create Patient Details"
        open={isSecondModalVisible}
        onCancel={() => setIsSecondModalVisible(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setIsSecondModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            loading={loading}
            onClick={() => {
              const termsDom = document.getElementById("accept_terms");
              if (
                termsDom &&
                termsDom.checked &&
                !form.getFieldValue("accept_terms")
              ) {
                form.setFieldsValue({ accept_terms: true });
              }
              form
                .validateFields()
                .then((values) => {
                  handleUpdateClick(values);
                })
                .catch((errorInfo) => {
                  console.log("Validation Failed:", errorInfo);
                });
            }}
          >
            Create
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            ...editedData,
            bp: editedData.bp || editedData.blood_pressure,
            heartRate: editedData.heartRate || editedData.heart_rate,
            sugar: editedData.sugar || editedData.blood_sugar,
            respiratoryRate:
              editedData.respiratoryRate || editedData.respiratory_rate,
            patient_dob: editedData.patient_dob
              ? dayjs(editedData.patient_dob)
              : null,
          }}
          onValuesChange={(changed, all) => {
            setEditedData((prev) => {
              const next = { ...prev, ...all };
              if (JSON.stringify(prev) === JSON.stringify(next)) {
                return prev;
              }
              return next;
            });
          }}
        >
          <div className="max-h-[70vh] overflow-y-auto pr-[8px]">
            <h3>1. Personal Information</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item name="patientName" label="Patient Name">
                <Input placeholder="Enter Patient Name" autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="profile_photo"
                label="Profile Photo"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  Array.isArray(e) ? e : e && e.fileList
                }
              >
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Upload Photo</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="age" label="Age">
                <Input placeholder="Enter Age" autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="patientEmail"
                label="Patient Email Address"
                rules={[{ type: "email", message: "Invalid email" }]}
              >
                <Input
                  placeholder="Enter Email Address"
                  type="email"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name="country_code" label="Country">
                <Select
                  showSearch
                  placeholder="Select Country"
                  options={countryOptions}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
              <Form.Item name="patientPhone" label="Patient Phone Number">
                <Input
                  placeholder="Enter Patient Phone Number"
                  type="tel"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name="bp" label="Blood Pressure">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Blood Pressure or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="heartRate" label="Heart Rate">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Heart Rate or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="sugar" label="Blood Sugar">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Blood Sugar or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="oxygen" label="Oxygen">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Oxygen or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="temperature" label="Temperature">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Temperature or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="respiratoryRate" label="Respiratory Rate">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Respiratory Rate or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="height" label="Height">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Height or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="weight" label="Weight">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Weight or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="patient_dob" label="Date of Birth">
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item name="patient_gender" label="Gender">
                <Select className="w-full" options={GENDER_OPTIONS} />
              </Form.Item>
              <Form.Item name="blood_group" label="Blood Group">
                <Select
                  className="w-full"
                  placeholder="Select Blood Group"
                  options={BLOOD_GROUP_OPTIONS}
                />
              </Form.Item>
              <Form.Item name="patient_home_address" label="Home Address">
                <Input placeholder="Enter address" autoComplete="off" />
              </Form.Item>
              <Form.Item name="primary_language" label="Primary Language">
                <Input placeholder="e.g. English" autoComplete="off" />
              </Form.Item>
              <Form.Item name="religion" label="Religion">
                <Input placeholder="Enter religion" autoComplete="off" />
              </Form.Item>

              <Form.Item
                name="escalate_to_physician"
                label="Escalate to Physician"
              >
                <Select
                  placeholder="Select"
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                />
              </Form.Item>
            </div>

            <h3>2. Emergency Contact</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item name="emer_con_name" label="Full Name">
                <Input placeholder="Enter name" autoComplete="off" />
              </Form.Item>
              <Form.Item name="emer_con_relation" label="Relationship">
                <Input placeholder="e.g. Spouse" autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="emer_con_coun_of_residen"
                label="Country of Residence"
              >
                <Input placeholder="Enter country" autoComplete="off" />
              </Form.Item>
              <Form.Item name="emer_con_country_code" label="Country">
                <Select
                  showSearch
                  options={countryOptions}
                  placeholder="Select Country"
                />
              </Form.Item>
              <Form.Item name="emer_con_phone" label="Phone">
                <Input placeholder="Enter phone" autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="emer_con_email"
                label="Email"
                rules={[{ type: "email", message: "Invalid email" }]}
              >
                <Input placeholder="Enter email" autoComplete="off" />
              </Form.Item>
            </div>

            <h3>3. Local Contact (if different)</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item name="local_con_name" label="Full Name">
                <Input
                  placeholder="Enter local contact name"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name="local_con_relation" label="Relationship">
                <Input placeholder="e.g. Friend" autoComplete="off" />
              </Form.Item>
              <Form.Item name="local_con_country_code" label="Country">
                <Select
                  showSearch
                  placeholder="Select Country"
                  options={countryOptions}
                />
              </Form.Item>
              <Form.Item name="local_con_phone" label="Phone">
                <Input placeholder="Enter phone" autoComplete="off" />
              </Form.Item>
            </div>

            <h3>4. Medical History</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item name="medical_his_diagnosis" label="Diagnosis">
                <Input.TextArea placeholder="Enter diagnosis" />
              </Form.Item>
              <Form.Item name="medical_his_cancer" label="Cancer History">
                <Select
                  className="w-full"
                  placeholder="Select cancer history"
                  options={YES_NO_NOT_KNOWN_OPTIONS}
                />
              </Form.Item>
              <Form.Item name="medical_his_other" label="Other Medical History">
                <Input placeholder="Other medical history" autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="medical_his_provided_medi_care"
                label="Medical Care Provided"
              >
                <Input placeholder="Medical Care Provided" autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="medical_his_major_surgeries"
                label="Major Surgeries"
              >
                <Input placeholder="Enter major surgeries" autoComplete="off" />
              </Form.Item>
              <Form.Item name="medical_his_curr_symp" label="Current Symptoms">
                <Input.TextArea placeholder="Enter current symptoms" />
              </Form.Item>
              <Form.Item
                name="last_doctor_visit"
                label="Last Doctor / Hospital Visit"
              >
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 2 months ago, June 2024, or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="has_regular_doctor"
                label="Do you have a doctor you see regularly?"
              >
                <Select
                  className="w-full"
                  placeholder="Select Yes, No, or Not Known"
                  options={YES_NO_NOT_KNOWN_OPTIONS}
                />
              </Form.Item>
              <Form.Item
                name="regular_doctor_name"
                label="Regular Doctor's Name & Contact Info"
              >
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter doctor's name, clinic, or contact details"
                  allowClear
                />
              </Form.Item>
            </div>

            <h3>5. Medications</h3>
            <>
              {medications.map((med, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr] gap-[16px] mb-[20px] border-b-[1px] border-solid border-[#eee] pb-[15px]"
                >
                  <div>
                    <label>Medication Name</label>
                    <Input
                      placeholder="Medication name"
                      autoComplete="off"
                      value={med.medication_name}
                      onChange={(e) => {
                        const newMeds = [...medications];
                        newMeds[index].medication_name = e.target.value;
                        setMedications(newMeds);
                      }}
                    />
                  </div>
                  <div>
                    <label>Dose</label>
                    <Input
                      placeholder="Dose"
                      autoComplete="off"
                      value={med.medication_dose}
                      onChange={(e) => {
                        const newMeds = [...medications];
                        newMeds[index].medication_dose = e.target.value;
                        setMedications(newMeds);
                      }}
                    />
                  </div>
                  <div>
                    <label>Frequency</label>
                    <Input
                      placeholder="Frequency"
                      autoComplete="off"
                      value={med.medication_frequency}
                      onChange={(e) => {
                        const newMeds = [...medications];
                        newMeds[index].medication_frequency = e.target.value;
                        setMedications(newMeds);
                      }}
                    />
                  </div>
                  <div>
                    <label>Reason</label>
                    <Input
                      placeholder="Reason for medication"
                      autoComplete="off"
                      value={med.medication_reason}
                      onChange={(e) => {
                        const newMeds = [...medications];
                        newMeds[index].medication_reason = e.target.value;
                        setMedications(newMeds);
                      }}
                    />
                  </div>
                  <div>
                    <label>Medication Issues?</label>
                    <Radio.Group
                      value={med.medication_issues ? "yes" : "no"}
                      onChange={(e) => {
                        const newMeds = [...medications];
                        newMeds[index].medication_issues =
                          e.target.value === "yes";
                        setMedications(newMeds);
                      }}
                    >
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </div>
                  <div>
                    <label>Explain Issues</label>
                    <Input.TextArea
                      placeholder="Explain medication issues"
                      value={med.medication_issues_explain}
                      onChange={(e) => {
                        const newMeds = [...medications];
                        newMeds[index].medication_issues_explain =
                          e.target.value;
                        setMedications(newMeds);
                      }}
                    />
                  </div>
                  {medications.length > 1 && (
                    <div className="text-right">
                      <Button
                        danger
                        onClick={() => {
                          const newMeds = medications.filter(
                            (_, i) => i !== index,
                          );
                          setMedications(newMeds);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <div className="text-right">
                <Button
                  type="dashed"
                  onClick={() =>
                    setMedications([
                      ...medications,
                      {
                        medication_name: "",
                        medication_dose: "",
                        medication_frequency: "",
                        medication_reason: "",
                        medication_issues: false,
                        medication_issues_explain: "",
                      },
                    ])
                  }
                >
                  + Add Medication
                </Button>
              </div>
            </>

            <h3>6. Allergies</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item name="allergies_issues" label="Allergies to Drugs?">
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="allergies_drug" label="Drug Allergies">
                <Input placeholder="Enter drug allergies" autoComplete="off" />
              </Form.Item>
              <Form.Item name="allergies_food" label="Food Allergies">
                <Input placeholder="Enter food allergies" autoComplete="off" />
              </Form.Item>
            </div>

            <h3>7. Functional Status</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item name="functional_bathe" label="Bathing">
                <Input
                  placeholder="Can the patient bathe independently?"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name="functional_dress" label="Dressing">
                <Input
                  placeholder="Can the patient dress independently?"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name="functional_eat" label="Eating">
                <Input
                  placeholder="Can the patient eat independently?"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name="functional_walk" label="Walking">
                <Input
                  placeholder="Can the patient walk independently?"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name="functional_use_bathroom" label="Use Bathroom">
                <Input
                  placeholder="Can the patient use bathroom independently?"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                name="functional_daily_activity"
                label="Daily Activity"
              >
                <Input
                  placeholder="Can the patient manage daily activity?"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                name="functional_manage_finance"
                label="Manage Finance"
              >
                <Input
                  placeholder="Can the patient manage finances?"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item name="functional_any_falls" label="Any Falls?">
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="functional_how_many" label="How Many?">
                <Input placeholder="Number of falls" autoComplete="off" />
              </Form.Item>
              <Form.Item name="functional_memory_pbms" label="Memory Problems?">
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <h3>8. Lifestyle</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item name="lifestyle_daily_routine" label="Daily Routine">
                <Input.TextArea placeholder="Describe daily routine" />
              </Form.Item>
              <Form.Item name="lifestyle_dietary_habits" label="Dietary Habits">
                <Input placeholder="Dietary habits" autoComplete="off" />
              </Form.Item>
              <Form.Item name="lifestyle_sleep_quality" label="Sleep Quality">
                <Input placeholder="Sleep quality" autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="lifestyle_physical_activity"
                label="Physical Activity"
              >
                <Input placeholder="Physical activity" autoComplete="off" />
              </Form.Item>
              <Form.Item name="lifestyle_alcohol_use" label="Alcohol Use">
                <Input placeholder="Alcohol use" autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="lifestyle_pain_complaints"
                label="Pain Complaints"
              >
                <Input placeholder="Pain complaints" autoComplete="off" />
              </Form.Item>
              <Form.Item name="lifestyle_pain_where" label="Pain Location">
                <Input placeholder="Pain location" autoComplete="off" />
              </Form.Item>
            </div>

            <h3>9. Social & Emotional</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item
                name="social_emotion_health"
                label="Social / Emotional Health"
              >
                <Input.TextArea placeholder="Social / Emotional Health" />
              </Form.Item>
              <Form.Item name="social_spiritual_needs" label="Spiritual Needs">
                <Input.TextArea placeholder="Spiritual needs" />
              </Form.Item>
              <Form.Item name="social_trusted_person" label="Trusted Person?">
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="social_name" label="Trusted Person Name">
                <Input placeholder="Trusted person name" autoComplete="off" />
              </Form.Item>
            </div>

            <h3>10. Goals</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item name="goals_family_hope" label="Family Hopes">
                <Input.TextArea placeholder="Family hopes / goals" />
              </Form.Item>
              <Form.Item
                name="goals_special_instructions"
                label="Special Instructions"
              >
                <Input.TextArea placeholder="Special instructions" />
              </Form.Item>
            </div>

            <h3 className="text-black font-semibold border-b-[1px] border-solid border-[#ddd] pb-[4px] mt-[12px]">
              11. Upload Files
            </h3>
            <Upload
              multiple
              fileList={editedData.patient_upload_files || []}
              beforeUpload={(file) => {
                const newFile = {
                  uid: file.uid,
                  name: file.name,
                  status: "done",
                  originFileObj: file,
                };
                setEditedData({
                  ...editedData,
                  patient_upload_files: [
                    ...(editedData.patient_upload_files || []),
                    newFile,
                  ],
                });
                return false;
              }}
              onRemove={(file) => {
                setEditedData({
                  ...editedData,
                  patient_upload_files: (
                    editedData.patient_upload_files || []
                  ).filter((f) => f.uid !== file.uid),
                });
              }}
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>

            <Form.Item
              name="accept_terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) => {
                    const domChecked =
                      document.getElementById("accept_terms")?.checked;
                    if (value || domChecked) {
                      if (!value && domChecked) {
                        form.setFieldsValue({ accept_terms: true });
                      }
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "You must accept the terms to continue",
                    );
                  },
                },
              ]}
            >
              <Checkbox className="mt-[20px]">
                I agree to the{" "}
                <a
                  href="https://verimed.care/consent-of-care"
                  target="_blank"
                  rel="noreferrer"
                >
                  Consent of Care
                </a>
                ,{" "}
                <a
                  href="https://verimed.care/patient-family-bill-of-rights"
                  target="_blank"
                  rel="noreferrer"
                >
                  Patient & Family Bill of Rights
                </a>{" "}
                and{" "}
                <a
                  href="https://verimed.care/hipaa-release-privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  HIPAA Release & Privacy Statement
                </a>
                .
              </Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Enrollment Successful"
        open={isSuccessModalVisible}
        onCancel={() => setIsSuccessModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsSuccessModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="details"
            type="primary"
            onClick={() => {
              setIsSuccessModalVisible(false);
              setIsSecondModalVisible(true);
            }}
          >
            View Details
          </Button>,
        ]}
        centered
      >
        {newUser && (
          <div className="py-[10px] px-[0px]">
            <p>
              <b>Username:</b> {newUser.username}
            </p>
            <p>
              <b>User ID:</b> {newUser.id}
            </p>
            <p>
              <b>Name:</b> {newUser.first_name} {newUser.last_name}
            </p>
            <p>
              <b>Email:</b> {newUser.email}
            </p>
            <p>
              <b>Phone:</b> {newUser.phone}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
