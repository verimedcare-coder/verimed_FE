import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import Banner from "../components/Banner";
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
import { Table } from "antd";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7));
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

  const patientInfo = [
    { label: "Name", value: "Mr. Samuel N. (VM–976–324)" },
    { label: "Condition", value: "Hypertension, Diabetes" },
    { label: "Assigned Doctor", value: "Dr. Paul M." },
    { label: "Care Taker", value: "Nurse Clarisse A." },
  ];

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

  const careTeam = {
    name: "Clarisse A.",
    role: "Geriatric Care",
    contact: "+966 558441502",
    nextVisit: "Aug 20, 2025 – 10:00 AM (Home Visit)",
    frequency: "Every 2 weeks",
    specialization:
      "Chronic disease management (hypertension, diabetes), IV therapy, palliative care",
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

  const appointments = [
    {
      id: 1,
      date: new Date(2025, 7, 14), // Aug is month index 7 (0-based)
      doctor: "Dr. Ashton Cleve",
      time: "10:00am - 10:30am",
    },
    {
      id: 2,
      date: new Date(2025, 7, 15),
      doctor: "Dr. Ashton Cleve",
      time: "10:00am - 10:30am",
    },
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleCardClick = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    navigate(`/appointments/${appointment.id}`);
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const getMonthDays = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getMonthDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const appointmentDates = appointments.map((a) => a.date.toDateString());

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

        {/* Page Content */}
        <div
          style={{
            padding: "30px",
            overflowY: "auto",
            overflowX: "hidden",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Banner */}
          <Banner />

          {/* Patient Details */}
          <div style={cardStyle}>
            <SectionHeader title="Patient Details">
              <Primarybtn name="View Full Profile" />
              <SecondaryBtn name="Download" />
            </SectionHeader>

            {/* Profile */}
            <div style={profileBox}>
              <img
                src={patientdetails}
                alt="profile"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "12px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={infoGrid}>
                {patientInfo.map((item, i) => (
                  <InfoItem key={i} label={item.label} value={item.value} />
                ))}
              </div>
            </div>

            {/* Vitals */}
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
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <div style={dotStyle(item.color)}></div>
                      <span style={vitalValue}>{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* careTeam */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              width: "100%",
              background: "#F9FAFB",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            {/* Left - Care Team Details */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                padding: "16px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {/* Header Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    margin: 0,
                    color: "#2E2E2E",
                  }}
                >
                  Care Team Details
                </h3>

                <SecondaryBtn name="view reports" onClick={() => {}} />
              </div>
              <div
                style={{ borderTop: "1px solid #E5E7EB", marginBottom: "16px" }}
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
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px 20px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>
                        Name
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>
                        {careTeam.name}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>
                        Role
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>
                        {careTeam.role}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>
                        Contact Number
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>
                        {careTeam.contact}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid #E5E7EB" }} />

                  {/* Row 2 */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px 20px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>
                        Next Visit
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>
                        {careTeam.nextVisit}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>
                        Visit Frequency
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>
                        {careTeam.frequency}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid #E5E7EB" }} />

                  {/* Row 3 */}
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Specialization
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.specialization}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Upcoming Appointments */}

            <div
              style={{
                background: "#fff",
                width: "300px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#1B1B1B",
                  }}
                >
                  Upcoming Appointments
                </p>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#B38C1D",
                    cursor: "pointer",
                  }}
                >
                  View All
                </span>
              </div>

              <div
                style={{ borderTop: "1px solid #E5E7EB", marginBottom: "8px" }}
              />

              {/* Month Row */}
              <div
                style={{
                  background: "#E8F0EA",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <button
                    onClick={handlePrevMonth}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ‹
                  </button>
                  {formatMonthYear(currentMonth)}
                  <button
                    onClick={handleNextMonth}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ›
                  </button>
                </span>

                <span
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {showCalendar ? "▲" : "▼"}
                </span>
              </div>

              {/* Calendar */}
              {showCalendar && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    marginTop: "5px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} style={{ fontWeight: 600 }}>
                      {d}
                    </div>
                  ))}
                  {monthDays.map((day) => {
                    const isAppointment = appointmentDates.includes(
                      day.toDateString()
                    );
                    return (
                      <div
                        key={day.toISOString()}
                        style={{
                          padding: "4px 0",
                          borderRadius: "4px",
                          background: isAppointment ? "#FFF8E1" : "transparent",
                          position: "relative",
                        }}
                      >
                        {day.getDate()}
                        {isAppointment && (
                          <div
                            style={{
                              width: "5px",
                              height: "5px",
                              background: "#B38C1D",
                              borderRadius: "50%",
                              position: "absolute",
                              bottom: "2px",
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Appointment Cards */}
              {/* {appointments
                .filter(
                  (a) =>
                    a.date.getMonth() === currentMonth.getMonth() &&
                    a.date.getFullYear() === currentMonth.getFullYear()
                )
                .map((appt) => {
                  const isSelected = appt.id === selectedAppointmentId;

                  return (
                    <div
                      key={appt.id}
                      onClick={() => handleCardClick(appt)}
                      style={{
                        display: "flex",
                        gap: "10px",
                        background: isSelected ? "#004C91" : "#F3F4F6",
                        color: isSelected ? "#fff" : "#000",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer",
                        transition: "transform 0.15s, box-shadow 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0,0,0,0.15)";
                        if (!isSelected) {
                          e.currentTarget.style.background = "#004E89"; // light blue on hover
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        if (!isSelected) {
                          e.currentTarget.style.background = "#F3F4F6"; // revert to original
                        }
                      }}
                    >
                      <div
                        style={{
                          background: isSelected ? "#00396E" : "#FFFFFF",
                          color: isSelected ? "#fff" : "#000",
                          borderRadius: "6px",
                          width: "45px",
                          textAlign: "center",
                          padding: "5px 0",
                        }}
                      >
                        <div style={{ fontSize: "13px" }}>
                          {appt.date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 600 }}>
                          {appt.date.getDate()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 500 }}>
                          {appt.doctor}
                        </div>
                        <div style={{ fontSize: "13px" }}>{appt.time}</div>
                      </div>
                    </div>
                  );
                })} */}
              {appointments
                .filter(
                  (a) =>
                    a.date.getMonth() === currentMonth.getMonth() &&
                    a.date.getFullYear() === currentMonth.getFullYear()
                )
                .map((appt, index) => {
                  const isSelected =
                    selectedAppointmentId === appt.id ||
                    (selectedAppointmentId === null && index === 0);

                  return (
                    <div
                      key={appt.id}
                      onClick={() => handleCardClick(appt)}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        background: isSelected ? "#004C91" : "#F3F4F6",
                        color: isSelected ? "#fff" : "#000",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer",
                        transition:
                          "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "#004E89";
                          e.currentTarget.style.color = "#fff";
                          const dateBox =
                            e.currentTarget.querySelector(".date-box");
                          dateBox.style.background = "#fff";
                          dateBox.style.color = "#00396E";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "#F3F4F6";
                          e.currentTarget.style.color = "#000";
                          const dateBox =
                            e.currentTarget.querySelector(".date-box");
                          // dateBox.style.background = "#FFFFFF";
                          // dateBox.style.color = "#000";
                          dateBox.style.background = "#004C91"; // keep blue for secondary cards
                          dateBox.style.color = "#fff"; // white text on blue
                        }
                      }}
                    >
                      {/* Date Box */}
                      <div
                        className="date-box"
                        style={{
                          background: isSelected ? "#FFFFFF" : "#FFFFFF",
                          color: isSelected ? "#000" : "#000",
                          borderRadius: "6px",
                          width: "45px",
                          textAlign: "center",
                          padding: "5px 0",
                          transition: "background 0.2s ease, color 0.2s ease",
                        }}
                      >
                        <div style={{ fontSize: "13px" }}>
                          {appt.date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 600 }}>
                          {appt.date.getDate()}
                        </div>
                      </div>

                      {/* Appointment Info */}
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 500 }}>
                          {appt.doctor}
                        </div>
                        <div style={{ fontSize: "13px" }}>{appt.time}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Medical History */}
          <div style={tableContainer}>
            <SectionHeader title="Medical History">
              <Primarybtn name="Get Appointment" />
            </SectionHeader>

            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 5 }} // Optional: adds pagination
              scroll={{ x: true }} // ✅ Enables horizontal scroll only inside table if needed
              bordered
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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

/* 🔹 Info Item (label + value) */
function InfoItem({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>
      <p
        style={{
          color: "#6B7280",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 3,
          wordBreak: "break-word",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#2E2E2E",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* 🔹 Styles */
const cardStyle = {
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  minWidth: 0,
};
const tableContainer = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  minWidth: 0,
};

const profileBox = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  border: "1px solid #E6E8EB",
  borderRadius: "10px",
  padding: "15px",
  minWidth: 0,
  flexWrap: "wrap",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "10px 20px",
  minWidth: 0,
  flex: 1,
};

const vitalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 15,
  minWidth: 0,
  width: "100%",
};

const vitalCard = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #E6E8EB",
  borderRadius: "10px",
  padding: "10px",
  minHeight: "80px",
  minWidth: 0,
};

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed", // 🚀 keeps inside container
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontSize: 14,
  fontWeight: 600,
  color: "#1B1B1B",
  borderBottom: "1px solid #E6E8EB",
  wordBreak: "break-word",
};

const tdStyle = {
  padding: "12px",
  fontSize: 14,
  color: "#374151",
  borderBottom: "1px solid #F0F2F5",
  wordBreak: "break-word", // 🚀 wrap text
};
