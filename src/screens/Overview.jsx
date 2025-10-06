import React, { useRef, useState } from "react";
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
import { Button, Table } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Pie, Column } from "@ant-design/plots";

export default function Overview() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7));
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const scrollRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(3);

  // userdata type check
  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  if (!user) {
    window.location.href = "/";
  }

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

  const docStats = [
    {
      id: 1,
      name: "Total Appointments",
      count: 88,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 2,
      name: "Total Appointments",
      count: 58,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 3,
      name: "Completed",
      count: 20,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 4,
      name: "Pending",
      count: 24,
      diff: "+25%",
      duration: "in last 7 Days",
    },
    {
      id: 5,
      name: "Cancelled",
      count: 6,
      diff: "+15%",
      duration: "in last 7 Days",
    },
  ];

  const todaysAppointment = [
    {
      id: 1,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
    {
      id: 2,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
    {
      id: 3,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
    {
      id: 4,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
    {
      id: 5,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
  ];

  const revenuePieConfig = {
    data: [
      { type: "Total Revenue", value: 100000 },
      { type: "Total Transactions", value: 968 },
      { type: "Average Transaction", value: 8000 },
      { type: "Refunds / Failures", value: 12 },
    ],
    angleField: "value",
    colorField: "type",
    color: ["#1E90FF", "#36AC00", "#FFB020", "#EF2412"],
    radius: 0.8,
    label: {
      content: (data) => `${data.type}: ${data.value}`,
      style: {
        fontSize: 12,
      },
    },
    legend: { position: "bottom" },
    interactions: [{ type: "element-active" }],
  };

  const statusBarConfig = {
    data: [
      { month: "01", Completed: 100, Ongoing: 50, Pending: 30 },
      { month: "02", Completed: 120, Ongoing: 70, Pending: 40 },
      { month: "03", Completed: 150, Ongoing: 80, Pending: 50 },
      { month: "04", Completed: 180, Ongoing: 60, Pending: 30 },
      { month: "05", Completed: 240, Ongoing: 80, Pending: 50 },
      { month: "06", Completed: 100, Ongoing: 40, Pending: 20 },
      { month: "07", Completed: 130, Ongoing: 60, Pending: 30 },
      { month: "08", Completed: 220, Ongoing: 80, Pending: 40 },
      { month: "09", Completed: 250, Ongoing: 90, Pending: 60 },
      { month: "10", Completed: 200, Ongoing: 70, Pending: 40 },
      { month: "11", Completed: 180, Ongoing: 60, Pending: 30 },
      { month: "12", Completed: 140, Ongoing: 50, Pending: 20 },
    ],
    isStack: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
  };

  // Transform the data for stacked bars
  const transformedData = [];
  statusBarConfig.data.forEach((item) => {
    transformedData.push(
      { month: item.month, type: "Completed", value: item.Completed },
      { month: item.month, type: "Ongoing", value: item.Ongoing },
      { month: item.month, type: "Pending", value: item.Pending }
    );
  });

  const stackedBarConfig = {
    data: transformedData,
    isStack: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
    color: ["#00C49F", "#0088FE", "#FFBB28"],
    legend: { position: "bottom" },
  };

  const appointmentListData = [
    {
      key: 1,
      date: "Aug 15, 2025",
      patient: "Samuel N.",
      type: "Home Visit",
      caretaker: "Nurse Clarisse",
      time: "10:00 AM - 11:00 AM",
      status: "Ongoing",
    },
    {
      key: 2,
      date: "Aug 15, 2025",
      patient: "John D.",
      type: "Consultation",
      caretaker: "Nurse Leo",
      time: "11:30 AM - 12:00 PM",
      status: "Pending",
    },
    {
      key: 3,
      date: "Aug 16, 2025",
      patient: "Sarah T.",
      type: "Virtual",
      caretaker: "Nurse Clarisse",
      time: "09:00 AM - 09:30 AM",
      status: "Completed",
    },
    {
      key: 4,
      date: "Aug 16, 2025",
      patient: "Paul M.",
      type: "Consultation",
      caretaker: "Nurse Leo",
      time: "12:00 PM - 12:30 PM",
      status: "Cancelled",
    },
    {
      key: 5,
      date: "Aug 17, 2025",
      patient: "Robert M.",
      type: "Home Visit",
      caretaker: "Nurse Clarisse",
      time: "10:00 AM - 11:00 AM",
      status: "Rescheduled",
    },
    {
      key: 6,
      date: "Aug 17, 2025",
      patient: "Anna S.",
      type: "Consultation",
      caretaker: "Nurse Leo",
      time: "11:30 AM - 12:00 PM",
      status: "Ongoing",
    },
    {
      key: 7,
      date: "Aug 18, 2025",
      patient: "David P.",
      type: "Virtual",
      caretaker: "Nurse Clarisse",
      time: "09:00 AM - 09:30 AM",
      status: "Pending",
    },
    {
      key: 8,
      date: "Aug 18, 2025",
      patient: "Emily R.",
      type: "Consultation",
      caretaker: "Nurse Leo",
      time: "12:00 PM - 12:30 PM",
      status: "Completed",
    },
    {
      key: 9,
      date: "Aug 19, 2025",
      patient: "Michael B.",
      type: "Home Visit",
      caretaker: "Nurse Clarisse",
      time: "10:00 AM - 11:00 AM",
      status: "Ongoing",
    },
    {
      key: 10,
      date: "Aug 19, 2025",
      patient: "Linda C.",
      type: "Consultation",
      caretaker: "Nurse Leo",
      time: "11:30 AM - 12:00 PM",
      status: "Pending",
    },
    {
      key: 11,
      date: "Aug 20, 2025",
      patient: "Chris F.",
      type: "Virtual",
      caretaker: "Nurse Clarisse",
      time: "09:00 AM - 09:30 AM",
      status: "Rescheduled",
    },
  ];

  const appointmentListColumns = [
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <span>
          {record.date}
          <br />
          <span style={{ color: "#888", fontSize: 13 }}>{record.time}</span>
        </span>
      ),
      width: 150,
    },
    {
      title: "Patient Name",
      dataIndex: "patient",
      key: "patient",
      width: 140,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
    },
    {
      title: "Care Taker",
      dataIndex: "caretaker",
      key: "caretaker",
      width: 140,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 120,
      responsive: ["md"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = "#888";
        if (status === "Ongoing") color = "#27AE60";
        else if (status === "Pending") color = "#F2994A";
        else if (status === "Completed") color = "#007F5F";
        else if (status === "Cancelled") color = "#EF1E1E";
        else if (status === "Rescheduled") color = "#B78520";
        return <span style={{ color, fontWeight: 600 }}>{status}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          style={{ color: "#B78520", fontWeight: 500, padding: 0 }}
          onClick={() => alert(`Viewing details for ${record.patient}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, todaysAppointment.length));
  };

  const showLess = () => {
    setVisibleCount(3);
  };

  const hasMore = visibleCount < todaysAppointment.length;

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
            padding: "20px",
            overflowY: "auto",
            overflowX: "hidden",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Banner */}
          {user?.type === "sponsor" && <Banner />}

          {/* Patient Details */}
          {user?.type !== "doctor" &&
            (user?.type === "sponsor" || user?.type === "patient") && (
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
            )}

          {user?.type === "care" && (
            <>
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
            </>
          )}

          {/* Doctor overview stats */}
          {(user?.type === "doctor" || user?.type === "admin") && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                width: "100%",
              }}
            >
              {docStats.map((stat, idx) => (
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
          )}

          {/* Charts section */}

          {user?.type === "admin" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 20,
              }}
            >
              {/* Left: Pie Chart */}
              <div
                style={{
                  width: "50%",
                  backgroundColor: "white",
                  height: 437,
                  borderRadius: 8,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{ fontWeight: 600, fontSize: 18, color: "#1B1B1B" }}
                  >
                    Revenue Overview
                  </p>
                  <span
                    onClick={() => {}}
                    style={{
                      background: "#fff",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#1F2329",
                      cursor: "pointer",
                      border: "1px solid #0000001F",
                    }}
                  >
                    Aug 2025 <CalendarOutlined />
                  </span>
                </div>
                <Pie
                  {...revenuePieConfig}
                  style={{ height: 320, width: "100%" }}
                />
              </div>

              {/* Right: Bar Chart */}
              <div
                style={{
                  width: "50%",
                  backgroundColor: "white",
                  height: 437,
                  borderRadius: 8,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{ fontWeight: 600, fontSize: 18, color: "#1B1B1B" }}
                  >
                    Appointment Statistics
                  </p>
                  <span
                    onClick={() => {}}
                    style={{
                      background: "#fff",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#1F2329",
                      cursor: "pointer",
                      border: "1px solid #0000001F",
                    }}
                  >
                    Aug 2025 <CalendarOutlined />
                  </span>
                </div>

                {/* Top summary boxes */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  {[
                    { label: "All Appointments", value: 6314 },
                    { label: "Completed", value: 4578 },
                    { label: "Pending", value: 745 },
                    { label: "Cancelled", value: 456 },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        border: "1px solid #E7E8EB",
                        borderRadius: 8,
                        padding: "10px 5px",
                        background: "#FAFAFA",
                        marginRight: i !== 3 ? 10 : 0,
                      }}
                    >
                      <p style={{ fontSize: 12, color: "#666" }}>
                        {stat.label}
                      </p>
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#1B1B1B",
                          margin: 0,
                        }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <Column {...stackedBarConfig} style={{ height: 260 }} />
              </div>
            </div>
          )}
          {/* Appointment List */}
          {user?.type === "admin" && (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                width: "100%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                margin: 20,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 18,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 600, color: "#1B1B1B" }}>
                  Appointment List
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{
                      background: "white",
                      borderRadius: 8,
                      fontWeight: 500,
                      border: "1px solid #F0C330",
                      color: "#B78520",
                    }}
                  >
                    New Appointment
                  </Button>
                  <Button
                    icon={<CalendarOutlined />}
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      fontWeight: 500,
                      border: "1px solid #0000001F",
                      color: "#1F2329",
                    }}
                  >
                    Aug 2025
                  </Button>
                  <Button
                    icon={<FilterOutlined />}
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      fontWeight: 500,
                      border: "1px solid #F0C330",
                      color: "#B78520",
                    }}
                  ></Button>
                </div>
              </div>
              {/* Table */}
              <Table
                columns={appointmentListColumns}
                dataSource={appointmentListData}
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
                bordered
                style={{ width: "100%" }}
              />
            </div>
          )}

          {/* my details */}
          {user?.type === "care" && (
            <div
              style={{
                background: "transparent",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                padding: 20,
                width: "100%",
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
          )}

          {/* Today's Schedule */}
          {user?.type === "doctor" && (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{ color: "#1B1B1B", fontWeight: "600", fontSize: 20 }}
                >
                  Today's Schedule
                </p>
                <button
                  style={{
                    background: "#004E89",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  View All Appointments
                </button>
              </div>

              {/* Card Container */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(372px, 1fr))",
                  gap: 16,
                  marginTop: 16,
                }}
              >
                {todaysAppointment.slice(0, visibleCount).map((appt) => (
                  <div
                    key={appt.id}
                    style={{
                      height: 256,
                      borderRadius: 16,
                      padding: 20,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <img
                        alt={appt.name}
                        src={patientdetails}
                        style={{
                          height: 65,
                          width: 65,
                          borderRadius: 100,
                          objectFit: "contain",
                        }}
                      />
                      <div>
                        <p style={{ fontSize: 16, fontWeight: "600" }}>
                          {appt.name}
                        </p>
                        <p style={{ color: "#7A7D84" }}>{appt.disease}</p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#004E891F",
                            height: 22,
                            width: 82,
                            borderRadius: 20,
                          }}
                        >
                          <p style={{ fontSize: 12, color: "#004E89" }}>
                            {appt.place}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: "#E5E5E5",
                        margin: "12px 0",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM10 16.875C8.64026 16.875 7.31105 16.4718 6.18046 15.7164C5.04987 14.9609 4.16868 13.8872 3.64833 12.6309C3.12798 11.3747 2.99183 9.99237 3.2571 8.65875C3.52238 7.32513 4.17716 6.10013 5.13864 5.13864C6.10013 4.17716 7.32514 3.52237 8.65876 3.2571C9.99238 2.99183 11.3747 3.12798 12.631 3.64833C13.8872 4.16868 14.9609 5.04987 15.7164 6.18045C16.4718 7.31104 16.875 8.64025 16.875 10C16.8729 11.8227 16.1479 13.5702 14.8591 14.8591C13.5702 16.1479 11.8227 16.8729 10 16.875ZM15 10C15 10.1658 14.9342 10.3247 14.8169 10.4419C14.6997 10.5592 14.5408 10.625 14.375 10.625H10C9.83424 10.625 9.67527 10.5592 9.55806 10.4419C9.44085 10.3247 9.375 10.1658 9.375 10V5.625C9.375 5.45924 9.44085 5.30027 9.55806 5.18306C9.67527 5.06585 9.83424 5 10 5C10.1658 5 10.3247 5.06585 10.4419 5.18306C10.5592 5.30027 10.625 5.45924 10.625 5.625V9.375H14.375C14.5408 9.375 14.6997 9.44085 14.8169 9.55806C14.9342 9.67527 15 9.83424 15 10Z"
                          fill="#007F5F"
                        />
                      </svg>
                      <div>
                        <p style={{ color: "#2E2E2E", fontWeight: "600" }}>
                          {appt.date}
                        </p>
                        <p style={{ color: "#7A7D84", fontSize: 12 }}>
                          {appt.time}
                        </p>
                      </div>

                      <div
                        style={{
                          height: "100%",
                          width: 1,
                          backgroundColor: "#E5E5E5",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.375 6.99766V6.5625C14.375 4.60312 11.4195 3.125 7.5 3.125C3.58047 3.125 0.625 4.60312 0.625 6.5625V9.6875C0.625 11.3195 2.67578 12.6164 5.625 13.0047V13.4375C5.625 15.3969 8.58047 16.875 12.5 16.875C16.4195 16.875 19.375 15.3969 19.375 13.4375V10.3125C19.375 8.69531 17.3891 7.39687 14.375 6.99766ZM18.125 10.3125C18.125 11.3453 15.7195 12.5 12.5 12.5C12.2086 12.5 11.9195 12.4898 11.6344 12.4711C13.3195 11.857 14.375 10.8594 14.375 9.6875V8.26094C16.7086 8.60859 18.125 9.55234 18.125 10.3125ZM5.625 11.7383V9.87969C6.2467 9.96069 6.87304 10.0009 7.5 10C8.12696 10.0009 8.7533 9.96069 9.375 9.87969V11.7383C8.75422 11.83 8.12751 11.8757 7.5 11.875C6.87249 11.8757 6.24578 11.83 5.625 11.7383ZM13.125 8.58828V9.6875C13.125 10.343 12.1555 11.0469 10.625 11.4742V9.64844C11.6336 9.40391 12.4875 9.03984 13.125 8.58828ZM7.5 4.375C10.7195 4.375 13.125 5.52969 13.125 6.5625C13.125 7.59531 10.7195 8.75 7.5 8.75C4.28047 8.75 1.875 7.59531 1.875 6.5625C1.875 5.52969 4.28047 4.375 7.5 4.375ZM1.875 9.6875V8.58828C2.5125 9.03984 3.36641 9.40391 4.375 9.64844V11.4742C2.84453 11.0469 1.875 10.343 1.875 9.6875ZM6.875 13.4375V13.1117C7.08047 13.1195 7.28828 13.125 7.5 13.125C7.80312 13.125 8.09922 13.1148 8.38984 13.0977C8.7127 13.2132 9.04157 13.3113 9.375 13.3914V15.2242C7.84453 14.7969 6.875 14.093 6.875 13.4375ZM10.625 15.4883V13.625C11.2465 13.7085 11.8729 13.7503 12.5 13.75C13.127 13.7509 13.7533 13.7107 14.375 13.6297V15.4883C13.1316 15.6706 11.8684 15.6706 10.625 15.4883ZM15.625 15.2242V13.3984C16.6336 13.1539 17.4875 12.7898 18.125 12.3383V13.4375C18.125 14.093 17.1555 14.7969 15.625 15.2242Z"
                            fill="#007F5F"
                          />
                        </svg>
                        <div>
                          <p style={{ color: "#2E2E2E", fontWeight: "600" }}>
                            {appt.amount}
                          </p>
                          <p style={{ color: "#7A7D84", fontSize: 12 }}>
                            {appt.subscription}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <SecondaryBtn name="Patient Details" onClick={() => {}} />
                      <Primarybtn name="Visit Patient" onClick={() => {}} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More / Show Less Button */}
              {todaysAppointment.length > 3 && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  {hasMore ? (
                    <button
                      onClick={showMore}
                      style={{
                        background: "transparent",
                        color: "#004E89",
                        border: "1px solid #004E89",
                        padding: "8px 16px",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      Show More
                    </button>
                  ) : (
                    <button
                      onClick={showLess}
                      style={{
                        background: "transparent",
                        color: "#004E89",
                        border: "1px solid #004E89",
                        padding: "8px 16px",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      Show Less
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Medical Reports & Daily Reports */}
          {user?.type === "doctor" && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
                gap: 12,
              }}
            >
              <div
                style={{
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#004E89",
                  padding: 20,
                  borderRadius: 16,
                  width: "60%",
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
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    Medical Reports (Doctor Reports)
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
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                    }}
                  >
                    - Patient stable, continue medication, BP to be checked
                    daily.
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
                        fontWeight: "500",
                      }}
                    >
                      - Diabetes under control, advised diet adjustment.
                    </p>
                    <p
                      style={{
                        color: "#2E2E2E",
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
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                    }}
                  >
                    - BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable
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
              <div
                style={{
                  width: "40%",
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <p
                  style={{
                    color: "#007F5F",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Urgent Alerts
                </p>
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
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                    }}
                  >
                    Alerts Requiring Attention
                  </p>
                  <p
                    style={{
                      color: "#2E2E2E",
                    }}
                  >
                    Patient: Samuel N. – High BP 150/92 (Reported Aug 14 by
                    Nurse Clarisse)
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
                      }}
                    >
                      Patient: Samuel N. – High BP 150/92 (Reported Aug 14 by
                      Nurse Clarisse)
                    </p>
                    <p
                      style={{
                        color: "#2E2E2E",
                        fontStyle: "italic",
                      }}
                    >
                      Aug 15, 2025 – Dr. Paul
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <SecondaryBtn name="Review" onClick={() => {}} />
                    <Primarybtn name="Adjust Medication" onClick={() => {}} />
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
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                    }}
                  >
                    Alerts Requiring Attention
                  </p>
                  <p
                    style={{
                      color: "#2E2E2E",
                    }}
                  >
                    Patient: Samuel N. – High BP 150/92 (Reported Aug 14 by
                    Nurse Clarisse)
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
                      }}
                    >
                      Patient: Samuel N. – High BP 150/92 (Reported Aug 14 by
                      Nurse Clarisse)
                    </p>
                    <p
                      style={{
                        color: "#2E2E2E",
                        fontStyle: "italic",
                      }}
                    >
                      Aug 15, 2025 – Dr. Paul
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <SecondaryBtn name="Review" onClick={() => {}} />
                    <Primarybtn name="Adjust Medication" onClick={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* careTeam */}
          {user?.type === "sponsor" && (
            <>
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
                              transition:
                                "background 0.2s ease, color 0.2s ease",
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
            </>
          )}

          {/* Care Taker Details */}
          {user?.type === "patient" && (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    textAlign: "left",
                    textTransform: "capitalize",
                    color: "#2E2E2E",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Care Taker Details
                </p>
                <SecondaryBtn name="Send Message" onClick={() => {}} />
              </div>
              <div
                style={{
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#1B1B1B1A",
                  padding: 20,
                  borderRadius: 16,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 20,
                    }}
                  >
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
                    <div>
                      <p
                        style={{
                          color: "#2E2E2E",
                          fontWeight: "500",
                          opacity: 0.6,
                        }}
                      >
                        Name
                      </p>
                      <p
                        style={{
                          color: "#2E2E2E",
                          fontSize: 18,
                          fontWeight: "700",
                        }}
                      >
                        Clarissa A.
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#2E2E2E",
                        fontWeight: "500",
                        opacity: 0.6,
                      }}
                    >
                      Role
                    </p>
                    <p
                      style={{
                        color: "#2E2E2E",
                        fontSize: 18,
                        fontWeight: "700",
                      }}
                    >
                      Geriatric Care
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#2E2E2E",
                        fontWeight: "500",
                        opacity: 0.6,
                      }}
                    >
                      Contact Number
                    </p>
                    <p
                      style={{
                        color: "#2E2E2E",
                        fontSize: 18,
                        fontWeight: "700",
                      }}
                    >
                      +966 558441502
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#2E2E2E",
                        fontWeight: "500",
                        opacity: 0.6,
                      }}
                    >
                      Assigned Since
                    </p>
                    <p
                      style={{
                        color: "#2E2E2E",
                        fontSize: 18,
                        fontWeight: "700",
                      }}
                    >
                      July 2025
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
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                      opacity: 0.6,
                    }}
                  >
                    Role
                  </p>
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    Daily monitoring, vitals check, record submission
                  </p>
                </div>
              </div>
            </>
          )}

          {/* My Reports - Patient */}
          {user?.type === "patient" && (
            <div
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#004E89",
                padding: 20,
                borderRadius: 16,
                width: "100%",
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
                <p
                  style={{ color: "#2E2E2E", fontSize: 16, fontWeight: "500" }}
                >
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
                <p
                  style={{ color: "#2E2E2E", fontSize: 18, fontWeight: "600" }}
                >
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
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    - Patient stable, continue medication, BP to be checked
                    daily.
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
                      fontSize: 18,
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
                <p
                  style={{ color: "#2E2E2E", fontSize: 18, fontWeight: "600" }}
                >
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
                      fontSize: 18,
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
                      fontSize: 18,
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
          )}

          {/* Appointment Details */}
          {user?.type === "patient" && (
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
              {/* Left Section */}
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
                            background: isAppointment
                              ? "#FFF8E1"
                              : "transparent",
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
          )}

          {/* medical history */}
          {user?.type === "care" && (
            <div style={tableContainer}>
              <SectionHeader title="Medical History">
                <Primarybtn name="Get Appointment" />
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
          )}

          {/* upcoming appoinment */}
          {user?.type === "care" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  background: "#004E890A",
                  width: "auto",
                  border: "1px solid #004E89",
                  borderRadius: 12,
                  padding: 20,
                  height: "100%",
                }}
              >
                <SectionHeader title="Recent Reports">
                  <Primarybtn name="View Full History" />
                </SectionHeader>

                <div>
                  <p
                    style={{
                      margin: 0,
                      padding: "8px 0",
                      borderBottom: "1px solid #D0D5DD",
                    }}
                  >
                    Aug 15, 2025: Vitals stable. Patient doing well.
                  </p>
                  <p
                    style={{
                      margin: 0,
                      padding: "8px 0",
                      borderBottom: "1px solid #D0D5DD",
                    }}
                  >
                    Aug 14, 2025: High BP noted. Escalated to physician.
                  </p>
                  <p
                    style={{
                      margin: 0,
                      padding: "8px 0",
                    }}
                  >
                    Aug 10, 2025: Virtual consult with Dr. Paul completed.
                  </p>
                </div>
              </div>

              {/* right */}
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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

                  {/* Appointment Cards */}
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
                              transition:
                                "background 0.2s ease, color 0.2s ease",
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
          )}
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
  border: "1px solid #1B1B1B1A",
  borderRadius: "10px",
  padding: "10px",
  minHeight: "80px",
  minWidth: 0,
};

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };

/* LEFT SIDE */
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
