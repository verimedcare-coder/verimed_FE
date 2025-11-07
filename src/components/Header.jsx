import React, { useEffect, useState } from "react";
import {
  Layout,
  Select,
  Input,
  Button,
  Space,
  Tooltip,
  Dropdown,
  Menu,
  Modal,
  Avatar,
  Form,
  Upload,
  message,
  Checkbox,
  Radio,
  DatePicker,
  Spin,
} from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import flagIcon from "../assets/icons/flag.svg";
import Primarybtn from "./PrimaryBtn";
import { useNavigate } from "react-router-dom";
import { base_url } from "../constants/constants";
import dayjs from "dayjs";

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
    >
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
          Enroll Patient
        </Button>
      </Form.Item>
    </Form>
  );
};

export default function HeaderComponent() {
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
  const [caretakerList, setCaretakerList] = useState([]);
  const openModal = () => setIsModalVisible(true);
  const navigate = useNavigate();

  // Country options for dropdowns (fetched from API)
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Replace with your actual country API endpoint
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );
        // Map API response to { label, value } format
        const options = res.data
          .map((country) => ({
            label: country.name.common,
            value: country.cca2,
          }))
          .filter((c) => c.value && c.label)
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountryOptions(options);
        console.log("Fetched countries:", options);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };
    fetchCountries();
  }, []);

  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  const token = localStorage.getItem("token");

  const handleLanguageChange = (lang) => setLanguage(lang);

  const careTakerPatients = JSON.parse(
    localStorage.getItem("careTakerPatients")
  );

  const items = [
    { key: "1", label: "Enroll Yourself" },
    { key: "2", label: "Enroll Your Loved One" },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      setIsSecondModalVisible(true);
    } else if (e.key === "2") {
      setIsSecondModalVisible(true);
    }
  };

  const languageMenu = (
    <Menu
      onClick={(e) => handleLanguageChange(e.key)}
      items={[
        { key: "EN", label: "English" },
        { key: "FR", label: "French" },
        { key: "ES", label: "Spanish" },
        { key: "DE", label: "German" },
      ]}
    />
  );

  const handleLogout = () => {
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
      const storedAppointments = JSON.parse(
        localStorage.getItem("sponsorAppointments") || "[]"
      );
      const sponsorPatientData = JSON.parse(
        localStorage.getItem("sponsorPatientData") || "[]"
      );

      const patientAppointments = storedAppointments.filter(
        (item) => item?.patient?.user?.id === patientId
      );

      let patientDetails = null;

      if (patientAppointments.length > 0) {
        patientDetails = patientAppointments[0]?.patient?.user;
        localStorage.setItem(
          "selectedPatientAppointments",
          JSON.stringify(patientAppointments)
        );
      } else {
        localStorage.removeItem("selectedPatientAppointments");
        const match = sponsorPatientData.find((p) => p?.user?.id === patientId);
        if (match) {
          patientDetails = match.user;
        }
      }

      if (patientDetails) {
        localStorage.setItem(
          "selectedPatientDetails",
          JSON.stringify(patientDetails)
        );
      } else {
        localStorage.removeItem("selectedPatientDetails");
      }
    } catch (error) {
      console.error("Error retrieving patient details:", error);
    }
  };

  // const handlePatientChange = (value) => {
  //   setSelectedPatient(value);
  //   localStorage.setItem("selectedPatientId", value);
  //   showPatientDetails(value);
  //   const selectedPatientObj = patients.find((p) => p.id === value);
  //   if (selectedPatientObj) {
  //     localStorage.setItem(
  //       "selectedPatientData",
  //       JSON.stringify(selectedPatientObj)
  //     );
  //   } else {
  //     localStorage.removeItem("selectedPatientData");
  //   }
  // };

  const handlePatientChange = (value) => {
    setSelectedPatient(value);
    localStorage.setItem("selectedPatientId", value);

    // Ensure type-safe comparison for patient IDs
    let selectedPatientObj = null;
    let selectedSource = null;
    if (
      Array.isArray(patients) &&
      patients.some((p) => String(p.id) === String(value))
    ) {
      selectedPatientObj = patients.find((p) => String(p.id) === String(value));
      selectedSource = "patients";
    } else if (
      Array.isArray(careTakerPatients) &&
      careTakerPatients.some((p) => String(p.id) === String(value))
    ) {
      selectedPatientObj = careTakerPatients.find(
        (p) => String(p.id) === String(value)
      );
      selectedSource = "careTakerPatients";
    }

    if (selectedPatientObj) {
      localStorage.setItem(
        "selectedPatientData",
        JSON.stringify(selectedPatientObj)
      );
      localStorage.setItem("selectedPatientSource", selectedSource);
      showPatientDetails(value);
    } else {
      localStorage.removeItem("selectedPatientData");
      localStorage.removeItem("selectedPatientSource");
    }

    setEditedData(selectedPatientObj || {});
  };

  const fetchSponsorPatients = async () => {
    try {
      const endpoint = `${base_url}/sponsorid_patientprofile_list/`;
      const headers = {
        Authorization: `Token ${token}`,
      };
      const payload = {
        sponsorid: localStorage.getItem("sponsorProfileId"),
      };
      const res = await axios.post(endpoint, payload, { headers });
      const fetchedPatients = res.data || [];
      setPatients(fetchedPatients);

      if (fetchedPatients.length > 0) {
        // Check for previous selection in localStorage
        const storedSelectedId = localStorage.getItem("selectedPatientId");
        let foundPatient = null;
        if (storedSelectedId) {
          foundPatient = fetchedPatients.find(
            (p) => String(p.id) === String(storedSelectedId)
          );
        }
        if (foundPatient) {
          setSelectedPatient(String(foundPatient.id));
          localStorage.setItem("selectedPatientId", String(foundPatient.id));
          localStorage.setItem(
            "selectedPatientData",
            JSON.stringify(foundPatient)
          );
          showPatientDetails(foundPatient.id);
        } else {
          // No previous selection, set first patient
          const firstPatientId = String(fetchedPatients[0].id);
          setSelectedPatient(firstPatientId);
          localStorage.setItem("selectedPatientId", firstPatientId);
          localStorage.setItem(
            "selectedPatientData",
            JSON.stringify(fetchedPatients[0])
          );
          showPatientDetails(firstPatientId);
        }
      }
    } catch (error) {
      console.log("Error fetching sponsor patients:", error);
    }
  };

  useEffect(() => {
    fetchSponsorPatients();
  }, []);

  const fetchCareTakerList = async () => {
    try {
      setLoading(true);
      const endpoint = `${base_url}/caretakerprofile_list/`;

      const res = await axios.get(endpoint);

      setCaretakerList(res.data || []);
    } catch (error) {
      console.error("Error fetching caretaker list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareTakerList();
  }, []);

  useEffect(() => {
    fetchCareTakerList();
  }, []);

  const handleEnrollSubmit = async (values) => {
    try {
      const user_signup = {
        first_name: values.first_name,
        last_name: values.last_name,
        role: "sponsor",
        email: values.email,
        countrycode: "IN",
        phone: values.phone,
        password: values.password,
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

      const userViewRes = await axios.get(`${base_url}/user_view/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const allUsers = userViewRes.data;
      const matchedUser = allUsers.find(
        (u) =>
          u.first_name.toLowerCase() === values.first_name.toLowerCase() &&
          u.last_name.toLowerCase() === values.last_name.toLowerCase() &&
          u.user_role === "sponsor"
      );

      if (!matchedUser) {
        message.warning("User not found after enrollment.");
        return;
      }

      localStorage.setItem("enrolledUsername", matchedUser.username);
      console.log("Username:", matchedUser.username);

      const profileRes = await axios.get(`${base_url}/patientprofile_list/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const matchedProfile = profileRes.data.find(
        (p) => p.user?.username === matchedUser.username
      );

      if (matchedProfile) {
        console.log(" Sponsor Profile ID:", matchedProfile.id);
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
    }
  };

  const handleUpdateClick = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      const keyName = "patientprofile_data";

      const storedSponsorId = localStorage.getItem("sponsorProfileId");

      const formattedDOB =
        editedData.patient_dob && !isNaN(Date.parse(editedData.patient_dob))
          ? new Date(editedData.patient_dob).toISOString().split("T")[0]
          : "";

      const patientprofile_data = {
        patient_name: editedData.patientName || "",
        age: editedData.age || "",
        email: editedData.patientEmail || "",
        phone: editedData.patientPhone || "",
        country_code: editedData.country_code || "",
        blood_pressure: editedData.bp || "",
        heart_rate: editedData.heartRate || "",
        blood_sugar: editedData.sugar || "",
        oxygen: editedData.oxygen || "",
        temperature: editedData.temperature || "",
        respiratory_rate: editedData.respiratoryRate || "",
        height: editedData.height || "",
        weight: editedData.weight || "",
        sponsorid: storedSponsorId || "",
        caretakerid: editedData.caretakerid || "",
        patient_dob: formattedDOB,
        patient_gender: editedData.patient_gender || "",
        blood_group: editedData.blood_group || "",
        patient_home_address: editedData.patient_home_address || "",
        primary_language: editedData.primary_language || "",
        religion: editedData.religion || "",
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
        medication_issues_explain: editedData.medication_issues_explain || "",
        allergies_issues: editedData.allergies_issues || false,
        allergies_drug: editedData.allergies_drug || "",
        allergies_food: editedData.allergies_food || "",
        functional_bathe: editedData.functional_bathe || "",
        functional_dress: editedData.functional_dress || "",
        functional_eat: editedData.functional_eat || "",
        functional_walk: editedData.functional_walk || "",
        functional_use_bathroom: editedData.functional_use_bathroom || "",
        functional_daily_activity: editedData.functional_daily_activity || "",
        functional_manage_finance: editedData.functional_manage_finance || "",
        functional_any_falls: editedData.functional_any_falls || false,
        functional_how_many: editedData.functional_how_many || "",
        functional_memory_pbms: editedData.functional_memory_pbms || false,
        lifestyle_daily_routine: editedData.lifestyle_daily_routine || "",
        lifestyle_dietary_habits: editedData.lifestyle_dietary_habits || "",
        lifestyle_sleep_quality: editedData.lifestyle_sleep_quality || "",
        lifestyle_physical_activity:
          editedData.lifestyle_physical_activity || "",
        lifestyle_alcohol_use: editedData.lifestyle_alcohol_use || "",
        lifestyle_pain_complaints: editedData.lifestyle_pain_complaints || "",
        lifestyle_pain_where: editedData.lifestyle_pain_where || "",
        social_emotion_health: editedData.social_emotion_health || "",
        social_spiritual_needs: editedData.social_spiritual_needs || "",
        social_trusted_person: editedData.social_trusted_person || false,
        social_name: editedData.social_name || "",
        goals_family_hope: editedData.goals_family_hope || "",
        goals_special_instructions: editedData.goals_special_instructions || "",
        goals_term_membership: editedData.goals_term_membership || "",
      };

      // ✅ Append main JSON
      formData.append(keyName, JSON.stringify(patientprofile_data));

      // ✅ Append uploaded files if present
      if (editedData.patient_upload_files?.length > 0) {
        editedData.patient_upload_files.forEach((file) =>
          formData.append("patient_photo", file)
        );
      }

      // ✅ Append file metadata safely
      if (Array.isArray(editedData.patient_files_name)) {
        formData.append(
          "patient_files_name",
          editedData.patient_files_name.join(",")
        );
      } else if (editedData.patient_files_name) {
        formData.append("patient_files_name", editedData.patient_files_name);
      }

      if (Array.isArray(editedData.patient_files_ids)) {
        formData.append(
          "patient_files_ids",
          editedData.patient_files_ids.join(",")
        );
      } else if (editedData.patient_files_ids) {
        formData.append("patient_files_ids", editedData.patient_files_ids);
      }

      // ✅ Make API call
      const endpoint = `${base_url}/patientprofile_create_update/`;
      await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      await fetchSponsorPatients();
      setLoading(false);
      message.success("Patient details updated successfully!");
      setIsSecondModalVisible(false);
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Unable to update patient profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #ddd",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255,255,255,0.6)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin tip="Updating..." size="large" />
          </div>
        )}
        {/* Left Section */}
        <div
          style={{
            display: "flex",
            gap: 8,
            fontSize: 16,
            fontWeight: 700,
            color: "#2E2E2E",
          }}
        >
          <span style={{ fontSize: 18 }}>{user?.username} –</span>
          <span style={{ fontSize: 18, marginLeft: 4 }}>
            Welcome Back, {user?.first_name}
          </span>
        </div>

        {/* Right Section */}
        <Space size="middle" align="center">
          {/* Patient dropdown */}
          {/* <Select
            value={selectedPatient}
            onChange={handlePatientChange}
            style={{ width: 200, borderRadius: 6 }}
            placeholder="Select Patient"
          >
            {(Array.isArray(patients) && patients.length > 0
              ? patients
              : Array.isArray(careTakerPatients) && careTakerPatients.length > 0
              ? careTakerPatients
              : []
            ).map((p) => (
              <Option key={p.id} value={p.id}>
                {careTakerPatients ? p?.patient?.patient_name : p?.patient_name}
              </Option>
            ))}
          </Select> */}
          {user.user_role === "sponsor" && (
            <Select
              value={selectedPatient}
              onChange={handlePatientChange}
              style={{ width: 220, borderRadius: 6 }}
              placeholder="Select Patient"
              optionLabelProp="label"
            >
              {Array.isArray(patients) && patients.length > 0
                ? patients.map((p) => (
                    <Option key={p.id} value={p.id} label={p.patient_name}>
                      {p.patient_name}
                    </Option>
                  ))
                : Array.isArray(careTakerPatients) &&
                  careTakerPatients.length > 0
                ? careTakerPatients.map((p) => (
                    <Option
                      key={p.id}
                      value={p.id}
                      label={p.patient?.patient_name}
                    >
                      {p.patient?.patient_name}
                    </Option>
                  ))
                : null}
            </Select>
          )}

          {/* 🟩 Enroll Loved One */}
          {user.user_role === "sponsor" && (
            <Dropdown
              menu={{ items, onClick: handleMenuClick }}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <Primarybtn name="Enroll Patient" />
            </Dropdown>
          )}

          {/* <Input placeholder="Search"
           prefix={<SearchOutlined />} 
          style={{ width: 160, 
          borderRadius: 6,
           backgroundColor: "#F3F5F8", 
           borderColor: "rgba(0,0,0,0.08)", }} 
           allowClear /> */}

          <Dropdown
            overlay={languageMenu}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 8px",
                cursor: "pointer",
              }}
            >
              <img
                src={flagIcon}
                alt="Flag"
                style={{ width: 20, height: 20 }}
              />
              <span style={{ fontSize: 14, color: "#2E2E2E" }}>{language}</span>
              <DownOutlined style={{ fontSize: 12, color: "#2E2E2E" }} />
            </div>
          </Dropdown>

          {/* <Tooltip title="Notifications">
            {" "}
            <Badge dot={unreadCount > 0} offset={[-2, 2]}>
              {" "}
              <Button
                shape="circle"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                style={{
                  backgroundColor: "#F3F5F8",
                  borderColor: "rgba(0,0,0,0.08)",
                  borderRadius: 8,
                }}
              />{" "}
            </Badge>{" "}
          </Tooltip> */}

          <Tooltip title="Logout">
            <Button
              shape="circle"
              icon={
                <LogoutOutlined style={{ color: "#FF4545", fontSize: 18 }} />
              }
              style={{
                backgroundColor: "#FF45451F",
                borderColor: "#FF4545",
                borderRadius: 8,
              }}
              onClick={handleLogout}
            />
          </Tooltip>
        </Space>
      </Header>

      {/* <Modal
        open={isModalVisible}
        title="Enroll Loved One"
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <UserForm onFinish={handleEnrollSubmit} />
      </Modal> */}

      {/* patient update */}
      <Modal
        title="Create Patient Details"
        open={isSecondModalVisible}
        onCancel={() => setIsSecondModalVisible(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setIsSecondModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdateClick}>
            Create
          </Button>,
        ]}
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 8 }}>
          {/* ---------- SECTION 1: PERSONAL INFORMATION ---------- */}
          <h3 style={sectionTitle}>1. Personal Information</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Patient Name</label>
              <Input
                placeholder="Enter Patient Name"
                value={editedData.patientName}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    patientName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Age</label>
              <Input
                placeholder="Enter Age"
                value={editedData.age}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    age: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Patient Email Address</label>
              <Input
                placeholder="Enter Email Address"
                type="email"
                value={editedData.patientEmail}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    patientEmail: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Country</label>
              <Select
                showSearch
                placeholder="Select Country"
                value={editedData.country_code}
                onChange={(val) =>
                  setEditedData({ ...editedData, country_code: val })
                }
                options={countryOptions}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Patient Phone Number</label>
              <Input
                placeholder="Enter Patient Phone Number"
                type="tel"
                value={editedData.patientPhone}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    patientPhone: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Blood Pressure</label>
              <Input
                placeholder="Enter Blood Pressure"
                value={editedData.bp}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    bp: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Heart Rate</label>
              <Input
                placeholder="Enter Heart Rate"
                value={editedData.heartRate}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    heartRate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Blood Sugar</label>
              <Input
                placeholder="Enter Blood Sugar"
                value={editedData.sugar}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    sugar: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Oxygen</label>
              <Input
                placeholder="Enter Oxygen"
                value={editedData.oxygen}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    oxygen: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Temperature</label>
              <Input
                placeholder="Enter Temperature"
                value={editedData.temperature}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    temperature: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Respiratory Rate</label>
              <Input
                placeholder="Enter Respiratory Rate"
                value={editedData.respiratoryRate}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    respiratoryRate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Height</label>
              <Input
                placeholder="Enter Height"
                value={editedData.height}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    height: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Weight</label>
              <Input
                placeholder="Enter Weight"
                value={editedData.weight}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    weight: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <DatePicker
                style={{ width: "100%" }}
                value={
                  editedData.patient_dob ? dayjs(editedData.patient_dob) : null
                }
                onChange={(date) =>
                  setEditedData({
                    ...editedData,
                    patient_dob: date ? date.format("YYYY-MM-DD") : "",
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Gender</label>
              <Select
                placeholder="Select gender"
                value={editedData.patient_gender}
                onChange={(val) =>
                  setEditedData({ ...editedData, patient_gender: val })
                }
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
            </div>

            <div>
              <label style={labelStyle}>Blood Group</label>
              <Select
                placeholder="Select blood group"
                value={editedData.blood_group}
                onChange={(val) =>
                  setEditedData({ ...editedData, blood_group: val })
                }
                options={[
                  { label: "A+", value: "A+" },
                  { label: "A−", value: "A−" },
                  { label: "B+", value: "B+" },
                  { label: "B−", value: "B−" },
                  { label: "AB+", value: "AB+" },
                  { label: "AB−", value: "AB−" },
                  { label: "O+", value: "O+" },
                  { label: "O−", value: "O−" },
                ]}
              />
            </div>

            <div>
              <label style={labelStyle}>Home Address</label>
              <Input
                placeholder="Enter address"
                value={editedData.patient_home_address}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    patient_home_address: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Primary Language</label>
              <Input
                placeholder="e.g. English"
                value={editedData.primary_language}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    primary_language: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Religion</label>
              <Input
                placeholder="Enter religion"
                value={editedData.religion}
                onChange={(e) =>
                  setEditedData({ ...editedData, religion: e.target.value })
                }
              />
            </div>

            {/* <div>
              <label style={labelStyle}>Escalate to Physician?</label>
              <Radio.Group
                value={editedData.escalate_to_physician}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    escalate_to_physician: e.target.value,
                  })
                }
              >
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </div> */}

            {/* <div>
              <label style={labelStyle}>Escalate to Physician?</label>
              <Radio.Group
                value={editedData.escalate_to_physician}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    escalate_to_physician: e.target.value,
                  })
                }
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </div> */}

            {/* <div>
              <label style={labelStyle}>Caretaker</label>
              <Select
                placeholder="Select caretaker"
                value={editedData.caretakerid}
                onChange={(val) =>
                  setEditedData({ ...editedData, caretakerid: val })
                }
              >
                {caretakerList.map((ct) => (
                  <Select.Option key={ct.id} value={ct.id}>
                    {ct.caretaker_id}
                  </Select.Option>
                ))}
              </Select>
            </div> */}
          </div>

          {/* ---------- SECTION 2: EMERGENCY CONTACT ---------- */}
          <h3 style={sectionTitle}>2. Emergency Contact</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <Input
                placeholder="Enter name"
                value={editedData.emer_con_name}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Relationship</label>
              <Input
                placeholder="e.g. Spouse, Child"
                value={editedData.emer_con_relation}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_relation: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Country of Residence</label>
              <Input
                placeholder="Enter country"
                value={editedData.emer_con_coun_of_residen}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_coun_of_residen: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Country</label>
              <Select
                showSearch
                placeholder="Select Country"
                value={editedData.emer_con_country_code}
                onChange={(val) =>
                  setEditedData({
                    ...editedData,
                    emer_con_country_code: val,
                  })
                }
                options={countryOptions}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <Input
                placeholder="Enter phone"
                value={editedData.emer_con_phone}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_phone: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <Input
                placeholder="Enter email"
                value={editedData.emer_con_email}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_email: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ---------- SECTION 3: LOCAL CONTACT ---------- */}
          <h3 style={sectionTitle}>3. Local Contact (if different)</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <Input
                placeholder="Enter local contact name"
                value={editedData.local_con_name}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    local_con_name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Relationship</label>
              <Input
                placeholder="e.g. Friend, Neighbor"
                value={editedData.local_con_relation}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    local_con_relation: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Country</label>
              <Select
                showSearch
                placeholder="Select Country"
                value={editedData.local_con_country_code}
                onChange={(val) =>
                  setEditedData({
                    ...editedData,
                    local_con_country_code: val,
                  })
                }
                options={countryOptions}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <Input
                placeholder="Enter phone"
                value={editedData.local_con_phone}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    local_con_phone: e.target.value,
                  })
                }
              />
            </div>
          </div>
          {/* ---------- SECTION 4: MEDICAL HISTORY ---------- */}
          <h3 style={sectionTitle}>4. Medical History</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Diagnosis</label>
              <Input.TextArea
                placeholder="Enter diagnosis"
                value={editedData.medical_his_diagnosis}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_diagnosis: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Cancer History</label>
              <Input
                placeholder="Enter cancer history"
                value={editedData.medical_his_cancer}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_cancer: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Other Medical History</label>
              <Input
                placeholder="Other medical history"
                value={editedData.medical_his_other}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_other: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Medical Care Provided</label>
              <Input
                placeholder="Medical Care Provided"
                value={editedData.medical_his_provided_medi_care}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_provided_medi_care: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Major Surgeries</label>
              <Input
                placeholder="Enter major surgeries"
                value={editedData.medical_his_major_surgeries}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_major_surgeries: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Current Symptoms</label>
              <Input.TextArea
                placeholder="Enter current symptoms"
                value={editedData.medical_his_curr_symp}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_curr_symp: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ---------- SECTION 5: MEDICATIONS ---------- */}
          <h3 style={sectionTitle}>5. Medications</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Medication Name</label>
              <Input
                placeholder="Medication name"
                value={editedData.medication_name}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Dose</label>
              <Input
                placeholder="Dose"
                value={editedData.medication_dose}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_dose: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Frequency</label>
              <Input
                placeholder="Frequency"
                value={editedData.medication_frequency}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_frequency: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Reason</label>
              <Input
                placeholder="Reason for medication"
                value={editedData.medication_reason}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_reason: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Medication Issues?</label>
              <Radio.Group
                value={
                  editedData.medication_issues === true
                    ? "yes"
                    : editedData.medication_issues === false
                    ? "no"
                    : ""
                }
                onChange={(e) => {
                  setEditedData({
                    ...editedData,
                    medication_issues: e.target.value === "yes",
                  });
                }}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </div>

            <div>
              <label style={labelStyle}>Explain Issues</label>
              <Input.TextArea
                placeholder="Explain medication issues"
                value={editedData.medication_issues_explain}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_issues_explain: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ---------- SECTION 6: ALLERGIES ---------- */}
          <h3 style={sectionTitle}>6. Allergies</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Allergies to Drugs?</label>
              <Radio.Group
                value={
                  editedData.allergies_issues === true
                    ? "yes"
                    : editedData.allergies_issues === false
                    ? "no"
                    : ""
                }
                onChange={(e) => {
                  setEditedData({
                    ...editedData,
                    allergies_issues: e.target.value === "yes",
                  });
                }}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </div>

            <div>
              <label style={labelStyle}>Drug Allergies</label>
              <Input
                placeholder="Enter drug allergies"
                value={editedData.allergies_drug}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    allergies_drug: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Food Allergies</label>
              <Input
                placeholder="Enter food allergies"
                value={editedData.allergies_food}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    allergies_food: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ---------- SECTION 7: FUNCTIONAL STATUS ---------- */}
          <h3 style={sectionTitle}>7. Functional Status</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Bathing</label>
              <Input
                placeholder="Can the patient bathe independently?"
                value={editedData.functional_bathe}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    functional_bathe: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Dressing</label>
              <Input
                placeholder="Can the patient dress independently?"
                value={editedData.functional_dress}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    functional_dress: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Eating</label>
              <Input
                placeholder="Can the patient eat independently?"
                value={editedData.functional_eat}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    functional_eat: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Walking</label>
              <Input
                placeholder="Can the patient walk independently?"
                value={editedData.functional_walk}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    functional_walk: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Use Bathroom</label>
              <Input
                placeholder="Can the patient use bathroom independently?"
                value={editedData.functional_use_bathroom}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    functional_use_bathroom: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Daily Activity</label>
              <Input
                placeholder="Can the patient manage daily activity?"
                value={editedData.functional_daily_activity}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    functional_daily_activity: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Manage Finance</label>
              <Input
                placeholder="Can the patient manage finances?"
                value={editedData.functional_manage_finance}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    functional_manage_finance: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Any Falls?</label>
              <Radio.Group
                value={
                  editedData.functional_any_falls === true
                    ? "yes"
                    : editedData.functional_any_falls === false
                    ? "no"
                    : ""
                }
                onChange={(e) => {
                  setEditedData({
                    ...editedData,
                    functional_any_falls: e.target.value === "yes",
                  });
                }}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </div>

            <div>
              <label style={labelStyle}>How Many?</label>
              <Input
                placeholder="Number of falls"
                value={editedData.functional_how_many}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    functional_how_many: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Memory Problems?</label>
              <Radio.Group
                value={
                  editedData.functional_memory_pbms === true
                    ? "yes"
                    : editedData.functional_memory_pbms === false
                    ? "no"
                    : ""
                }
                onChange={(e) => {
                  setEditedData({
                    ...editedData,
                    functional_memory_pbms: e.target.value === "yes",
                  });
                }}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </div>
          </div>
          {/* ---------- SECTION 8: LIFESTYLE ---------- */}
          <h3 style={sectionTitle}>8. Lifestyle</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Daily Routine</label>
              <Input.TextArea
                placeholder="Describe daily routine"
                value={editedData.lifestyle_daily_routine}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_daily_routine: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Dietary Habits</label>
              <Input
                placeholder="Dietary habits"
                value={editedData.lifestyle_dietary_habits}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_dietary_habits: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Sleep Quality</label>
              <Input
                placeholder="Sleep quality"
                value={editedData.lifestyle_sleep_quality}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_sleep_quality: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Physical Activity</label>
              <Input
                placeholder="Physical activity"
                value={editedData.lifestyle_physical_activity}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_physical_activity: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Alcohol Use</label>
              <Input
                placeholder="Alcohol use"
                value={editedData.lifestyle_alcohol_use}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_alcohol_use: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Pain Complaints</label>
              <Input
                placeholder="Pain complaints"
                value={editedData.lifestyle_pain_complaints}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_pain_complaints: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Pain Location</label>
              <Input
                placeholder="Pain location"
                value={editedData.lifestyle_pain_where}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_pain_where: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ---------- SECTION 9: SOCIAL & EMOTIONAL ---------- */}
          <h3 style={sectionTitle}>9. Social & Emotional</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Social / Emotional Health</label>
              <Input.TextArea
                placeholder="Social / Emotional Health"
                value={editedData.social_emotion_health}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    social_emotion_health: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Spiritual Needs</label>
              <Input.TextArea
                placeholder="Spiritual needs"
                value={editedData.social_spiritual_needs}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    social_spiritual_needs: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Trusted Person?</label>
              <Radio.Group
                value={
                  editedData.social_trusted_person === true
                    ? "yes"
                    : editedData.social_trusted_person === false
                    ? "no"
                    : ""
                }
                onChange={(e) => {
                  setEditedData({
                    ...editedData,
                    social_trusted_person: e.target.value === "yes",
                  });
                }}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </div>

            <div>
              <label style={labelStyle}>Trusted Person Name</label>
              <Input
                placeholder="Trusted person name"
                value={editedData.social_name}
                onChange={(e) =>
                  setEditedData({ ...editedData, social_name: e.target.value })
                }
              />
            </div>
          </div>

          {/* ---------- SECTION 10: GOALS ---------- */}
          <h3 style={sectionTitle}>10. Goals</h3>
          <div style={twoColGrid}>
            <div>
              <label style={labelStyle}>Family Hopes</label>
              <Input.TextArea
                placeholder="Family hopes / goals"
                value={editedData.goals_family_hope}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    goals_family_hope: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Special Instructions</label>
              <Input.TextArea
                placeholder="Special instructions"
                value={editedData.goals_special_instructions}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    goals_special_instructions: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Term Membership</label>
              <Input
                placeholder="Term membership"
                value={editedData.goals_term_membership}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    goals_term_membership: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ---------- SECTION 11: FILE UPLOADS ---------- */}
          <h3 style={sectionTitle}>11. Upload Files</h3>
          <Upload
            multiple
            beforeUpload={(file) => {
              setEditedData({
                ...editedData,
                patient_upload_files: [
                  ...(editedData.patient_upload_files || []),
                  file,
                ],
              });
              return false; // prevent auto-upload
            }}
            fileList={editedData.patient_upload_files || []}
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
        </div>
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
          <div style={{ padding: "10px 0" }}>
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
const twoColGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};
const labelStyle = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 4,
  display: "block",
  color: "#2E2E2E",
};
const sectionTitle = {
  color: "#000",
  fontWeight: 600,
  borderBottom: "1px solid #ddd",
  paddingBottom: 4,
  marginTop: 12,
};
