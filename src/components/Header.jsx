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

  // Country options for dropdowns (fetched from API)
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Replace with your actual country API endpoint
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,cca2",
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
    localStorage.getItem("careTakerPatients"),
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
        localStorage.getItem("sponsorAppointments") || "[]",
      );
      const sponsorPatientData = JSON.parse(
        localStorage.getItem("sponsorPatientData") || "[]",
      );

      const patientAppointments = storedAppointments.filter(
        (item) => item?.patient?.user?.id === patientId,
      );

      let patientDetails = null;

      if (patientAppointments.length > 0) {
        patientDetails = patientAppointments[0]?.patient?.user;
        localStorage.setItem(
          "selectedPatientAppointments",
          JSON.stringify(patientAppointments),
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
          JSON.stringify(patientDetails),
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
        (p) => String(p.id) === String(value),
      );
      selectedSource = "careTakerPatients";
    }

    if (selectedPatientObj) {
      localStorage.setItem(
        "selectedPatientData",
        JSON.stringify(selectedPatientObj),
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
            (p) => String(p.id) === String(storedSelectedId),
          );
        }
        if (foundPatient) {
          setSelectedPatient(String(foundPatient.id));
          localStorage.setItem("selectedPatientId", String(foundPatient.id));
          localStorage.setItem(
            "selectedPatientData",
            JSON.stringify(foundPatient),
          );
          showPatientDetails(foundPatient.id);
        } else {
          // No previous selection, set first patient
          const firstPatientId = String(fetchedPatients[0].id);
          setSelectedPatient(firstPatientId);
          localStorage.setItem("selectedPatientId", firstPatientId);
          localStorage.setItem(
            "selectedPatientData",
            JSON.stringify(fetchedPatients[0]),
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
      console.log("Username:", matchedUser.username);

      const profileRes = await axios.get(`${base_url}/patientprofile_list/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const matchedProfile = profileRes.data.find(
        (p) => p.user?.username === matchedUser.username,
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

      const formattedDOB = editedData.patient_dob
        ? dayjs(editedData.patient_dob).format("YYYY-MM-DD")
        : "";

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

      const patientprofile_data = {
        patient_name: editedData.patientName || "",
        age: editedData.age || "",
        email: editedData.patientEmail || "",
        phone: editedData.patientPhone || "",
        country_code: editedData.country_code || "US",
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
        emer_con_country_code: editedData.emer_con_country_code || "US",
        emer_con_phone: editedData.emer_con_phone || "",
        emer_con_phonewithcountrycode: editedData.emer_con_phone
          ? `${editedData.emer_con_country_code || "US"} ${editedData.emer_con_phone}`
          : "",
        emer_con_email: editedData.emer_con_email || "",
        local_con_name: editedData.local_con_name || "",
        local_con_relation: editedData.local_con_relation || "",
        local_con_country_code: editedData.local_con_country_code || "US",
        local_con_phone: editedData.local_con_phone || "",
        local_con_phonewithcountrycode: editedData.local_con_phone
          ? `${editedData.local_con_country_code || "US"} ${editedData.local_con_phone}`
          : "",
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

      formData.append("medication", JSON.stringify(medicationArray));

      // ✅ Append main JSON
      formData.append(keyName, JSON.stringify(patientprofile_data));

      // ✅ Append uploaded files if present
      if (editedData.patient_upload_files?.length > 0) {
        editedData.patient_upload_files.forEach((file) =>
          formData.append("patient_photo", file.originFileObj),
        );
      }

      // ✅ Append file metadata safely
      if (Array.isArray(editedData.patient_files_name)) {
        formData.append(
          "patient_files_name",
          editedData.patient_files_name.join(","),
        );
      } else if (editedData.patient_files_name) {
        formData.append("patient_files_name", editedData.patient_files_name);
      }

      if (Array.isArray(editedData.patient_files_ids)) {
        formData.append(
          "patient_files_ids",
          editedData.patient_files_ids.join(","),
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
          <Button
            key="update"
            type="primary"
            onClick={() => {
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
          initialValues={{
            ...editedData,
            patient_dob: editedData.patient_dob
              ? dayjs(editedData.patient_dob)
              : null,
          }}
          onValuesChange={(changed, all) => {
            setEditedData({
              ...editedData,
              ...all,
            });
          }}
        >
          <div
            style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 8 }}
          >
            {/* ---------- SECTION 1: PERSONAL INFORMATION ---------- */}
            <h3>1. Personal Information</h3>
            <div style={twoColGrid}>
              <Form.Item name="patientName" label="Patient Name">
                <Input placeholder="Enter Patient Name" />
              </Form.Item>

              <Form.Item name="age" label="Age">
                <Input placeholder="Enter Age" />
              </Form.Item>

              <Form.Item
                name="patientEmail"
                label="Patient Email Address"
                rules={[{ type: "email", message: "Invalid email" }]}
              >
                <Input placeholder="Enter Email Address" type="email" />
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
                <Input placeholder="Enter Patient Phone Number" type="tel" />
              </Form.Item>

              <Form.Item name="bp" label="Blood Pressure">
                <Input placeholder="Enter Blood Pressure" />
              </Form.Item>

              <Form.Item name="heartRate" label="Heart Rate">
                <Input placeholder="Enter Heart Rate" />
              </Form.Item>

              <Form.Item name="sugar" label="Blood Sugar">
                <Input placeholder="Enter Blood Sugar" />
              </Form.Item>

              <Form.Item name="oxygen" label="Oxygen">
                <Input placeholder="Enter Oxygen" />
              </Form.Item>

              <Form.Item name="temperature" label="Temperature">
                <Input placeholder="Enter Temperature" />
              </Form.Item>

              <Form.Item name="respiratoryRate" label="Respiratory Rate">
                <Input placeholder="Enter Respiratory Rate" />
              </Form.Item>

              <Form.Item name="height" label="Height">
                <Input placeholder="Enter Height" />
              </Form.Item>

              <Form.Item name="weight" label="Weight">
                <Input placeholder="Enter Weight" />
              </Form.Item>

              <Form.Item name="patient_dob" label="Date of Birth">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="patient_gender" label="Gender">
                <Select
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="blood_group" label="Blood Group">
                <Select
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
              </Form.Item>

              <Form.Item name="patient_home_address" label="Home Address">
                <Input placeholder="Enter address" />
              </Form.Item>

              <Form.Item name="primary_language" label="Primary Language">
                <Input placeholder="e.g. English" />
              </Form.Item>

              <Form.Item name="religion" label="Religion">
                <Input placeholder="Enter religion" />
              </Form.Item>
            </div>

            {/* ---------- SECTION 2: EMERGENCY CONTACT ---------- */}
            <h3>2. Emergency Contact</h3>
            <div style={twoColGrid}>
              <Form.Item name="emer_con_name" label="Full Name">
                <Input placeholder="Enter name" />
              </Form.Item>

              <Form.Item name="emer_con_relation" label="Relationship">
                <Input placeholder="e.g. Spouse" />
              </Form.Item>

              <Form.Item
                name="emer_con_coun_of_residen"
                label="Country of Residence"
              >
                <Input placeholder="Enter country" />
              </Form.Item>

              <Form.Item name="emer_con_country_code" label="Country">
                <Select
                  showSearch
                  options={countryOptions}
                  placeholder="Select Country"
                />
              </Form.Item>

              <Form.Item name="emer_con_phone" label="Phone">
                <Input placeholder="Enter phone" />
              </Form.Item>

              <Form.Item
                name="emer_con_email"
                label="Email"
                rules={[{ type: "email", message: "Invalid email" }]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </div>

            {/* ---------- SECTION 3: LOCAL CONTACT ---------- */}
            <h3>3. Local Contact (if different)</h3>
            <div style={twoColGrid}>
              <Form.Item name="local_con_name" label="Full Name">
                <Input placeholder="Enter local contact name" />
              </Form.Item>

              <Form.Item name="local_con_relation" label="Relationship">
                <Input placeholder="e.g. Friend" />
              </Form.Item>

              <Form.Item name="local_con_country_code" label="Country">
                <Select
                  showSearch
                  placeholder="Select Country"
                  options={countryOptions}
                />
              </Form.Item>

              <Form.Item name="local_con_phone" label="Phone">
                <Input placeholder="Enter phone" />
              </Form.Item>
            </div>

            {/* ---------- SECTION 4: MEDICAL HISTORY ---------- */}
            <h3>4. Medical History</h3>
            <div style={twoColGrid}>
              <Form.Item name="medical_his_diagnosis" label="Diagnosis">
                <Input.TextArea placeholder="Enter diagnosis" />
              </Form.Item>

              <Form.Item name="medical_his_cancer" label="Cancer History">
                <Input placeholder="Enter cancer history" />
              </Form.Item>

              <Form.Item name="medical_his_other" label="Other Medical History">
                <Input placeholder="Other medical history" />
              </Form.Item>

              <Form.Item
                name="medical_his_provided_medi_care"
                label="Medical Care Provided"
              >
                <Input placeholder="Medical Care Provided" />
              </Form.Item>

              <Form.Item
                name="medical_his_major_surgeries"
                label="Major Surgeries"
              >
                <Input placeholder="Enter major surgeries" />
              </Form.Item>

              <Form.Item name="medical_his_curr_symp" label="Current Symptoms">
                <Input.TextArea placeholder="Enter current symptoms" />
              </Form.Item>
            </div>

            {/* ---------- SECTION 5: MEDICATIONS (unchanged, state-based) ---------- */}
            <h3>5. Medications</h3>
            <>
              {medications.map((med, index) => (
                <div
                  key={index}
                  style={{
                    ...twoColGrid,
                    marginBottom: "20px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "15px",
                  }}
                >
                  {/* Your original medication inputs kept intact */}
                  <div>
                    <label>Medication Name</label>
                    <Input
                      placeholder="Medication name"
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
                    <div style={{ textAlign: "right" }}>
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

              <div style={{ textAlign: "right" }}>
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

            {/* ---------- SECTION 6: ALLERGIES ---------- */}
            <h3>6. Allergies</h3>
            <div style={twoColGrid}>
              <Form.Item name="allergies_issues" label="Allergies to Drugs?">
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="allergies_drug" label="Drug Allergies">
                <Input placeholder="Enter drug allergies" />
              </Form.Item>

              <Form.Item name="allergies_food" label="Food Allergies">
                <Input placeholder="Enter food allergies" />
              </Form.Item>
            </div>

            {/* ---------- SECTION 7: FUNCTIONAL STATUS ---------- */}
            <h3>7. Functional Status</h3>
            <div style={twoColGrid}>
              <Form.Item name="functional_bathe" label="Bathing">
                <Input placeholder="Can the patient bathe independently?" />
              </Form.Item>

              <Form.Item name="functional_dress" label="Dressing">
                <Input placeholder="Can the patient dress independently?" />
              </Form.Item>

              <Form.Item name="functional_eat" label="Eating">
                <Input placeholder="Can the patient eat independently?" />
              </Form.Item>

              <Form.Item name="functional_walk" label="Walking">
                <Input placeholder="Can the patient walk independently?" />
              </Form.Item>

              <Form.Item name="functional_use_bathroom" label="Use Bathroom">
                <Input placeholder="Can the patient use bathroom independently?" />
              </Form.Item>

              <Form.Item
                name="functional_daily_activity"
                label="Daily Activity"
              >
                <Input placeholder="Can the patient manage daily activity?" />
              </Form.Item>

              <Form.Item
                name="functional_manage_finance"
                label="Manage Finance"
              >
                <Input placeholder="Can the patient manage finances?" />
              </Form.Item>

              <Form.Item name="functional_any_falls" label="Any Falls?">
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="functional_how_many" label="How Many?">
                <Input placeholder="Number of falls" />
              </Form.Item>

              <Form.Item name="functional_memory_pbms" label="Memory Problems?">
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            {/* ---------- SECTION 8: LIFESTYLE ---------- */}
            <h3>8. Lifestyle</h3>
            <div style={twoColGrid}>
              <Form.Item name="lifestyle_daily_routine" label="Daily Routine">
                <Input.TextArea placeholder="Describe daily routine" />
              </Form.Item>

              <Form.Item name="lifestyle_dietary_habits" label="Dietary Habits">
                <Input placeholder="Dietary habits" />
              </Form.Item>

              <Form.Item name="lifestyle_sleep_quality" label="Sleep Quality">
                <Input placeholder="Sleep quality" />
              </Form.Item>

              <Form.Item
                name="lifestyle_physical_activity"
                label="Physical Activity"
              >
                <Input placeholder="Physical activity" />
              </Form.Item>

              <Form.Item name="lifestyle_alcohol_use" label="Alcohol Use">
                <Input placeholder="Alcohol use" />
              </Form.Item>

              <Form.Item
                name="lifestyle_pain_complaints"
                label="Pain Complaints"
              >
                <Input placeholder="Pain complaints" />
              </Form.Item>

              <Form.Item name="lifestyle_pain_where" label="Pain Location">
                <Input placeholder="Pain location" />
              </Form.Item>
            </div>

            {/* ---------- SECTION 9: SOCIAL & EMOTIONAL ---------- */}
            <h3>9. Social & Emotional</h3>
            <div style={twoColGrid}>
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
                <Input placeholder="Trusted person name" />
              </Form.Item>
            </div>

            {/* ---------- SECTION 10: GOALS ---------- */}
            <h3>10. Goals</h3>
            <div style={twoColGrid}>
              <Form.Item name="goals_family_hope" label="Family Hopes">
                <Input.TextArea placeholder="Family hopes / goals" />
              </Form.Item>

              <Form.Item
                name="goals_special_instructions"
                label="Special Instructions"
              >
                <Input.TextArea placeholder="Special instructions" />
              </Form.Item>

              {/* <Form.Item name="goals_term_membership" label="Term Membership">
                <Input placeholder="Term membership" />
              </Form.Item> */}
            </div>

            {/* ---------- SECTION 11: FILE UPLOADS ---------- */}
            <h3 style={sectionTitle}>11. Upload Files</h3>
            <Upload
              multiple
              fileList={editedData.patient_upload_files || []}
              beforeUpload={(file) => {
                // Add file in the correct format
                const newFile = {
                  uid: file.uid,
                  name: file.name,
                  status: "done", // to show as uploaded
                  originFileObj: file,
                };
                setEditedData({
                  ...editedData,
                  patient_upload_files: [
                    ...(editedData.patient_upload_files || []),
                    newFile,
                  ],
                });
                return false; // prevent auto-upload
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
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("You must accept the terms to continue"),
                },
              ]}
            >
              <Checkbox style={{ marginTop: 20 }}>
                I agree to the{" "}
                <a href="https://verimed.care/consent-of-care" target="_blank">
                  Consent of Care
                </a>
                ,{" "}
                <a
                  href="https://verimed.care/patient-family-bill-of-rights"
                  target="_blank"
                >
                  Patient & Family Bill of Rights
                </a>{" "}
                and{" "}
                <a
                  href="https://verimed.care/hipaa-release-privacy"
                  target="_blank"
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
