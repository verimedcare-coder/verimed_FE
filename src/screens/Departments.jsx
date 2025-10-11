import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";

import {
  Button,
  Table,
  Drawer,
  Input,
  Select,
  Avatar,
  Form,
  DatePicker,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;

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

const deptStats = [
  {
    id: 1,
    name: "Total Departments",
    count: 23,
    diff: "+95%",
    duration: "in last 7 Days",
  },
  {
    id: 2,
    name: "Total Doctors",
    count: 20,
    diff: "+95%",
    duration: "in last 7 Days",
  },
  {
    id: 3,
    name: "Care Takers",
    count: 24,
    diff: "+25%",
    duration: "in last 7 Days",
  },
  {
    id: 4,
    name: "Patients",
    count: 6,
    diff: "+15%",
    duration: "in last 7 Days",
  },
  {
    id: 5,
    name: "Revenue Contribution",
    count: 6,
    diff: "+15%",
    duration: "in last 7 Days",
  },
];

const departmentData = [
  {
    departmentId: "001",
    departmentName: "Internal Medicine",
    headDoctor: "Dr. Paul Ekom",
    type: "Clinical",
    totalDoctors: 10,
    patientsAssigned: 145,
    status: "Active",
  },
  {
    departmentId: "002",
    departmentName: "Cardiology",
    headDoctor: "Dr. Kom",
    type: "Clinical",
    totalDoctors: 9,
    patientsAssigned: 15,
    status: "Active",
  },
  {
    departmentId: "003",
    departmentName: "Neurology",
    headDoctor: "Dr. John",
    type: "Clinical",
    totalDoctors: 5,
    patientsAssigned: 15,
    status: "Inactive",
  },
];

// ---------- Status Badge ----------
const getStatusTag = (status) => (
  <span
    style={{
      padding: "4px 12px",
      borderRadius: "12px",
      color: status === "Active" ? "#007F5F" : "#B00020",
      backgroundColor: status === "Active" ? "#E6F4EA" : "#FDEAEA",
      fontWeight: 500,
      fontSize: 12,
    }}
  >
    {status}
  </span>
);

// ---------- Departments Component ----------
export default function Departments() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);

  // Columns moved **inside** component so state functions work
  const columns = [
    {
      title: "Department ID",
      dataIndex: "departmentId",
      key: "departmentId",
      width: 120,
    },
    {
      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
      width: 180,
    },
    {
      title: "Head Doctor",
      dataIndex: "headDoctor",
      key: "headDoctor",
      width: 160,
    },
    { title: "Type", dataIndex: "type", key: "type", width: 120 },
    {
      title: "Total Doctors",
      dataIndex: "totalDoctors",
      key: "totalDoctors",
      width: 130,
    },
    {
      title: "Patients Assigned",
      dataIndex: "patientsAssigned",
      key: "patientsAssigned",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text) => getStatusTag(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDept(record);
            setViewDrawerOpen(true);
          }}
          style={{ cursor: "pointer", color: "#007F5F", fontSize: 18 }}
        >
          <MoreOutlined />
        </span>
      ),
    },
  ];

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
        <Header />

        <div
          style={{
            padding: 20,
            overflowY: "auto",
            overflowX: "hidden",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Stats Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              width: "100%",
            }}
          >
            {deptStats.map((stat, idx) => (
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

          {/* Table */}
          <div style={tableContainer}>
            <SectionHeader title="Department List">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Button
                  style={{
                    height: 38,
                    borderColor: "#0000001F",
                    borderRadius: 12,
                  }}
                >
                  Aug 2025 <CalendarOutlined />
                </Button>
                <PrimaryBtn
                  name="New Department"
                  onClick={() => setAddDrawerOpen(true)}
                />
                <SecondaryBtn name="Filter" icon={<FilterOutlined />} />
              </div>
            </SectionHeader>

            <Table
              columns={columns}
              dataSource={departmentData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              bordered
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* ---------- Add Department Drawer ---------- */}
      <Drawer
        title="Add Department"
        width={720}
        onClose={() => setAddDrawerOpen(false)}
        open={addDrawerOpen}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={(values) => {
            console.log("Department Created:", values);
            setAddDrawerOpen(false);
          }}
        >
          {/* Two-Column Grid Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 16,
            }}
          >
            <Form.Item
              name="departmentName"
              label="Department Name"
              rules={[
                { required: true, message: "Please enter department name" },
              ]}
            >
              <Input placeholder="Enter department name" />
            </Form.Item>

            <Form.Item label="Department ID">
              <Input value="DEP-1022" disabled />
            </Form.Item>

            <Form.Item
              name="departmentType"
              label="Department Type"
              rules={[
                { required: true, message: "Please select department type" },
              ]}
            >
              <Select placeholder="Select type">
                <Option value="Clinical">Clinical</Option>
                <Option value="Non-Clinical">Non-Clinical</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="departmentLocation"
              label="Department Location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>

            <Form.Item
              name="contactEmail"
              label="Contact Email"
              rules={[
                { type: "email", required: true, message: "Enter valid email" },
              ]}
            >
              <Input placeholder="e.g., dept@hospital.com" />
            </Form.Item>

            <Form.Item
              name="contactPhone"
              label="Contact Phone"
              rules={[{ required: true, message: "Enter phone number" }]}
            >
              <Input placeholder="e.g., +91 9876543210" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Enter location" }]}
            >
              <Input placeholder="Building / Floor / Wing" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Select status" }]}
            >
              <Select placeholder="Select status">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>

            {/* Full-width Description */}
            <Form.Item
              name="description"
              label="Description"
              style={{ gridColumn: "1 / span 2" }}
            >
              <TextArea
                rows={2}
                placeholder="Brief description of department"
              />
            </Form.Item>
          </div>

          {/* Head Doctor Section */}
          <h3 style={{ marginTop: 24 }}>Assign Head Doctor</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 8,
            }}
          >
            <Form.Item
              name="doctor"
              label="Select Doctor"
              rules={[{ required: true, message: "Please select a doctor" }]}
            >
              <Select placeholder="Choose doctor">
                <Option value="dr_smith">Dr. Smith</Option>
                <Option value="dr_jones">Dr. Jones</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: "Enter designation" }]}
            >
              <Input placeholder="e.g., Chief Physician" />
            </Form.Item>

            <Form.Item
              name="joiningDate"
              label="Joining Date"
              rules={[{ required: true, message: "Select joining date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="roleType"
              label="Role Type"
              rules={[{ required: true, message: "Select role type" }]}
            >
              <Select placeholder="Select role type">
                <Option value="Full-Time">Full-Time</Option>
                <Option value="Part-Time">Part-Time</Option>
                <Option value="Visiting">Visiting</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <Form.Item style={{ marginBottom: 0 }}>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
            >
              <Button
                onClick={() => setAddDrawerOpen(false)}
                style={{
                  height: 40,
                  border: "1px solid #ccc",
                  backgroundColor: "#ffffff",
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  height: 40,
                  backgroundColor: "#F0C330",
                  borderColor: "#B78520",
                  color: "#000",
                  fontWeight: 500,
                }}
              >
                Create Department
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>

      {/* ---------- View Department Drawer ---------- */}
      <Drawer
        title="Department Details"
        width={460}
        onClose={() => setViewDrawerOpen(false)}
        open={viewDrawerOpen}
      >
        {selectedDept && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                size={64}
                src={`https://ui-avatars.com/api/?name=${selectedDept.departmentName}`}
              />
              <div>
                <p style={{ fontWeight: 600, fontSize: 16 }}>
                  {selectedDept.departmentName}
                </p>
                {getStatusTag(selectedDept.status)}
              </div>
            </div>
            <p>
              <strong>Department ID:</strong> {selectedDept.departmentId}
            </p>
            <p>
              <strong>Head Doctor:</strong> {selectedDept.headDoctor}
            </p>
            <p>
              <strong>Type:</strong> {selectedDept.type}
            </p>
            <p>
              <strong>Total Doctors:</strong> {selectedDept.totalDoctors}
            </p>
            <p>
              <strong>Patients Assigned:</strong>{" "}
              {selectedDept.patientsAssigned}
            </p>
          </div>
        )}
      </Drawer>
    </div>
  );
}

const tableContainer = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "auto",
  minWidth: 0,
};
