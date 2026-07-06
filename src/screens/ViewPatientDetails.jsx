/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import PrimaryBtn from "../components/PrimaryBtn";
import { useLocation, useNavigate } from "react-router-dom";
import bloodPressure from "../assets/icons/blood-pressure.svg";
import heartRate from "../assets/icons/heart-rate.svg";
import oxygen from "../assets/icons/oxygen.svg";
import respiratory from "../assets/icons/respiratory.svg";
import statusIcon from "../assets/icons/status.svg";
import sugar from "../assets/icons/sugar.svg";
import weight from "../assets/icons/weight.svg";
import temperature from "../assets/icons/temperature.png";
import patientdetails from "../assets/images/patient-profile.jpg";
import { DatePicker, Table, Button } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined, ArrowLeftOutlined } from "@ant-design/icons";

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

export default function ViewPatientDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentData } = location.state || {};

  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: appointmentData?.patient?.blood_pressure || "N/A",
      color: "#27AE60",
    },
    {
      icon: heartRate,
      label: "Heart Rate",
      value: appointmentData?.patient?.heartRate || "N/A",
      color: "#EF1E1E",
    },
    {
      icon: sugar,
      label: "Sugar",
      value: appointmentData?.patient?.blood_sugar || "N/A",
      color: "#27AE60",
    },
    {
      icon: oxygen,
      label: "Oxygen",
      value: appointmentData?.patient?.oxygen || "N/A",
      color: "#27AE60",
    },
    {
      icon: temperature,
      label: "Temperature",
      value: appointmentData?.patient?.temperature || "N/A",
      color: "#27AE60",
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: appointmentData?.patient?.respiratory_rate || "N/A",
      color: "#EF1E1E",
    },
    {
      icon: weight,
      label: "Weight",
      value: appointmentData?.patient?.weight || "N/A",
      color: "#27AE60",
    },
    { icon: statusIcon, label: "Status", value: "Stable", color: "#27AE60" },
  ];

  const careTeam = {
    name: appointmentData?.patient?.patient_name || "",
    Condition: appointmentData?.appointment_type,
    AssignedDoctor:
      appointmentData?.doc?.user?.first_name +
        " " +
        appointmentData?.doc?.user?.last_name || "N/A",
    // CareTaker:
    //   appointmentData?.caretaker?.user?.first_name +
    //     " " +
    //     appointmentData?.caretaker?.user?.last_name || "N/A",
    Conditions: appointmentData?.appointment_type,
    AssignedSince: appointmentData?.appointment_date || "N/A",
    SponsorInfo:
      appointmentData?.sponsor?.user?.first_name +
        " " +
        appointmentData?.sponsor?.user?.last_name || "N/A",
    SponsorNumber: appointmentData?.sponsor?.user?.phone || "N/A",
    Address: appointmentData?.patient?.patient_home_address || "N/A",
    PrimaryCareTaker:
      appointmentData?.caretaker?.user?.first_name +
        " " +
        appointmentData?.caretaker?.user?.last_name || "N/A",
    AssignedPhysician:
      appointmentData?.doc?.user?.first_name +
        " " +
        appointmentData?.doc?.user?.last_name || "N/A",
    CareCoordinator:
      appointmentData?.caretaker?.user?.first_name +
        " " +
        appointmentData?.caretaker?.user?.last_name || "N/A",
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

  // Appointment Details (left)
  const appointmentDetails = [
    {
      date: "Aug 10, 2025 – 10:00 AM",
      badge: "Physician In-Home Visit",
      type: "Home Visit",
      provider: "Nurse Clarisse A.",
      status: "Confirmed",
      comments:
        "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
    },
    {
      date: "Sep 02, 2024 – 09:30 AM",
      checkin: "Completed on time",
      vitals: "BP: 130/85 / Blood Sugar: 108 mg/dL / Temperature: 36.8 °C",
      comments:
        "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
    },
    {
      date: "Sep 01, 2024 – 11:30 AM",
      status: "Needs Monitoring",
      comments:
        "Patient stable, continue current hypertension medication. Encourage daily walking.",
      next: "Aug 24, 2025 – Virtual consult with Dr. Paul",
    },
  ];

  // Timeline (right)
  const timelineData = [
    {
      title: "Vitals Recorded",
      details: [
        "BP: 128/78 mmHg",
        "Blood Sugar: 110 mg/dL",
        "Heart Rate: 78 bpm",
      ],
      date: "Aug 15, 2025 – 11:00 am",
    },
    {
      title: "Doctor: Dr. Paul M.",
      details: [
        "Hypertension follow-up. Patient responding well to medication. Advised hydration and light exercise.",
        "Next Appointment: Aug 24, 2025 (Virtual)",
      ],
      date: "Aug 15, 2025 – 10:30 am",
    },
    {
      title: "Change: Dosage adjusted for hypertension medication.",
      details: [
        "Action: Care coordinator confirmed new prescription with local pharmacy.",
        "Sponsor Notified: Yes (Email & App Notification)",
      ],
      date: "Aug 14, 2025 – 10:30 am",
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
          {/* Back Navigation Button */}
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-start", marginBottom: -10 }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/overview")}
              style={{
                color: "#007F5F",
                fontSize: "15px",
                fontWeight: 600,
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Back to Overview
            </Button>
          </div>

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
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid #EAEAEA",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: "100%",
            }}
          >
            <SectionHeader title="My details">
              <PrimaryBtn
                name="Edit Report"
                onClick={() =>
                  navigate("/doctor_form", { state: { appointmentData } })
                }
              />
            </SectionHeader>

            {/* Profile Banner */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                flexWrap: "wrap",
                background: "#F8FAFC",
                padding: "18px 24px",
                borderRadius: "12px",
                border: "1px solid #F1F5F9",
              }}
            >
              <img
                src={
                  appointmentData
                    ? appointmentData?.patient?.photo_view_url
                    : patientdetails
                }
                alt="Profile"
                style={{
                  width: "76px",
                  height: "76px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "2px solid #007F5F",
                  boxShadow: "0 4px 12px rgba(0, 127, 95, 0.15)",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#1E293B" }}>
                  {careTeam.name || "Unknown Patient"}
                </span>
                <span style={{ fontSize: "14px", color: "#64748B", fontWeight: 500 }}>
                  Condition:{" "}
                  <strong style={{ color: "#007F5F" }}>
                    {careTeam.Condition || "General"}
                  </strong>
                </span>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {[
                { label: "Assigned Doctor", value: careTeam.AssignedDoctor },
                { label: "Care Taker", value: careTeam.CareTaker },
                { label: "Condition(s)", value: careTeam.Conditions },
                { label: "Assigned Since", value: careTeam.AssignedSince },
                { label: "Sponsor Info", value: careTeam.SponsorInfo },
                { label: "Sponsor Number", value: careTeam.SponsorNumber },
                { label: "Address", value: careTeam.Address },
                { label: "Primary Care Taker", value: careTeam.PrimaryCareTaker },
                { label: "Assigned Physician", value: careTeam.AssignedPhysician },
                { label: "Care Coordinator", value: careTeam.CareCoordinator },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#FAFAFA",
                    border: "1px solid #E5E7EB",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1F2937",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* medical history */}
          <div style={tableContainer}>
            <SectionHeader title="Medical History">
              <DatePicker
                picker="year"
                defaultValue={dayjs("2025", "YYYY")}
                suffixIcon={<CalendarOutlined />}
                style={{ width: 100 }}
              />
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
          {/* Appointment Details + Timeline */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 20,
              width: "100%",
            }}
          >
            {/* LEFT: Appointment Details Timeline */}
            <div style={appointmentWrapper}>
              <SectionHeader title="Appointment Details" />
              <div style={timelineWrapper}>
                <div style={timelineLine}></div> {/* vertical line */}
                {appointmentDetails.map((item, index) => (
                  <div key={index} style={timelineItem}>
                    <div style={timelineDot}></div>
                    <div style={timelineContent}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: -10,
                        }}
                      >
                        <p style={apptDate}>{item.date} </p>
                        <p>
                          {item.badge && (
                            <span style={badge}>{item.badge}</span>
                          )}
                        </p>
                      </div>
                      {item.type && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          Type:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.type}
                          </span>
                        </p>
                      )}
                      {item.provider && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          Assigned Provider:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.provider}
                          </span>
                        </p>
                      )}
                      {item.status && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          Status:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.status}
                          </span>
                        </p>
                      )}
                      {item.checkin && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          Check-in Status:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.checkin}
                          </span>
                        </p>
                      )}
                      {item.vitals && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          Vitals Recorded:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.vitals}
                          </span>
                        </p>
                      )}
                      {item.comments && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          Comments:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.comments}
                          </span>
                        </p>
                      )}
                      {item.next && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          Next Appointment:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.next}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Timeline */}
            <div style={timelineCard}>
              <SectionHeader title="Timeline" />
              {timelineData.map((item, index) => (
                <div key={index} style={timelineBox}>
                  <p
                    style={{ fontSize: 14, fontWeight: 400, color: "#2E2E2E" }}
                  >
                    {item.title}
                  </p>
                  {Array.isArray(item.details) ? (
                    item.title === "Vitals Recorded" ? (
                      <ul>
                        {item.details.map((d, i) => (
                          <li
                            style={{
                              fontSize: 14,
                              fontWeight: 400,
                              color: "#06152BB2",
                            }}
                            key={i}
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      item.details.map((d, i) => (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "#06152BB2",
                          }}
                          key={i}
                        >
                          {d}
                        </p>
                      ))
                    )
                  ) : (
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#06152BB2",
                      }}
                    >
                      {item.details}
                    </p>
                  )}
                  <p style={timelineDate}>{item.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Visit Reports & Clinical Documentation (#A) */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              border: "1px solid #007F5F33",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#007F5F",
                    margin: 0,
                  }}
                >
                  Doctor Visit Reports & Clinical Documentation
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  Upload results, medical records, diagnostic images, voice notes, and recorded vitals from this appointment. Submitting will automatically notify the sponsor via email.
                </p>
              </div>
              <PrimaryBtn
                name="Submit Visit Reports"
                onClick={() =>
                  navigate("/doctor_form", { state: { appointmentData } })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const dotStyle = (color) => ({
  width: "8px",
  height: "8px",
  background: color,
  borderRadius: "50%",
  flexShrink: 0,
});
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
const vitalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
  gap: 15,
  minWidth: 0,
  width: "100%",
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

const appointmentWrapper = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const timelineWrapper = {
  position: "relative",
  marginLeft: 20,
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const timelineLine = {
  position: "absolute",
  left: 5,
  top: 0,
  bottom: 0,
  width: 2,
  background: "#2E2E2E",
  opacity: 0.1,
};

const timelineItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: 15,
  position: "relative",
};

const timelineDot = {
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: "#004E89",
  marginTop: 5,
  flexShrink: 0,
  zIndex: 1,
};

const timelineContent = {
  background: "#004E890A",
  border: "1px solid #E6E8EB",
  borderRadius: "10px",
  padding: "15px",
  flex: 1,
  gap: 16,
};

const apptDate = {
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 8,
  color: "#2E2E2E",
};

const badge = {
  background: "#FFFFFF",
  color: "#2E2E2E",
  fontSize: 12,
  fontWeight: 500,
  padding: "2px 8px",
  borderRadius: "6px",
  border: "1px solid #1B1B1B33",
  marginLeft: 10,
};

/* RIGHT SIDE */
const timelineCard = {
  background: "transparent",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #007F5F4D",
};

const timelineBox = {
  marginBottom: 20,
  position: "relative",
  borderBottom: "1px solid #007F5F4D",
  paddingBottom: 20,
};

const timelineDate = {
  fontSize: 12,
  fontStyle: "italic",
  color: "#6B7280",
  position: "absolute",
  bottom: -5,
  right: 8,
};
