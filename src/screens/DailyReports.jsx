import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";

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
