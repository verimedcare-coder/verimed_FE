import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import { useNavigate } from "react-router-dom";
import bloodPressure from "../assets/icons/blood-pressure.svg";
import heartRate from "../assets/icons/heart-rate.svg";
import oxygen from "../assets/icons/oxygen.svg";
import respiratory from "../assets/icons/respiratory.svg";
import statusIcon from "../assets/icons/status.svg";
import sugar from "../assets/icons/sugar.svg";
import weight from "../assets/icons/weight.svg";
import temperature from "../assets/icons/temperature.png";
import Primarybtn from "../components/PrimaryBtn";
import SecondaryBtn from "../components/SecondaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  DatePicker,
  TimePicker,
  Upload,
  Button,
} from "antd";
import { Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { TextArea } = Input;
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

export default function DailyReports() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Data:", values);
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

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

  const careTeam = {
    name: "Mr. Samuel N. (VM-976-324)",
    Condition: "Hypertension, Diabetes",
    AssignedDoctor: "Dr. Paul M.",
    CareTaker: "Nurse Clarisse A.",
    Conditions: "Hypertension, Type 2 Diabetes",
    AssignedSince: "July 2025",
    SponsorInfo: "John N. (Toronto, Canada)",
    SponsorNumber: "+966 558441502",
  };

  const medicalHistory = [
    {
      date: "Aug 15, 2025",
      time: "10:00 AM",
      doctor: "Nurse Clarisse A.",
      diagnostic: "Routine Vitals Check",
      comments: "BP 128/78, Blood Sugar 110. Stable. No Urgent Concerns.",
    },
    {
      date: "Aug 15, 2025",
      time: "10:30 AM",
      doctor: "Dr. Robert M.",
      diagnostic: "Physical Exam",
      comments: "General Health Appears Good. Follow-Up in 6 Months.",
    },
    {
      date: "Aug 15, 2025",
      time: "11:30 AM",
      doctor: "Dr. Sarah T.",
      diagnostic: "X-Ray Interpretation",
      comments: "No Abnormalities Found In Chest X-Ray.",
    },
    {
      date: "Aug 15, 2025",
      time: "12:00 PM",
      doctor: "Nurse Leo B.",
      diagnostic: "Medication Review",
      comments:
        "Patient Adheres To Prescribed Regimen, No Side Effects Reported.",
    },
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 120,
    },
    {
      title: "Doctor/Nurse",
      dataIndex: "doctor",
      key: "doctor",
      width: 180,
    },
    {
      title: "Diagnostic",
      dataIndex: "diagnostic",
      key: "diagnostic",
      width: 200,
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      ellipsis: true,
    },
  ];

  const dataSource = medicalHistory.map((item, index) => ({
    key: index,
    ...item,
  }));

  return (
    <div style={{ display: "flex", backgroundColor: "#F7F9FB" }}>
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
            display: "flex",
            backgroundColor: "#F7F9FB",
            flexDirection: "column",
            padding: 20,
            gap: 20,
          }}
        >
          {/* cards */}
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

          <div
            style={{
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: 20,
              width: "auto",
            }}
          >
            {/* Header Row */}

            <div
              style={{
                borderTop: "1px solid #E5E7EB",
                marginBottom: "16px",
              }}
            />

            {/* Content Row */}
            <div style={{ display: "flex", gap: "16px" }}>
              {/* Left - Avatar */}
              <img
                src={patientdetails}
                alt="Profile"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              {/* Right - Info Grid */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Row 1 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2E2E2E",
                        marginBottom: 3,
                      }}
                    >
                      Name
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.name}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2E2E2E",
                        marginBottom: 3,
                      }}
                    >
                      Condition
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.Condition}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2E2E2E",
                        marginBottom: 3,
                      }}
                    >
                      Assigned Doctor
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.AssignedDoctor}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2E2E2E",
                        marginBottom: 3,
                      }}
                    >
                      Care Taker
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.CareTaker}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #E5E7EB" }} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                  }}
                >
                  {/* Row 3 */}
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2E2E2E",
                        marginBottom: 3,
                      }}
                    >
                      Condition(s)
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.Conditions}
                    </div>
                  </div>
                  <div>
                    {" "}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2E2E2E",
                        marginBottom: 3,
                      }}
                    >
                      Assigned Since
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.AssignedSince}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2E2E2E",
                        marginBottom: 3,
                      }}
                    >
                      Sponsor Info
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.SponsorInfo}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#2E2E2E",
                        marginBottom: 3,
                      }}
                    >
                      Sponsor Number
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.SponsorNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* form */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: 20,
              marginTop: 20,
            }}
          >
            <h3 style={{ marginBottom: 20, color: "#007F5F" }}>Today Report</h3>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              {/* Vitals Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Blood Pressure (Systolic/Diastolic)
                    </span>
                  }
                  name="bloodPressure"
                >
                  <Input placeholder="e.g. 120/80" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Blood Sugar (Mg/DL)
                    </span>
                  }
                  name="bloodSugar"
                >
                  <Input placeholder="e.g. 100" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Temperature (°C)
                    </span>
                  }
                  name="temperature"
                >
                  <Input placeholder="e.g. 36.6" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Oxygen Saturation (%)
                    </span>
                  }
                  name="oxygenSaturation"
                >
                  <Input placeholder="e.g. 98" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Heart Rate (BPM)
                    </span>
                  }
                  name="heartRate"
                >
                  <Input placeholder="e.g. 72" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Weight (Kg)
                    </span>
                  }
                  name="weight"
                >
                  <Input placeholder="e.g. 70" />
                </Form.Item>
              </div>

              {/* Patient Status Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Patient Status
                    </span>
                  }
                  name="patientStatus"
                >
                  <Select placeholder="Select status">
                    <Option value="stable">Stable</Option>
                    <Option value="critical">Critical</Option>
                    <Option value="recovering">Recovering</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Symptoms Observed
                    </span>
                  }
                  name="symptoms"
                >
                  <Input placeholder="e.g. Fever, cough..." />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Treatment Performed
                    </span>
                  }
                  name="treatment"
                >
                  <Select placeholder="Select treatment">
                    <Option value="medication">Medication</Option>
                    <Option value="injection">Injection</Option>
                    <Option value="observation">Observation</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Escalation + Next Check + Upload Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Escalate To Physician?
                    </span>
                  }
                  name="escalate"
                >
                  <Radio.Group>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Next Suggested Check
                    </span>
                  }
                  style={{ marginBottom: 0 }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    <Form.Item
                      name="nextDate"
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      name="nextTime"
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <TimePicker style={{ width: "100%" }} format="HH:mm" />
                    </Form.Item>
                  </div>
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      style={{
                        color: "#1B1B1B",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      Lab Report
                    </span>
                  }
                  name="labReport"
                >
                  <Upload beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                      Upload Attachments
                    </Button>
                  </Upload>
                </Form.Item>
              </div>

              {/* Notes */}
              <Form.Item
                label={
                  <span
                    style={{
                      color: "#1B1B1B",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    Care Taker Notes
                  </span>
                }
                name="notes"
              >
                <TextArea rows={4} placeholder="Add your comments here" />
              </Form.Item>

              {/* Buttons */}
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
              >
                <SecondaryBtn name="Cancel" />

                <Primarybtn name=" Submit Report" htmlType="submit" />
              </div>
            </Form>
          </div>

          {/* medical history */}
          <div style={tableContainer}>
            <SectionHeader title="Medical History">
              <Primarybtn name="Request Appointment" />
              <SecondaryBtn name="update membership" />
            </SectionHeader>

            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
              bordered
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const vitalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
  gap: 15,
  minWidth: 0,
  width: "100%",
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

const tableContainer = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };
