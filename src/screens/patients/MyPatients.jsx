/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { myPatientsService } from "../../services/myPatientsService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import bloodPressure from "../../assets/icons/blood-pressure.svg";
import heartRate from "../../assets/icons/heart-rate.svg";
import oxygen from "../../assets/icons/oxygen.svg";
import respiratory from "../../assets/icons/respiratory.svg";
import statusIcon from "../../assets/icons/status.svg";
import sugar from "../../assets/icons/sugar.svg";
import weight from "../../assets/icons/weight.svg";
import temperature from "../../assets/icons/temperature.png";
import Primarybtn from "../../components/common/PrimaryBtn";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { useNavigate } from "react-router-dom";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { Empty, message } from "antd";
import { resolveMediaUrl } from "../../constants/constants";
import apiClient from "../../services/apiClient";


export default function MyPatients() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const token = localStorage.getItem("token");

  const location = useLocation();
  const { appointmentData } = location.state || {};
  const caretaker = appointmentData?.caretaker || {};

  const getVitalColor = (label, value) => {
    if (!value || value === "N/A") return "#BDBDBD";

    switch (label) {
      case "Blood Pressure": {
        const match = value.match(/(\d+)\/(\d+)/);
        if (!match) return "#BDBDBD";
        const [sys, dia] = match.slice(1).map(Number);
        return sys > 130 || dia > 85 ? "#EF1E1E" : "#27AE60";
      }
      case "Blood Sugar": {
        const num = parseInt(value);
        return num > 110 ? "#EF1E1E" : "#27AE60";
      }
      case "Heart Rate": {
        const num = parseInt(value);
        return num > 100 || num < 60 ? "#EF1E1E" : "#27AE60";
      }
      case "Oxygen": {
        const num = parseInt(value);
        return num < 95 ? "#EF1E1E" : "#27AE60";
      }
      case "Temperature": {
        const num = parseFloat(value);
        return num > 100.4 ? "#EF1E1E" : "#27AE60";
      }
      case "Respiratory Rate": {
        const num = parseInt(value);
        return num > 20 ? "#EF1E1E" : "#27AE60";
      }
      case "Weight": {
        const num = parseInt(value);
        return num > 90 ? "#F39C12" : "#27AE60";
      }
      case "Status":
        return value === "Stable" ? "#27AE60" : "#EF1E1E";
      default:
        return "#27AE60";
    }
  };

  const [careTakerData, setCareTakerData] = useState(() => {
    try {
      const careTakerDataRaw = localStorage.getItem("careTakerData");
      return careTakerDataRaw &&
        careTakerDataRaw !== "undefined" &&
        careTakerDataRaw !== "null"
        ? JSON.parse(careTakerDataRaw)
        : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!token || careTakerData?.id) return;
    let currentUser = null;
    try {
      const rawUser = localStorage.getItem("userData");
      currentUser =
        rawUser && rawUser !== "undefined" && rawUser !== "null"
          ? JSON.parse(rawUser)
          : null;
    } catch {
      currentUser = null;
    }
    if (!currentUser || currentUser.user_role !== "care_taker") return;
    let isMounted = true;
    const resolveCaretakerProfile = async () => {
      try {
        const res = await apiClient.get("/caretakerprofile_list/");
        const list = Array.isArray(res.data) ? res.data : [];
        const matched = list.find((ct) => ct?.user?.id === currentUser.id);
        if (matched && isMounted) {
          localStorage.setItem("careTakerData", JSON.stringify(matched));
          setCareTakerData(matched);
        }
      } catch (err) {
        console.error("Error resolving caretaker profile:", err);
      }
    };
    resolveCaretakerProfile();
    return () => {
      isMounted = false;
    };
  }, [token, careTakerData?.id]);
  const { data: allAppointments = [] } = useQuery({
    queryKey: ["allAppointments", careTakerData?.id || "all"],
    queryFn: async () => {
      const data = await myPatientsService.getAllAppointments();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token && !!careTakerData?.id,
  });

  const patient = useMemo(() => {
    return allAppointments.find((appt) => appt?.caretaker?.id === careTakerData?.id) || null;
  }, [allAppointments, careTakerData?.id]);

  console.log("patient data", patient);

  const activeAppt = appointmentData || patient || {};
  const activeCaretaker = activeAppt?.caretaker || {};

  // Create the vitals array with color
  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: activeAppt?.patient?.blood_pressure || "N/A",
    },
    {
      icon: heartRate,
      label: "Heart Rate",
      value: activeAppt?.patient?.heart_rate || "N/A",
    },
    {
      icon: sugar,
      label: "Blood Sugar",
      value: activeAppt?.patient?.blood_sugar || "N/A",
    },
    {
      icon: oxygen,
      label: "Oxygen",
      value: activeAppt?.patient?.oxygen || activeAppt?.oxygen || "N/A",
    },
    {
      icon: temperature,
      label: "Temperature",
      value: activeAppt?.patient?.temperature || "N/A",
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: activeAppt?.patient?.respiratory_rate || "N/A",
    },
    {
      icon: weight,
      label: "Weight",
      value: activeAppt?.patient?.weight || activeAppt?.weight || "N/A",
    },
    {
      icon: statusIcon,
      label: "Status",
      value: activeAppt?.appointment_status || "pending",
    },
  ].map((v) => ({ ...v, color: getVitalColor(v.label, v.value) }));

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

  const caretakerUser = activeCaretaker?.user || {};
  const caretakerFullName = [caretakerUser.first_name, caretakerUser.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const careTeam = {
    name: caretakerFullName || "N/A",
    role: "Caretaker",
    contact: caretakerUser.phone || "N/A",
    assignedSince: activeAppt?.appointment_date || "N/A",
    address: activeAppt?.patient?.patient_home_address || "N/A",
    nextVisit: activeAppt?.appointment_date || "N/A",
    frequency: "Weekly",
    specialization: activeCaretaker?.skillset || "General Care",
    experience: activeCaretaker?.caretaker_exprience || "N/A",
    languages: activeCaretaker?.languages || "N/A",
    avatar: resolveMediaUrl(
      caretakerUser.photo_view_url || caretakerUser.photo,
      patientdetails,
    ),
  };

  const appointments = activeAppt?.id
    ? [
        {
          ...activeAppt,
          id: activeAppt?.id,
          doctor: activeAppt?.doc?.user?.id
            ? `${activeAppt?.doc?.user?.first_name} ${activeAppt?.doc?.user?.last_name}`
            : "N/A",
          date: activeAppt?.appointment_date
            ? new Date(activeAppt?.appointment_date)
            : null,
          time: activeAppt?.appointment_time || "N/A",
          type: activeAppt?.appointment_type || "N/A",
        },
      ]
    : [];

  const handlePrevMonth = () => {
    if (currentMonth) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      );
    }
  };

  const handleNextMonth = () => {
    if (currentMonth) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      );
    }
  };

  const handleCardClick = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    navigate("/view_patient_details", {
      state: { appointmentData: appointment },
    });
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
    currentMonth ? currentMonth.getFullYear() : new Date().getFullYear(),
    currentMonth ? currentMonth.getMonth() : new Date().getMonth()
  );

  const appointmentDates = appointments.map((a) =>
    a.date && typeof a.date.toDateString === "function"
      ? a.date.toDateString()
      : ""
  );

  const appointmentDetails = activeAppt?.id
    ? [
        {
          date: activeAppt.appointment_date
            ? new Date(activeAppt.appointment_date).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              ) + ` – ${activeAppt.appointment_time?.slice(0, 5) || ""}`
            : "N/A",
          type: activeAppt.appointment_type || "N/A",
          provider: activeAppt.doc?.doctor_id || "N/A",
          status: activeAppt.appointment_status || "N/A",
          comments: activeAppt.care_taker_notes || "",
          checkin: activeAppt.checkin_status || "N/A",
          vitals:
            [
              activeAppt?.patient?.blood_pressure &&
                `BP: ${activeAppt.patient.blood_pressure}`,
              activeAppt?.patient?.blood_sugar &&
                `Sugar: ${activeAppt.patient.blood_sugar}`,
              activeAppt?.patient?.temperature &&
                `Temp: ${activeAppt.patient.temperature}`,
            ]
              .filter(Boolean)
              .join(" | ") || "N/A",
          next: activeAppt.next_appointment || "N/A",
          badge: activeAppt.badge || "",
        },
      ]
    : [];

  return (
    <div className="flex bg-[#F7F9FB]">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>
        {/* Content area with just text */}
        <div
          className="flex bg-[#F7F9FB] flex-col p-[24px] gap-[24px] overflow-y-auto"
        >
          {/* cards */}

          <div className="grid grid-cols-[repeat(4,minmax(180px,1fr))] gap-[16px] min-w-0 w-full">
            {vitals.map((item, i) => (
              <div key={i} className="flex items-center gap-[12px] border border-solid border-[#E2E8F0] bg-white rounded-[12px] p-[16px] min-h-[80px] min-w-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
                <div className="bg-[#F8FAFC] p-[8px] rounded-[8px]">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-[28px] h-[28px]"
                  />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#64748B] mb-[4px] m-0">{item.label}</p>
                  <div
                    className="flex items-center gap-[6px]"
                  >
                    <div className="w-[10px] h-[10px] rounded-full shrink-0 shadow-[0_0_0_3px_rgba(255,255,255,0.8)]" style={{ background: item.color }}></div>
                    <span className="text-[16px] font-bold text-[#0F172A] break-words">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Care Team Details */}
          <div className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-[1px] border-solid border-[#F0F2F5] transition-all duration-300 flex flex-col gap-[20px] font-['Inter',sans-serif]">
            {/* Header */}
            <div className="flex justify-between items-center border-b-[1px] border-solid border-[#F0F2F5] pb-[16px]">
              <h2 className="text-[18px] font-bold text-[#1E293B] m-0">Care Team Details</h2>
              <Primarybtn name="View Full Care Team" onClick={() => navigate("/care_team")} />
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-[20px]">
              <img
                src={careTeam.avatar || patientdetails}
                alt="Care Team Profile"
                className="w-[80px] h-[80px] rounded-[100px] object-cover border-[3px] border-solid border-[#007F5F]"
              />
              <div>
                <p className="text-[#64748B] text-[13px] font-bold tracking-wide uppercase m-0 mb-[4px]">
                  {careTeam.role || "Primary CareTaker"}
                </p>
                <h3 className="text-[#0F172A] text-[24px] font-extrabold m-0 leading-tight">
                  {careTeam.name}
                </h3>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] bg-[#F8FAFC] p-[16px] rounded-[12px] border-[1px] border-solid border-[#E2E8F0]">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-[4px]">Contact Number</span>
                <span className="text-[15px] font-semibold text-[#334155]">{careTeam.contact || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-[4px]">Assigned Since</span>
                <span className="text-[15px] font-semibold text-[#334155]">{careTeam.assignedSince || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-[4px]">Address</span>
                <span className="text-[15px] font-semibold text-[#334155] truncate" title={careTeam.address || "N/A"}>{careTeam.address || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* my reports */}          <div
            className="p-[20px] rounded-[16px] bg-[#004E890A] border-[1px] border-solid border-[#004E89]"
          >
            <div
              className="flex items-center justify-between"
            >
              <p className="text-[#2E2E2E] text-[16px] font-medium">
                My Reports
              </p>
              <Primarybtn
                name="View Patient Details"
                onClick={() =>
                  navigate("/view_patient_details", {
                    state: {
                      appointmentData:
                        appointmentData || patient || appointments[0] || {},
                    },
                  })
                }
              />
            </div>

            <div
              className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
            />

            {/* <div>
              <p className="text-[#2E2E2E] text-[16px] font-semibold">
                Medical Reports (Doctor Reports)
              </p>
              {[
                {
                  text: "Patient stable, continue medication, BP to be checked daily.",
                  date: "Aug 15, 2025",
                  author: "Dr. Paul",
                },
                {
                  text: "Diabetes under control, advised diet adjustment.",
                  date: "Aug 15, 2025",
                  author: "Dr. Paul",
                },
              ].map((report, index) => (
                <div
                  key={`med-${index}`}
                  className="flex flex-row items-center justify-between"
                >
                  <p className="text-[#2E2E2E] text-[16px] font-medium">
                    - {report.text}
                  </p>
                  <p
                    className="text-[#2E2E2E] text-[16px] italic"
                  >
                    {report.date} – {report.author}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
            />

            <div>
              <p className="text-[#2E2E2E] text-[16px] font-semibold">
                Daily Reports (Submitted by Care Taker)
              </p>
              {[
                {
                  text: "BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable",
                  date: "Aug 16, 2025",
                  author: "Nurse Clarisse",
                },
                {
                  text: "BP: 150/92 | Status: ⚠ Escalated to Physician",
                  date: "Aug 16, 2025",
                  author: "Nurse Clarisse",
                },
              ].map((report, index) => (
                <div
                  key={`daily-${index}`}
                  className="flex flex-row items-center justify-between"
                >
                  <p className="text-[#2E2E2E] text-[16px] font-medium">
                    - {report.text}
                  </p>
                  <p
                    className="text-[#2E2E2E] text-[16px] italic"
                  >
                    {report.date} – {report.author}
                  </p>
                </div>
              ))}
            </div> */}
            <Empty description="no data" />
          </div>

          {/* appointments */}
          <div
            className="flex gap-[24px] w-full flex-col lg:flex-row"
          >
            {/* Left Section */}

            <div className="bg-white rounded-[16px] border border-solid border-[#E2E8F0] p-[24px] flex flex-col gap-[20px] lg:w-[65%] xl:w-[70%] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <SectionHeader title="Appointment Details">
                <Primarybtn
                  name="View Patient Details"
                  onClick={() =>
                    navigate("/view_patient_details", {
                      state: {
                        appointmentData:
                          appointmentData || patient || appointments[0] || {},
                      },
                    })
                  }
                />
              </SectionHeader>
              <div className="relative flex flex-col gap-[20px]">
                <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-[#2E2E2E] opacity-10"></div> {/* vertical line */}
                {appointmentDetails.map((item, index) => (
                  <div key={index} className="flex items-start gap-[15px] relative">
                    <div className="w-[12px] h-[12px] rounded-full bg-[#004E89] mt-[5px] shrink-0 z-[1]"></div>
                    <div className="bg-[#004E890A] border-[1px] border-solid border-[#E6E8EB] rounded-[10px] p-[15px] flex-1 gap-[16px]">
                      <div
                        className="flex justify-between items-center mb-[-10]"
                      >
                        <p className="text-[12px] font-semibold mb-[8px] text-[#2E2E2E]">{item.date} </p>
                        <p>
                          {item.badge && (
                            <span className="bg-white text-[#2E2E2E] text-[12px] font-medium py-[2px] px-[8px] rounded-[6px] border-[1px] border-solid border-[#1B1B1B33] ml-[10px]">{item.badge}</span>
                          )}
                        </p>
                      </div>
                      {item.type && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Type:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.type}
                          </span>
                        </p>
                      )}
                      {item.provider && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Assigned Provider:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.provider}
                          </span>
                        </p>
                      )}
                      {item.status && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Status:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.status}
                          </span>
                        </p>
                      )}
                      {item.checkin && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Check-in Status:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.checkin}
                          </span>
                        </p>
                      )}
                      {item.vitals && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Vitals Recorded:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.vitals}
                          </span>
                        </p>
                      )}
                      {item.comments && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Comments:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.comments}
                          </span>
                        </p>
                      )}
                      {item.next && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Next Appointment:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
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
              className="bg-white rounded-[16px] border-[1px] border-solid border-[#E2E8F0] p-[24px] flex flex-col gap-[20px] lg:w-[35%] xl:w-[30%] shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center"
              >
                <p
                  className="text-[16px] font-medium text-[#1B1B1B]"
                >
                  Upcoming Appointments
                </p>
                <span
                  className="text-[14px] text-[#B38C1D] cursor-pointer"
                >
                  View All
                </span>
              </div>

              <div
                className="mb-[8px] border-t-[1px] border-solid border-[#E5E7EB]"
              />

              {/* Month Row */}
              <div
                className="bg-[#E8F0EA] rounded-[6px] py-[6px] px-[10px] text-[14px] flex justify-between items-center"
              >
                <span
                  className="flex items-center gap-[8px]"
                >
                  <button
                    onClick={handlePrevMonth}
                    className="border-none bg-transparent cursor-pointer text-[16px]"
                  >
                    ‹
                  </button>
                  {formatMonthYear(currentMonth)}
                  <button
                    onClick={handleNextMonth}
                    className="border-none bg-transparent cursor-pointer text-[16px]"
                  >
                    ›
                  </button>
                </span>

                <span
                  className="cursor-pointer text-[18px]"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {showCalendar ? (
                    <UpOutlined className="text-[14px]" />
                  ) : (
                    <DownOutlined className="text-[14px]" />
                  )}
                </span>
              </div>

              {/* Calendar */}
              {showCalendar && (
                <div
                  className="grid grid-cols-7 gap-[4px] -mt-[15px] text-center text-[12px] py-[10px] px-[10px] rounded-b-[8px] bg-[#007F5F14]"
                >
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                    <div key={`${d}-${idx}`} className="font-semibold">
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
                        className={`py-[4px] px-0 rounded-[6px] text-center transition-colors duration-300 relative ${isAppointment ? "bg-gradient-to-b from-[#B78520] to-[#F0C330] text-white font-semibold" : "bg-transparent text-inherit font-normal"}`}
                      >
                        {day.getDate()}
                        {isAppointment && (
                          <div
                            className="w-[5px] h-[5px] bg-[#B38C1D] rounded-full absolute bottom-[2px] left-1/2 -translate-x-1/2"
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
                    a.date &&
                    typeof a.date.getMonth === "function" &&
                    typeof a.date.getFullYear === "function" &&
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
                      className={`flex gap-[10px] items-center rounded-[8px] p-[10px] cursor-pointer transition-all duration-200 group ${isSelected ? "bg-[#004C91] text-white" : "bg-[#F3F4F6] text-black hover:bg-[#004E89] hover:text-white"}`}
                    >
                      {/* Date Box */}
                      <div
                        className={`date-box rounded-[6px] w-[45px] text-center py-[5px] px-0 transition-all duration-200 ${isSelected ? "bg-white text-black" : "bg-white text-black group-hover:bg-white group-hover:text-[#00396E]"}`}
                      >
                        <div className="text-[13px]">
                          {appt.date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-[16px] font-semibold">
                          {appt.date.getDate()}
                        </div>
                      </div>

                      {/* Appointment Info */}
                      <div className="grow">
                        <div className="text-[14px] font-medium">
                          {appt.doctor}
                        </div>
                        <div className="text-[13px]">{appt.time}</div>
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
      className="flex justify-between items-center flex-wrap gap-[10px] min-w-0"
    >
      <p className="text-[16px] font-semibold text-[#1B1B1B]">{title}</p>
      <div className="flex gap-[10px] flex-wrap">
        {children}
      </div>
    </div>
  );
}
