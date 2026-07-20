/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React, { useMemo, useEffect, useRef } from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import { useLocation, useNavigate } from "react-router-dom";
import bloodPressure from "../../assets/icons/blood-pressure.svg";
import heartRate from "../../assets/icons/heart-rate.svg";
import oxygen from "../../assets/icons/oxygen.svg";
import respiratory from "../../assets/icons/respiratory.svg";
import statusIcon from "../../assets/icons/status.svg";
import sugar from "../../assets/icons/sugar.svg";
import weight from "../../assets/icons/weight.svg";
import temperature from "../../assets/icons/temperature.png";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { DatePicker, Table, Button } from "antd";
import dayjs from "dayjs";
import { CalendarOutlined } from "@ant-design/icons";
import BackButton from "../../components/common/BackButton";
import { useQuery } from "@tanstack/react-query";
import { myLovedOnesService } from "../../services/myLovedOnesService";
import { base_url } from "../../constants/constants";

function SectionHeader({ title, children }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-[10px] min-w-0">
      <p className="text-[16px] font-semibold text-[#1B1B1B]">{title}</p>
      <div className="flex gap-[10px] flex-wrap">
        {children}
      </div>
    </div>
  );
}

export default function ViewPatientDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentData } = location.state || {};
  const initialPData = appointmentData?.patient || appointmentData || {};

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  const token = localStorage.getItem("token");
  const storedSponsorId = localStorage.getItem("sponsorProfileId") || initialPData?.sponsorid || initialPData?.sponsor;

  const { data: sponsorPatients = [] } = useQuery({
    queryKey: ["sponsorPatients", storedSponsorId],
    queryFn: async () => {
      if (!storedSponsorId || storedSponsorId === "null" || storedSponsorId === "undefined") return [];
      const data = await myLovedOnesService.getSponsorPatients(storedSponsorId);
      return data || [];
    },
    enabled: !!storedSponsorId && storedSponsorId !== "null" && storedSponsorId !== "undefined" && !!token,
  });

  const livePatient = useMemo(() => {
    if (!initialPData?.id) return null;
    return sponsorPatients.find((p) => Number(p.id) === Number(initialPData.id)) || null;
  }, [sponsorPatients, initialPData]);

  const pData = livePatient ? { ...initialPData, ...livePatient } : initialPData;

  const getPhotoUrl = (url) => {
    if (!url || typeof url !== "string" || url === "null" || url === "undefined") return patientdetails;
    if (url?.startsWith("http")) return url;
    url = url.replace(/^\/media\/+/i, "/");
    const base = base_url.replace(/\/+$/, "");
    const cleanedUrl = url.replace(/^\/+/, "");
    return `${base}/${cleanedUrl}`;
  };

  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: pData?.blood_pressure || "N/A",
      color: "#27AE60",
    },
    {
      icon: heartRate,
      label: "Heart Rate",
      value: pData?.heart_rate || pData?.heartRate || "N/A",
      color: "#EF1E1E",
    },
    {
      icon: sugar,
      label: "Sugar",
      value: pData?.blood_sugar || "N/A",
      color: "#27AE60",
    },
    {
      icon: oxygen,
      label: "Oxygen",
      value: pData?.oxygen || "N/A",
      color: "#27AE60",
    },
    {
      icon: temperature,
      label: "Temperature",
      value: pData?.temperature || "N/A",
      color: "#27AE60",
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: pData?.respiratory_rate || "N/A",
      color: "#EF1E1E",
    },
    {
      icon: weight,
      label: "Weight",
      value: pData?.weight || "N/A",
      color: "#27AE60",
    },
    { icon: statusIcon, label: "Status", value: "Stable", color: "#27AE60" },
  ];

  const docUser = appointmentData?.doc?.user || pData?.doctor?.user || {};
  const docName = docUser.first_name || docUser.last_name
    ? `${docUser.first_name || ""} ${docUser.last_name || ""}`.trim()
    : pData?.doctor_name || "N/A";

  const caretakerUser = appointmentData?.caretaker?.user || pData?.caretaker?.user || {};
  const caretakerName = caretakerUser.first_name || caretakerUser.last_name
    ? `${caretakerUser.first_name || ""} ${caretakerUser.last_name || ""}`.trim()
    : pData?.caretaker_name || "N/A";

  const sponsorUser = appointmentData?.sponsor?.user || pData?.sponsor?.user || {};
  const sponsorName = sponsorUser.first_name || sponsorUser.last_name
    ? `${sponsorUser.first_name || ""} ${sponsorUser.last_name || ""}`.trim()
    : pData?.sponsor_name || "N/A";
  const sponsorPhone = sponsorUser.phone || pData?.sponsor?.phone || "N/A";

  const patientPhone = pData?.phone || sponsorPhone || "N/A";
  const patientEmail = pData?.email || "N/A";

  const careTeam = {
    name: pData?.patient_name || appointmentData?.patient_name || "Unknown Patient",
    Condition: appointmentData?.appointment_type || pData?.medical_his_diagnosis || "N/A",
    Phone: patientPhone,
    Email: patientEmail,
    AssignedDoctor: docName,
    CareTaker: caretakerName,
    Conditions: appointmentData?.appointment_type || pData?.medical_his_diagnosis || "N/A",
    AssignedSince: appointmentData?.appointment_date || pData?.created_at?.split("T")[0] || "N/A",
    SponsorInfo: sponsorName,
    SponsorNumber: sponsorPhone,
    Address: pData?.patient_home_address || "N/A",
    PrimaryCareTaker: caretakerName,
    AssignedPhysician: docName,
    CareCoordinator: caretakerName,
  };

  const medicalHistory = [];

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
  const appointmentDetails = appointmentData ? [
    {
      date: appointmentData.appointment_date
        ? new Date(appointmentData.appointment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ` – ${appointmentData.appointment_time?.slice(0, 5)}`
        : "N/A",
      type: appointmentData.appointment_type || "N/A",
      provider: docName,
      status: appointmentData.appointment_status || "N/A",
      comments: [appointmentData.care_taker_notes, appointmentData.doctor_notes].filter(Boolean).join("\n\n") || "No comments",
    }
  ] : [];

  // Timeline (right)
  const timelineData = appointmentData?.time_line
    ? appointmentData.time_line.split("|").map((entry) => {
      const [dateStr, status] = entry.split(":").map((s) => s.trim());
      return {
        title: status,
        details: [
          appointmentData.treatment_performed || "No treatment info",
          [appointmentData.care_taker_notes, appointmentData.doctor_notes].filter(Boolean).join("\n") || "",
        ],
        date: new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    })
    : [];
  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden font-['Inter',sans-serif]">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0 bg-white border-r border-[#E5E7EB] z-10">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <div className="shrink-0 bg-white border-b border-[#E5E7EB] z-10">
          <Header />
        </div>

        {/* Scrollable Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-[16px] lg:p-[24px]">
          <div className="w-full flex flex-col gap-[20px] box-border">
            {/* Top Bar */}
            <div className="flex items-center w-full">
              <BackButton fallbackPath="/overview" />
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-[20px] p-[24px] shadow-sm border border-[#E5E7EB] w-full flex flex-col md:flex-row gap-[24px] items-start md:items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[8px] bg-gradient-to-r from-[#004E89] to-[#007F5F]"></div>

              <img
                src={getPhotoUrl(pData?.photo_view_url || pData?.photo)}
                alt="Profile"
                onError={(e) => { e.target.onerror = null; e.target.src = patientdetails; }}
                className="w-[100px] h-[100px] rounded-[16px] object-cover border-[4px] border-[#F3F4F6] shadow-md shrink-0"
              />

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex flex-wrap items-center gap-[12px] mb-[4px]">
                  <h1 className="text-[28px] font-bold text-[#111827] m-0 truncate leading-tight">
                    {careTeam.name || "Unknown Patient"}
                  </h1>
                  <span className="bg-[#E6F0FA] text-[#004E89] px-[12px] py-[4px] rounded-full text-[13px] font-semibold border border-[#BFDBFE]">
                    Condition: {careTeam.Condition || "General"}
                  </span>
                </div>
                <p className="text-[#6B7280] text-[15px] m-0 mb-[16px] flex items-center gap-[6px]">
                  Assigned Since: <span className="font-semibold text-[#374151]">{careTeam.AssignedSince}</span>
                </p>
                <div className="flex gap-[12px]">
                  <PrimaryBtn name="Edit Report" onClick={() => navigate("/doctor_form", { state: { appointmentData } })} />
                </div>
              </div>
            </div>

            {/* Vitals Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', width: '100%' }}>
              {vitals.map((item, i) => (
                <div key={i} className="bg-white rounded-[16px] p-[16px] border border-[#E5E7EB] shadow-sm flex items-center gap-[16px] hover:shadow-md transition-shadow min-w-0">
                  <div className="bg-[#F3F4F6] p-[12px] rounded-[12px] shrink-0">
                    <img src={item.icon} alt={item.label} className="w-[24px] h-[24px]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide m-0 mb-[2px] truncate">{item.label}</p>
                    <div className="flex items-center gap-[6px]">
                      <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: item.color }}></div>
                      <span className="text-[16px] font-bold text-[#111827] truncate">{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Info Stack */}
            <div className="flex flex-col gap-[24px] w-full min-w-0">

              {/* Contact & Care Team Details */}
              <div className="bg-white rounded-[20px] p-[24px] border border-[#E5E7EB] shadow-sm w-full min-w-0">
                <h2 className="text-[18px] font-bold text-[#111827] border-b border-[#E5E7EB] pb-[16px] mb-[20px] m-0">Patient & Care Team Info</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[20px] w-full">
                  {[
                    { label: "Phone Number", value: careTeam.Phone },
                    { label: "Email Address", value: careTeam.Email },
                    { label: "Assigned Doctor", value: careTeam.AssignedDoctor },
                    { label: "Primary Care Taker", value: careTeam.PrimaryCareTaker },
                    { label: "Sponsor Info", value: careTeam.SponsorInfo },
                    { label: "Address", value: careTeam.Address }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col min-w-0 bg-[#F9FAFB] p-[16px] rounded-[12px] border border-[#F3F4F6]">
                      <span className="text-[12px] font-semibold text-[#6B7280] uppercase mb-[4px] tracking-wide truncate">{item.label}</span>
                      <span className="text-[14px] font-bold text-[#111827] truncate" title={item.value || "N/A"}>{item.value || "N/A"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline (Moved below Patient Info, now full width) */}
              <div className="bg-gradient-to-br from-[#004C91] to-[#0066C0] rounded-[20px] p-[24px] shadow-md border border-[#003B73] text-white  min-w-0">
                <h2 className="text-[18px] font-bold text-white border-b border-[#ffffff33] pb-[16px] mb-[24px] m-0 tracking-wide">Appointment Timeline</h2>

                <div className="flex flex-col md:flex-row gap-[24px] overflow-x-auto pb-[8px] min-w-0 w-full">
                  {timelineData.map((item, index) => (
                    <div key={index} className="relative min-w-[250px] flex-1 flex flex-col gap-[12px] border-l-2 md:border-l-0 md:border-t-2 border-[#ffffff33] pl-[20px] md:pl-0 md:pt-[20px] py-[10px] md:py-0">
                      {/* Timeline Dot */}
                      <div className="absolute left-[-6px] top-[14px] md:left-[0px] md:top-[-6px] w-[10px] h-[10px] rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.15)]"></div>

                      <div className="flex flex-col gap-[4px] min-w-0">
                        <span className="text-[15px] font-bold text-white leading-tight break-words">{item.title}</span>
                        <span className="text-[12px] text-[#93C5FD] font-semibold">{item.date}</span>

                        <div className="mt-[8px] bg-[#ffffff14] border border-[#ffffff10] rounded-[8px] p-[12px] backdrop-blur-sm h-full">
                          {Array.isArray(item.details) ? (
                            item.title === "Vitals Recorded" ? (
                              <ul className="pl-[16px] m-0 list-disc">
                                {item.details.map((d, i) => <li key={i} className="text-[13px] text-white opacity-90 break-words">{d}</li>)}
                              </ul>
                            ) : (
                              item.details.map((d, i) => <p key={i} className="text-[13px] text-white opacity-90 m-0 break-words">{d}</p>)
                            )
                          ) : (
                            <p className="text-[13px] text-white opacity-90 m-0 break-words">{item.details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {timelineData.length === 0 && (
                    <div className="text-[#93C5FD] text-center text-[14px] py-[20px] w-full bg-[#ffffff0d] rounded-[8px] border border-[#ffffff10]">No timeline events found.</div>
                  )}
                </div>
              </div>

              {/* Medical History Table */}
              <div className="bg-white rounded-[20px] p-[24px] border border-[#E5E7EB] shadow-sm w-full min-w-0">
                <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-[16px] mb-[20px] flex-wrap gap-[12px]">
                  <h2 className="text-[18px] font-bold text-[#111827] m-0">Medical History</h2>
                  <DatePicker picker="year" defaultValue={dayjs("2025", "YYYY")} suffixIcon={<CalendarOutlined />} className="w-[120px] h-[36px] rounded-[8px]" />
                </div>
                <div className="overflow-x-auto w-full">
                  <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }} className="min-w-[600px]" />
                </div>
              </div>

              {/* Doctor Visit Reports */}
              <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] rounded-[20px] p-[24px] border border-[#BBF7D0] shadow-sm w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[20px]">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[18px] font-bold text-[#166534] m-0 mb-[6px]">Doctor Visit Reports & Docs</h3>
                  <p className="text-[14px] text-[#15803D] m-0 leading-relaxed">Upload results, medical records, diagnostic images, and voice notes. Submitting automatically notifies the sponsor.</p>
                </div>
                <button onClick={() => navigate("/doctor_form", { state: { appointmentData } })} className="bg-[#16A34A] hover:bg-[#15803D] text-white px-[24px] py-[12px] rounded-[10px] font-bold transition-colors shrink-0 cursor-pointer border-none shadow-[0_2px_4px_rgba(22,163,74,0.3)] hover:shadow-md">
                  Submit Reports
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


