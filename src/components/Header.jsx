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
  const [editedData, setEditedData] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);

  const navigate = useNavigate();

  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  const token = localStorage.getItem("token");

  const handleLanguageChange = (lang) => setLanguage(lang);

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

  useEffect(() => {
    const storedAppointments = localStorage.getItem("sponsorAppointments");
    if (storedAppointments) {
      try {
        const parsedAppointments = JSON.parse(storedAppointments);
        const uniquePatientsMap = new Map();

        parsedAppointments.forEach((item) => {
          const patientUser = item?.patient?.user;
          if (patientUser && !uniquePatientsMap.has(patientUser.id)) {
            uniquePatientsMap.set(patientUser.id, patientUser);
          }
        });

        const patientList = Array.from(uniquePatientsMap.values());
        setPatients(patientList);

        if (patientList.length > 0) {
          const defaultPatient = patientList[0];
          setSelectedPatient(defaultPatient.id);
          localStorage.setItem("selectedPatientId", defaultPatient.id);
          showPatientDetails(defaultPatient.id);
        }
      } catch (error) {
        console.error("Error parsing sponsor appointments:", error);
      }
    }
  }, []);

  const showPatientDetails = (patientId) => {
    const storedAppointments = localStorage.getItem("sponsorAppointments");
    if (storedAppointments) {
      try {
        const parsedAppointments = JSON.parse(storedAppointments);
        const patientAppointments = parsedAppointments.filter(
          (item) => item?.patient?.user?.id === patientId
        );

        if (patientAppointments.length > 0) {
          const patientDetails = patientAppointments[0]?.patient?.user;

          localStorage.setItem(
            "selectedPatientDetails",
            JSON.stringify(patientDetails)
          );
          localStorage.setItem(
            "selectedPatientAppointments",
            JSON.stringify(patientAppointments)
          );
        } else {
          localStorage.removeItem("selectedPatientDetails");
          localStorage.removeItem("selectedPatientAppointments");
        }
      } catch (error) {
        console.error("Error retrieving patient details:", error);
      }
    }
  };

  const handlePatientChange = (value) => {
    setSelectedPatient(value);
    localStorage.setItem("selectedPatientId", value);
    showPatientDetails(value);
  };

  const handleEnrollSubmit = async (values) => {
    try {
      const user_signup = {
        first_name: values.first_name,
        last_name: values.last_name,
        role: "patient",
        email: values.email,
        countrycode: "IN",
        phone: values.phone,
        password: values.password,
      };

      const formData = new FormData();
      formData.append("user_signup", JSON.stringify(user_signup));
      if (values.photo) formData.append("photo", values.photo);

      const endpoint = `${base_url}/user_create/`;
      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      message.success("Patient enrolled successfully!");

      setIsModalVisible(false);

      const patientData = res.data?.user || user_signup;

      setEditedData({
        patient_first_name: patientData.first_name || "",
        patient_last_name: patientData.last_name || "",
        patient_email: patientData.email || "",
        patient_phone: patientData.phone || "",
        patient_gender: "",
        patient_dob: "",
        blood_group: "",
        primary_language: "",
        religion: "",
        escalate_to_physician: "",
        patient_home_address: "",
      });

      setIsSecondModalVisible(true);
    } catch (error) {
      console.error("Signup error:", error);
      message.error(
        error.response?.data?.detail ||
          "Something went wrong while enrolling patient."
      );
    }
  };

  const handleUpdateClick = async () => {
    try {
      const formData = new FormData();
      const keyName = "patientprofile_update_data";

      const updateData = {
        patient_profile_updateid: selectedPatient?.id || "",
        patient_dob: editedData.patient_dob || "",
        patient_gender: editedData.patient_gender || "",
        blood_group: editedData.blood_group || "",
        patient_home_address: editedData.patient_home_address || "",
        primary_language: editedData.primary_language || "",
        religion: editedData.religion || "",
        escalate_to_physician: editedData.escalate_to_physician || "",
        emer_con_name: editedData.emer_con_name || "",
        emer_con_relation: editedData.emer_con_relation || "",
        emer_con_phone: editedData.emer_con_phone || "",
        emer_con_email: editedData.emer_con_email || "",
        local_con_name: editedData.local_con_name || "",
        local_con_phone: editedData.local_con_phone || "",
        medical_his_diagnosis: editedData.medical_his_diagnosis || "",
        medication_name: editedData.medication_name || "",
        allergies_food: editedData.allergies_food || "",
        lifestyle_daily_routine: editedData.lifestyle_daily_routine || "",
        goals_family_hope: editedData.goals_family_hope || "",
      };

      formData.append(keyName, JSON.stringify(updateData));

      if (editedData.patient_upload_files?.length > 0) {
        editedData.patient_upload_files.forEach((file) => {
          formData.append("patient_upload_files", file);
        });
      }

      const endpoint = `${base_url}/patientprofile_update/`;
      const headers = {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const res = await axios.patch(endpoint, formData, { headers });
      message.success("Patient details updated successfully!");
      setIsSecondModalVisible(false);
    } catch (error) {
      console.error("Update failed:", error);
      message.error(
        error.response?.data?.detail || "Unable to update patient profile."
      );
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
          <Select
            value={selectedPatient}
            onChange={handlePatientChange}
            style={{ width: 200, borderRadius: 6 }}
            placeholder="Select Patient"
          >
            {patients.map((p) => (
              <Option key={p.id} value={p.id}>
                {`${p.first_name} ${p.last_name}`}
              </Option>
            ))}
          </Select>

          {/* 🟩 Enroll Loved One */}
          <Primarybtn
            name="Enroll Loved One"
            onClick={() => setIsModalVisible(true)}
          />

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

      {/* 🟢 Enroll Loved One Modal */}
      <Modal
        open={isModalVisible}
        title="Enroll Loved One"
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <UserForm onFinish={handleEnrollSubmit} />
      </Modal>
      <Modal
        open={isSecondModalVisible}
        title="Patient Detailed Information"
        onCancel={() => setIsSecondModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsSecondModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateClick}>
            Save Details
          </Button>,
        ]}
        width="80%"
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: "32px" }}
        centered
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxHeight: "70vh",
            overflowY: "auto",
            paddingRight: 10,
          }}
        >
          {" "}
          {/* ---------- PROFILE IMAGE ---------- */}{" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 12,
            }}
          >
            {" "}
            <p style={labelStyle}>Profile Image</p>{" "}
            <div style={{ position: "relative", width: 72, height: 72 }}>
              {" "}
              {/* <Avatar
                size={72}
                src={uploadedImage || selectedPatient.avatar}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />{" "} */}
              <label
                htmlFor="patient-image-upload"
                style={{
                  position: "absolute",
                  bottom: -10,
                  right: "50%",
                  transform: "translateX(50%)",
                  background: "#fff",
                  borderRadius: "50%",
                  padding: 4,
                  cursor: "pointer",
                  boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                }}
              >
                {" "}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                  alt="Upload"
                  width={16}
                  height={16}
                />{" "}
              </label>{" "}
              <input
                id="patient-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* ---------- PERSONAL INFO ---------- */}{" "}
          <h3 style={sectionTitle}>Personal Information</h3>{" "}
          <div style={twoColGrid}>
            {" "}
            <div>
              {" "}
              <label style={labelStyle}>Date of Birth</label>{" "}
              <Input
                value={editedData.patient_dob}
                onChange={(e) =>
                  setEditedData({ ...editedData, patient_dob: e.target.value })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Gender</label>{" "}
              <Select
                value={editedData.patient_gender}
                onChange={(val) =>
                  setEditedData({ ...editedData, patient_gender: val })
                }
                style={{ width: "100%" }}
              >
                {" "}
                <Select.Option value="Male">Male</Select.Option>{" "}
                <Select.Option value="Female">Female</Select.Option>{" "}
                <Select.Option value="Other">Other</Select.Option>{" "}
              </Select>{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Blood Group</label>{" "}
              <Input
                value={editedData.blood_group}
                onChange={(e) =>
                  setEditedData({ ...editedData, blood_group: e.target.value })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Primary Language</label>{" "}
              <Input
                value={editedData.primary_language}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    primary_language: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Religion</label>{" "}
              <Input
                value={editedData.religion}
                onChange={(e) =>
                  setEditedData({ ...editedData, religion: e.target.value })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Escalate to Physician</label>{" "}
              <Select
                value={editedData.escalate_to_physician}
                onChange={(val) =>
                  setEditedData({ ...editedData, escalate_to_physician: val })
                }
                style={{ width: "100%" }}
              >
                {" "}
                <Select.Option value="Yes">Yes</Select.Option>{" "}
                <Select.Option value="No">No</Select.Option>{" "}
              </Select>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <label style={labelStyle}>Home Address</label>{" "}
            <Input.TextArea
              rows={2}
              value={editedData.patient_home_address}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  patient_home_address: e.target.value,
                })
              }
            />{" "}
          </div>{" "}
          {/* ---------- EMERGENCY CONTACT ---------- */}{" "}
          <h3 style={sectionTitle}>Emergency Contact</h3>{" "}
          <div style={twoColGrid}>
            {" "}
            <div>
              {" "}
              <label style={labelStyle}>Name</label>{" "}
              <Input
                value={editedData.emer_con_name}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_name: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Relation</label>{" "}
              <Input
                value={editedData.emer_con_relation}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_relation: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Country of Residence</label>{" "}
              <Input
                value={editedData.emer_con_coun_of_residen}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_coun_of_residen: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Country Code</label>{" "}
              <Input
                value={editedData.emer_con_country_code}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_country_code: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Phone</label>{" "}
              <Input
                value={editedData.emer_con_phone}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_phone: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Email</label>{" "}
              <Input
                value={editedData.emer_con_email}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    emer_con_email: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* ---------- LOCAL CONTACT ---------- */}{" "}
          <h3 style={sectionTitle}>Local Contact</h3>{" "}
          <div style={twoColGrid}>
            {" "}
            <div>
              {" "}
              <label style={labelStyle}>Name</label>{" "}
              <Input
                value={editedData.local_con_name}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    local_con_name: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Relation</label>{" "}
              <Input
                value={editedData.local_con_relation}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    local_con_relation: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Country Code</label>{" "}
              <Input
                value={editedData.local_con_country_code}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    local_con_country_code: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Phone</label>{" "}
              <Input
                value={editedData.local_con_phone}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    local_con_phone: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* ---------- MEDICAL HISTORY ---------- */}{" "}
          <h3 style={sectionTitle}>Medical History</h3>{" "}
          <div style={twoColGrid}>
            {" "}
            <div>
              {" "}
              <label style={labelStyle}>Diagnosis</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.medical_his_diagnosis}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_diagnosis: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Major Surgeries</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.medical_his_major_surgeries}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_major_surgeries: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Current Symptoms</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.medical_his_curr_symp}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medical_his_curr_symp: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* ---------- MEDICATIONS ---------- */}{" "}
          <h3 style={sectionTitle}>Medications & Allergies</h3>{" "}
          <div style={twoColGrid}>
            {" "}
            <div>
              {" "}
              <label style={labelStyle}>Medication Name</label>{" "}
              <Input
                value={editedData.medication_name}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_name: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Dose</label>{" "}
              <Input
                value={editedData.medication_dose}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_dose: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Frequency</label>{" "}
              <Input
                value={editedData.medication_frequency}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_frequency: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Medication Reason</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.medication_reason}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    medication_reason: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div style={{ gridColumn: "1 / span 2" }}>
              {" "}
              <label style={labelStyle}>Allergy Issues</label>{" "}
              <Select
                value={editedData.allergies_issues ? "Yes" : "No"}
                onChange={(val) =>
                  setEditedData({
                    ...editedData,
                    allergies_issues: val === "Yes",
                  })
                }
                style={{ width: "100%" }}
              >
                {" "}
                <Select.Option value="Yes">Yes</Select.Option>{" "}
                <Select.Option value="No">No</Select.Option>{" "}
              </Select>{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Drug Allergies</label>{" "}
              <Input
                value={editedData.allergies_drug}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    allergies_drug: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Food Allergies</label>{" "}
              <Input
                value={editedData.allergies_food}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    allergies_food: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* ---------- LIFESTYLE ---------- */}{" "}
          <h3 style={sectionTitle}>Functional & Lifestyle</h3>{" "}
          <div style={twoColGrid}>
            {" "}
            <div>
              {" "}
              <label style={labelStyle}>Daily Routine</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.lifestyle_daily_routine}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_daily_routine: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Dietary Habits</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.lifestyle_dietary_habits}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_dietary_habits: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Physical Activity</label>{" "}
              <Input
                value={editedData.lifestyle_physical_activity}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    lifestyle_physical_activity: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* ---------- SOCIAL & GOALS ---------- */}{" "}
          <h3 style={sectionTitle}>Social & Goals</h3>{" "}
          <div style={twoColGrid}>
            {" "}
            <div>
              {" "}
              <label style={labelStyle}>Emotional Health</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.social_emotion_health}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    social_emotion_health: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Spiritual Needs</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.social_spiritual_needs}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    social_spiritual_needs: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label style={labelStyle}>Goals or Hopes</label>{" "}
              <Input.TextArea
                rows={2}
                value={editedData.goals_family_hope}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    goals_family_hope: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* ---------- FILE UPLOAD ---------- */}{" "}
          <h3 style={sectionTitle}>Upload Documents</h3>{" "}
          <div style={twoColGrid}>
            {" "}
            <div style={{ gridColumn: "1 / span 2" }}>
              {" "}
              <label style={labelStyle}>
                File Names (comma separated)
              </label>{" "}
              <Input
                value={editedData.patient_files_name}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    patient_files_name: e.target.value,
                  })
                }
              />{" "}
            </div>{" "}
            <div style={{ gridColumn: "1 / span 2" }}>
              {" "}
              <Upload
                multiple
                beforeUpload={(file) => {
                  setEditedData((prev) => ({
                    ...prev,
                    patient_upload_files: [
                      ...(prev.patient_upload_files || []),
                      file,
                    ],
                  }));
                  return false;
                }}
                showUploadList
              >
                {" "}
                <Button icon={<UploadOutlined />}>Choose Files</Button>{" "}
              </Upload>{" "}
            </div>{" "}
          </div>{" "}
        </div>
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
