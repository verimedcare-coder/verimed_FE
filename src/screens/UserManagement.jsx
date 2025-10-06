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
} from "antd";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Primarybtn from "../components/PrimaryBtn";
import { Select } from "antd";
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

export default function UserManagement() {
  const [searchText, setSearchText] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

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
      render: (text, record) => (
        <EllipsisOutlined
          style={{ fontSize: 18, cursor: "pointer" }}
          onClick={() => {
            setSelectedSponsor(record);
            setEditedData(record); // Pre-fill form
            setDrawerVisible(true);
          }}
        />
      ),
    },
  ];

  // Filter data by search
  const filteredData = sponsorsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase())
  );

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

  const tabItems = [
    {
      key: "sponsors",
      label: "Sponsors",
      children: (
        <div style={tableContainer}>
          <SectionHeader title="Medical History">
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Primarybtn
              name="Add Sponsor"
              icon={<PlusOutlined />}
              onClick={showDrawer}
            />
          </SectionHeader>

          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
            bordered
            style={{ width: "100%" }}
          />
        </div>
      ),
    },
    {
      key: "doctors",
      label: "Doctors",
      children: (
        <div style={tableContainer}>
          <SectionHeader title="Medical History">
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Primarybtn
              name="Add Doctor"
              icon={<PlusOutlined />}
              onClick={showDrawer}
            />
          </SectionHeader>

          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
            bordered
            style={{ width: "100%" }}
          />
        </div>
      ),
    },
    {
      key: "caretakers",
      label: "Caretakers",
      children: <div>🧑‍🤝‍🧑 Caretaker Management Content goes here</div>,
    },
    {
      key: "patients",
      label: "Patients",
      children: <div>🏥 Patient Management Content goes here</div>,
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
              defaultActiveKey="sponsors"
              items={tabItems}
              size="large"
              tabBarGutter={32}
            />
          </div>
        </div>
        <Drawer
          title="Sponsor Detailed View"
          width={720}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 24 }}
        >
          {selectedSponsor && (
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

              {/* Footer Buttons */}
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
                    // TODO: Send `editedData` to your backend (axios.put/post)
                    setDrawerVisible(false);
                  }}
                />
              </div>
            </div>
          )}
        </Drawer>

        <Drawer
          title="Add Sponsor"
          width={720}
          onClose={onClose}
          open={open}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" form={form} onFinish={onFinish}>
            {/* Personal Information */}
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item name="maritalStatus" label="Marital Status">
              <Select>
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
                <Option value="divorced">Divorced</Option>
              </Select>
            </Form.Item>
            <Form.Item name="religion" label="Religion">
              <Input />
            </Form.Item>
            <Form.Item name="fatherName" label="Father's Name">
              <Input />
            </Form.Item>
            <Form.Item name="motherName" label="Mother's Name">
              <Input />
            </Form.Item>
            <Form.Item name="nationalId" label="National Identity Number">
              <Input />
            </Form.Item>
            <Form.Item name="passportNumber" label="Passport Number">
              <Input />
            </Form.Item>
            <Form.Item name="passportExpiry" label="Passport Expiry Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="placeOfBirth" label="Place of Birth">
              <Input />
            </Form.Item>
            <Form.Item name="countryOfBirth" label="Country of Birth">
              <Input />
            </Form.Item>
            <Form.Item name="nationality" label="Nationality">
              <Input />
            </Form.Item>
            <Form.Item name="countryOfResidence" label="Country of Residence">
              <Input />
            </Form.Item>

            {/* Contact Information */}
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="mobile" label="Mobile Number">
              <Input />
            </Form.Item>
            <Form.Item name="homePhone" label="Home Phone Number">
              <Input />
            </Form.Item>
            <Form.Item name="address1" label="Address Line 1">
              <Input />
            </Form.Item>
            <Form.Item name="address2" label="Address Line 2">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
            <Form.Item name="state" label="State/Province">
              <Input />
            </Form.Item>
            <Form.Item name="zip" label="Zip/Postal Code">
              <Input />
            </Form.Item>
            <Form.Item name="contactCountry" label="Country">
              <Input />
            </Form.Item>

            {/* Citizenship Information */}
            <Form.Item name="citizenshipStatus" label="Current Status">
              <Select>
                <Option value="citizen">Citizen</Option>
                <Option value="resident">Permanent Resident</Option>
                <Option value="visa">Visa Holder</Option>
              </Select>
            </Form.Item>
            <Form.Item name="citizenshipCountry" label="Country of Citizenship">
              <Input />
            </Form.Item>
            <Form.Item name="residencyStatus" label="Residency Status">
              <Input />
            </Form.Item>
            <Form.Item name="visaType" label="Visa Type">
              <Input />
            </Form.Item>
            <Form.Item name="visaNumber" label="Visa Number">
              <Input />
            </Form.Item>
            <Form.Item name="visaExpiry" label="Visa Expiry Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {/* Employment Details */}
            <Form.Item name="employmentStatus" label="Employment Status">
              <Select>
                <Option value="employed">Employed</Option>
                <Option value="unemployed">Unemployed</Option>
                <Option value="student">Student</Option>
              </Select>
            </Form.Item>
            <Form.Item name="employerName" label="Employer Name">
              <Input />
            </Form.Item>
            <Form.Item name="occupation" label="Occupation">
              <Input />
            </Form.Item>
            <Form.Item name="workPhone" label="Work Phone Number">
              <Input />
            </Form.Item>
            <Form.Item name="workEmail" label="Work Email Address">
              <Input />
            </Form.Item>

            {/* Education Details */}
            <Form.Item name="educationLevel" label="Highest Level of Education">
              <Select>
                <Option value="highschool">High School</Option>
                <Option value="bachelor">Bachelor's</Option>
                <Option value="master">Master's</Option>
                <Option value="phd">PhD</Option>
              </Select>
            </Form.Item>
            <Form.Item name="fieldOfStudy" label="Field of Study">
              <Input />
            </Form.Item>
            <Form.Item name="schoolName" label="School/University Name">
              <Input />
            </Form.Item>
            <Form.Item name="graduationYear" label="Graduation Year">
              <Input />
            </Form.Item>

            {/* Health Information */}
            <Form.Item name="chronicConditions" label="Chronic Conditions">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="drugAllergies" label="Drug Allergies">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="foodAllergies"
              label="Food/Environmental Allergies"
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="disabilities" label="Disabilities">
              <Input.TextArea rows={2} />
            </Form.Item>

            {/* Family Information */}
            <Form.Item
              name="relationship"
              label="Relationship to Primary Member"
            >
              <Select>
                <Option value="spouse">Spouse</Option>
                <Option value="child">Child</Option>
                <Option value="parent">Parent</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="emergencyContactName"
              label="Emergency Contact Name"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="emergencyContactPhone"
              label="Emergency Contact Phone"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="emergencyContactRelation"
              label="Emergency Contact Relationship"
            >
              <Input />
            </Form.Item>

            {/* Additional Information */}
            <Form.Item name="languagesSpoken" label="Languages Spoken">
              <Input />
            </Form.Item>
            <Form.Item name="preferredLanguage" label="Preferred Language">
              <Input />
            </Form.Item>
            <Form.Item name="ethnicity" label="Ethnicity">
              <Input />
            </Form.Item>
            <Form.Item name="militaryService" label="Military Service">
              <Input />
            </Form.Item>
            <Form.Item name="criminalRecord" label="Criminal Record">
              <Input />
            </Form.Item>
            <Form.Item name="specialNeeds" label="Special Needs">
              <Input />
            </Form.Item>
            <Form.Item
              name="specialConsiderations"
              label="Special Considerations for Professionals"
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            {/* Consent & Declaration */}
            <Form.Item name="consent" valuePropName="checked">
              <Checkbox>I consent to share this information</Checkbox>
            </Form.Item>
            <Form.Item name="declaration" valuePropName="checked">
              <Checkbox>
                I declare that the information provided is truthful
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Drawer>
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
