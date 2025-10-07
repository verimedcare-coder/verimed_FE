import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";
import {
  Tabs,
  Table,
  Input,
  Button,
  Tag,
  Space,
  Drawer,
  Checkbox,
  Descriptions,
  Avatar,
  Form,
  DatePicker,
  Upload,
} from "antd";
import {
  EllipsisOutlined,
  PlusOutlined,
  UploadOutlined,
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
import dayjs from "dayjs";

const { Option } = Select;
function SectionHeader({ title, children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        minWidth: 0,
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 600, color: "#1B1B1B" }}>{title}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

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
const linkedSponsor = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    name: "Name",
    phone: "+1 416 222 1000",
    email: "john.n@verimed.com",
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
  const [uploadedImage, setUploadedImage] = useState(null);
  const [searchText, setSearchText] = useState("");

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onFinish = (values) => {
    console.log("Sponsor Info Submitted:", values);
    form.resetFields();
    setOpen(false);
  };

  // Sample sponsors data
  const sponsorsData = [
    {
      key: 1,
      name: "John Nelson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "john.n@verimed.com",
      phone: "+1 416 222 1000",
      country: "Canada",
      patientsLinked: 2,
      membership: "Premium",
      status: "Active",
    },
    {
      key: 2,
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      email: "jane.s@verimed.com",
      phone: "+1 416 333 1000",
      country: "Canada",
      patientsLinked: 3,
      membership: "Premium",
      status: "Inactive",
    },
  ];
  const [doctorsData] = useState([
    {
      key: 1,
      name: "John",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "john.n@verimed.com",
      phone: "+1 416 222 1000",
      gender: "Male",
      country: "Canada",
      patientsLinked: 1,
      Doctor: "mr.paul",
      CareTaker: "Nurse Clarisse",
      Sponsor: "John Nelson (Canada)",
      membership: "Premium",
      EnrolmentDate: "Feb 12, 2024",
      Condition: "Hypertension, Diabetes",
      status: "Active",
    },
  ]);
  const [caretakersData] = useState([
    { id: 1, name: "Ravi Kumar", shift: "Night", phone: "7777766666" },
  ]);
  const [patientsData] = useState([
    {
      key: 1,
      name: "John",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "john.n@verimed.com",
      phone: "+1 416 222 1000",
      gender: "Male",
      age: 55,
      country: "Canada",
      patientsLinked: 1,
      Doctor: "mr.paul",
      CareTaker: "Nurse Clarisse",
      Sponsor: "John Nelson (Canada)",
      membership: "Premium",
      EnrolmentDate: "Feb 12, 2024",
      Condition: "Hypertension, Diabetes",
      status: "Active",
    },
  ]);
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

  const handleEditClick = (record) => {
    switch (activeTab) {
      case "sponsors":
        setSelectedSponsor(record);
        setEditedData(record);
        break;
      case "doctors":
        setSelectedDoctor(record);
        setEditedData(record);
        break;
      case "caretakers":
        setSelectedCaretaker(record);
        setEditedData(record);
        break;
      case "patients":
        setSelectedPatient(record);
        setEditedData(record);
        break;
      default:
        break;
    }
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <img
            src={
              record.avatar ||
              `https://randomuser.me/api/portraits/${
                Math.random() > 0.5 ? "men" : "women"
              }/${Math.floor(Math.random() * 80) + 1}.jpg`
            }
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
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
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

  const getFilteredData = () => {
    const dataMap = {
      sponsors: sponsorsData,
      doctors: doctorsData,
      caretakers: caretakersData,
      patients: patientsData,
    };
    const data = dataMap[activeTab] || [];
    return data.filter((d) =>
      d.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const drawerTitleMap = {
    sponsors: "Sponsor Detailed View",
    doctors: "Doctor Detailed View",
    caretakers: "Caretaker Detailed View",
    patients: "Patient Detailed View",
  };

  function SponsorForm({ mode, data }) {
    return <div>Sponsor Form ({mode})</div>;
  }

  function DoctorForm({ mode, data }) {
    return <div>Doctor Form ({mode})</div>;
  }

  function CaretakerForm({ mode, data }) {
    return <div>Caretaker Form ({mode})</div>;
  }

  function PatientForm({ mode = "add", data = {}, onCancel, onSave }) {
    const [formData, setFormData] = useState({
      profileImage: data.profileImage || null,
      name: data.name || "",
      patientId: data.patientId || "PT-2094",
      age: data.age || "",
      gender: data.gender || "",
      condition: data.condition || "",
      caretaker: data.caretaker || "",
      sponsor: data.sponsor || "",
      sponsorId: data.sponsorId || "",
      sponsorContact: data.sponsorContact || "",
      doctor: data.doctor || "",
      membershipPlan: data.membershipPlan || "Premium",
      enrolmentDate: data.enrolmentDate ? dayjs(data.enrolmentDate) : null,
      status: data.status || "Active",
    });

    const handleChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      console.log("Patient form data:", formData);
      if (onSave) onSave(formData);
    };

    return (
      <Form layout="vertical">
        <Upload
          beforeUpload={() => false}
          onChange={(info) => handleChange("profileImage", info.file)}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
        </Upload>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
          }}
        >
          <Form.Item label={<span style={labelStyle}>Name</span>}>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Patient ID</span>}>
            <Input value={formData.patientId} disabled />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Age</span>}>
            <Input
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Gender</span>}>
            <Select
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Condition</span>}>
            <Input
              value={formData.condition}
              onChange={(e) => handleChange("condition", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Care Taker</span>}>
            <Input
              value={formData.caretaker}
              onChange={(e) => handleChange("caretaker", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Doctor</span>}>
            <Input
              value={formData.doctor}
              onChange={(e) => handleChange("doctor", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Sponsor Name</span>}>
            <Input
              value={formData.sponsor}
              onChange={(e) => handleChange("sponsor", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Sponsor ID</span>}>
            <Input
              value={formData.sponsorId}
              onChange={(e) => handleChange("sponsorId", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Sponsor Contact</span>}>
            <Input
              value={formData.sponsorContact}
              onChange={(e) => handleChange("sponsorContact", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Membership Plan</span>}>
            <Select
              value={formData.membershipPlan}
              onChange={(value) => handleChange("membershipPlan", value)}
              options={[
                { label: "Basic", value: "Basic" },
                { label: "Standard", value: "Standard" },
                { label: "Premium", value: "Premium" },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Enrolment Date</span>}>
            <DatePicker
              value={formData.enrolmentDate}
              onChange={(date) => handleChange("enrolmentDate", date)}
              format="MMM DD, YYYY"
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Status</span>}>
            <Select
              value={formData.status}
              onChange={(value) => handleChange("status", value)}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Pending", value: "Pending" },
              ]}
            />
          </Form.Item>
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <Space>
            <SecondaryBtn name="cancel" onClick={onCancel} />
            <PrimaryBtn
              type="button"
              onClick={handleSave}
              name={mode === "edit" ? "Save Changes" : "Add Patient"}
            />
          </Space>
        </div>
      </Form>
    );
  }
  const renderDrawerContent = () => {
    if (activeTab === "sponsors" && selectedSponsor)
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Profile and Basic Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              gap: 24,
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
              <p style={labelStyle}>Profile Image</p>

              <div style={{ position: "relative", width: 72, height: 72 }}>
                {/* Avatar */}
                <Avatar
                  size={72}
                  src={uploadedImage || selectedSponsor.avatar}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />

                {/* Upload Icon Overlay */}
                <label
                  htmlFor="image-upload"
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
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                    alt="Upload"
                    width={16}
                    height={16}
                  />
                </label>

                {/* Hidden File Input */}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <label style={labelStyle}>Name</label>
                <Input
                  value={editedData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Sponsor ID</label>
                <Input value="SP-1021" />
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
              <div>
                <label style={labelStyle}>Email Address</label>
                <Input
                  value={editedData.email}
                  onChange={(e) =>
                    setEditedData({ ...editedData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Address</label>
              <Input
                value={editedData.country}
                onChange={(e) =>
                  setEditedData({ ...editedData, country: e.target.value })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Total Patients</label>
              <Input value="2 (Father – Michael N., Mother – Grace N.)" />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <Input
                value={editedData.gender || "Male"}
                onChange={(e) =>
                  setEditedData({ ...editedData, gender: e.target.value })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Current Plan</label>
              <Input
                value={editedData.membership}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    membership: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <Select
                value={editedData.status}
                onChange={(value) =>
                  setEditedData({ ...editedData, status: value })
                }
                style={{ width: "100%" }}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
          </div>

          {/* Patients Linked (Static Example) */}
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Patients Linked</p>
            {linkedPatients.map((patient) => (
              <div
                key={patient.id}
                style={{
                  background: "#F9F9F9",
                  padding: 16,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  border: "1px solid #eaeaea",
                }}
              >
                {/* Profile Image */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    size={48}
                    src={patient.avatar}
                    style={{ borderRadius: 8, width: 60, height: 62 }}
                  />
                </div>

                {/* Name */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Name</p>
                  <p style={infoTextStyle}>{patient.name}</p>
                </div>

                {/* Assigned Doctor */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Assigned Doctor</p>
                  <p style={infoTextStyle}>{patient.doctor}</p>
                </div>

                {/* Care Taker */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Care Taker</p>
                  <p style={infoTextStyle}>{patient.caretaker}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    if (activeTab === "doctors" && selectedDoctor)
      return (
        <div>
          <p style={labelStyle}>Doctor Name</p>
          <Input
            value={editedData.name}
            onChange={(e) =>
              setEditedData({ ...editedData, name: e.target.value })
            }
          />
          <p style={labelStyle}>Specialization</p>
          <Input
            value={editedData.specialization}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                specialization: e.target.value,
              })
            }
          />
          <p style={labelStyle}>Phone</p>
          <Input
            value={editedData.phone}
            onChange={(e) =>
              setEditedData({ ...editedData, phone: e.target.value })
            }
          />
        </div>
      );

    if (activeTab === "caretakers" && selectedCaretaker)
      return (
        <div>
          <p style={labelStyle}>Caretaker Name</p>
          <Input
            value={editedData.name}
            onChange={(e) =>
              setEditedData({ ...editedData, name: e.target.value })
            }
          />
          <p style={labelStyle}>Shift</p>
          <Input
            value={editedData.shift}
            onChange={(e) =>
              setEditedData({ ...editedData, shift: e.target.value })
            }
          />
          <p style={labelStyle}>Phone</p>
          <Input
            value={editedData.phone}
            onChange={(e) =>
              setEditedData({ ...editedData, phone: e.target.value })
            }
          />
        </div>
      );

    if (activeTab === "patients" && selectedPatient)
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Profile and Basic Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              gap: 24,
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
              <p style={labelStyle}>Profile Image</p>

              <div style={{ position: "relative", width: 72, height: 72 }}>
                {/* Avatar */}
                <Avatar
                  size={72}
                  src={uploadedImage || selectedPatient.avatar}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />

                {/* Upload Icon Overlay */}
                <label
                  htmlFor="image-upload"
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
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                    alt="Upload"
                    width={16}
                    height={16}
                  />
                </label>

                {/* Hidden File Input */}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <label style={labelStyle}>Name</label>
                <Input
                  value={editedData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Patient ID</label>
                <Input value="PT-2094" />
              </div>
              <div>
                <label style={labelStyle}>Age</label>
                <Input
                  value={editedData.age}
                  onChange={(e) =>
                    setEditedData({ ...editedData, age: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Care Taker</label>
                <Input
                  value={editedData.caretaker}
                  onChange={(e) =>
                    setEditedData({ ...editedData, caretaker: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <Input
                  value={editedData.gender || "Male"}
                  onChange={(e) =>
                    setEditedData({ ...editedData, gender: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Condition</label>
                <Input
                  value={editedData.Condition}
                  onChange={(e) =>
                    setEditedData({ ...editedData, Condition: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Sponsor</label>
              <Input value="John Nelson (Canada)" />
            </div>

            <div>
              <label style={labelStyle}>Care Taker</label>
              <Input
                value={editedData.CareTaker}
                onChange={(e) =>
                  setEditedData({ ...editedData, CareTaker: e.target.value })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <Select
                value={editedData.status}
                onChange={(value) =>
                  setEditedData({ ...editedData, status: value })
                }
                style={{ width: "100%" }}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
            <div>
              <label style={labelStyle}>Membership Plan</label>
              <Input
                value={editedData.membership}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    membership: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Doctor</label>
              <Input
                value={editedData.Doctor}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    Doctor: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Enrollment Date</label>
              <Input
                value={editedData.EnrolmentDate}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    EnrolmentDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Health Records</p>
            <div style={vitalsGrid}>
              {vitals.map((item, i) => (
                <div key={i} style={vitalCard}>
                  <img
                    src={item.icon}
                    alt={item.label}
                    style={{ width: 24, height: 24, flexShrink: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <p style={vitalLabel}>{item.label}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <div style={dotStyle(item.color)}></div>
                      <span style={vitalValue}>{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patients Linked (Static Example) */}
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Sponsor Details</p>
            {linkedSponsor.map((sponsor) => (
              <div
                key={sponsor.id}
                style={{
                  background: "#F9F9F9",
                  padding: 16,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  border: "1px solid #eaeaea",
                }}
              >
                {/* Profile Image */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    size={48}
                    src={sponsor.avatar}
                    style={{ borderRadius: 8, width: 60, height: 62 }}
                  />
                </div>

                {/* Name */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Name</p>
                  <p style={infoTextStyle}>{sponsor.name}</p>
                </div>

                {/* Assigned Doctor */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Phone</p>
                  <p style={infoTextStyle}>{sponsor.phone}</p>
                </div>

                {/* Care Taker */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Email</p>
                  <p style={infoTextStyle}>{sponsor.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    return null;
  };

  const tabItems = [
    { key: "sponsors", label: "Sponsors" },
    { key: "doctors", label: "Doctors" },
    { key: "caretakers", label: "Caretakers" },
    { key: "patients", label: "Patients" },
  ];

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

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#F7F9FB" }}
    >
      {/* Sidebar */}
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

        {/* Content area with just text */}
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
          {/* cards */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              width: "100%",
            }}
          >
            {adminStats.map((stat, idx) => (
              <div
                key={stat.id}
                style={{
                  minWidth: 160,
                  // maxWidth: 200,
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
                {/* ...card content... */}
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
          {/* tabs */}
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
                {/* <PrimaryBtn
                  name={`Add ${activeTab.slice(0, -1)}`}
                  icon={<PlusOutlined />}
                  onClick={() => setDrawerVisible(true)}
                /> */}
                <PrimaryBtn
                  name={`Add ${activeTab.slice(0, -1)}`}
                  icon={<PlusOutlined />}
                  onClick={() => setAddDrawerVisible(true)}
                />

                <Drawer
                  title={`Add ${activeTab.slice(0, -1)}`}
                  width={400}
                  open={addDrawerVisible}
                  onClose={() => setAddDrawerVisible(false)}
                >
                  {activeTab === "sponsors" && <SponsorForm mode="add" />}
                  {activeTab === "doctors" && <DoctorForm mode="add" />}
                  {activeTab === "caretakers" && <CaretakerForm mode="add" />}
                  {activeTab === "patients" && (
                    <PatientForm
                      mode="add"
                      onCancel={() => setAddDrawerVisible(false)}
                      onSave={(values) => {
                        console.log("Saved Patient:", values);
                        setAddDrawerVisible(false);
                      }}
                    />
                  )}
                </Drawer>
              </div>

              <Table
                columns={columns}
                dataSource={getFilteredData()}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                bordered
              />
            </div>

            <Drawer
              title={drawerTitleMap[activeTab]}
              width={720}
              onClose={() => setDrawerVisible(false)}
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
                <Button danger size="large">
                  Deactivate Account
                </Button>

                <PrimaryBtn
                  name="Edit Sponsor"
                  type="primary"
                  size="large"
                  onClick={() => {
                    console.log("Updated sponsor:", editedData);
                    setDrawerVisible(false);
                  }}
                />
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}
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
const vitalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 15,
  minWidth: 0,
  width: "100%",
  background: "rgb(249, 249, 249)",
};

const vitalCard = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #1B1B1B1A",
  borderRadius: "10px",
  padding: "10px",
  minHeight: "80px",
  minWidth: 0,
};

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };
