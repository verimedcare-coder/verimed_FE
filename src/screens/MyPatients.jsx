import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
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
import { useNavigate } from "react-router-dom";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

export default function MyPatients() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7));
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

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
    name: "Clarisse A.",
    role: "Primary Care Taker / Skilled Nurse",
    Experience: "15+",
    Languages: "English, French",
    Contact: "+966 558441502",
    specialization:
      "Hypertension, diabetes, infusion therapy, elderly mobility support",
  };

  const appointments = [
    {
      id: 1,
      date: new Date(2025, 7, 14),
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

          {/* my details */}
          <div
            style={{
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "16px",
              padding: 20,
              margin: "20px",
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
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "10px",
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
                      Experience
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.Experience}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Languages
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.Languages}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Contact Number
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.Contact}
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

          {/* my reports */}
          <div
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#004E89",
              padding: 20,
              borderRadius: 16,

              backgroundColor: "#004E890A",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ color: "#2E2E2E", fontSize: 16, fontWeight: "500" }}>
                My Reports
              </p>
              <Primarybtn name="View Full Reports" onClick={() => {}} />
            </div>
            <div
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#1B1B1B",
                opacity: 0.1,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <div>
              <p style={{ color: "#2E2E2E", fontSize: 16, fontWeight: "600" }}>
                Medical Reports (Doctor Reports)
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  - Patient stable, continue medication, BP to be checked daily.
                </p>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontStyle: "italic",
                  }}
                >
                  Aug 15, 2025 – Dr. Paul
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  - Diabetes under control, advised diet adjustment.
                </p>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontStyle: "italic",
                  }}
                >
                  Aug 15, 2025 – Dr. Paul
                </p>
              </div>
            </div>
            <div
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#1B1B1B",
                opacity: 0.1,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <div>
              <p style={{ color: "#2E2E2E", fontSize: 16, fontWeight: "600" }}>
                Daily Reports (Submitted by Care Taker)
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  - BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable
                </p>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontStyle: "italic",
                  }}
                >
                  Aug 16, 2025 – Nurse Clarisse
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  - BP: 150/92 | Status: ⚠ Escalated to Physician
                </p>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontStyle: "italic",
                  }}
                >
                  Aug 16, 2025 – Nurse Clarisse
                </p>
              </div>
            </div>
          </div>

          {/* appointments */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              width: "100%",
              background: "#F9FAFB",
              borderRadius: "10px",
            }}
          >
            {/* Left Section */}
            {/* <div style={appointmentWrapper}>
              <SectionHeader title="Appointment Details" />
              <div style={timelineWrapper}>
                <div style={timelineLine}></div> 
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
            </div> */}
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

            {/* Right Section */}
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
                width: "30%",
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
                style={{
                  borderTop: "1px solid #E5E7EB",
                  marginBottom: "8px",
                }}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
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
                  {showCalendar ? (
                    <UpOutlined style={{ fontSize: 14 }} />
                  ) : (
                    <DownOutlined style={{ fontSize: 14 }} />
                  )}
                </span>
              </div>

              {/* Calendar */}
              {showCalendar && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    marginTop: "-15px",
                    textAlign: "center",
                    fontSize: "12px",
                    padding: "10px 10px ",
                    borderBottomRightRadius: 8,
                    borderBottomLeftRadius: 8,
                    background: "#007F5F14",
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
                          borderRadius: "6px",
                          textAlign: "center",
                          background: isAppointment
                            ? "linear-gradient(180deg, #B78520, #F0C330)"
                            : "transparent",
                          color: isAppointment ? "white" : "inherit",
                          fontWeight: isAppointment ? 600 : 400,
                          transition: "background 0.3s ease",
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

                          dateBox.style.background = "#004C91";
                          dateBox.style.color = "#fff";
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

const timelineWrapper = {
  position: "relative",
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
  opacity: 0.08,
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

/* Snapshot / Right Column styles */
const snapshotWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const snapshotBox = {
  background: "#EAF6FB", // pale blue like screenshot
  border: "1px solid #CFEFF9",
  borderRadius: 10,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const lastUpdateRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 6,
};

const lastUpdateText = {
  fontSize: 12,
  color: "#6B7280",
  fontStyle: "italic",
  margin: 0,
};

const divider = {
  height: 1,
  background: "rgba(0,0,0,0.06)",
  borderRadius: 1,
  marginTop: 6,
};

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
  textAlign: "right",
};

const timelineDateRight = {
  fontSize: 12,
  fontStyle: "italic",
  color: "#6B7280",
  textAlign: "right",
  margin: 0,
};

const appointmentWrapper = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  width: "70%",
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

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };
