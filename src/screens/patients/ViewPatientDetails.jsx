/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React, { useMemo } from "react";
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
import { CalendarOutlined, ArrowLeftOutlined } from "@ant-design/icons";
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
  const appointmentDetails = [];

  // Timeline (right)
  const timelineData = [];

  return (
    <div
      className="flex h-screen bg-[#F7F9FB]"
    >
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
        <div className="p-[20px] overflow-y-auto gap-[20px] flex flex-col items-center overflow-x-hidden">
          {/* Back Navigation Button */}
          <div className="w-full flex justify-start mb-[-10]">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/overview")}
              className="text-[#007F5F] text-[15px] font-semibold p-0 flex items-center gap-[6px]"
            >
              Back to Overview
            </Button>
          </div>

          {/* cards */}
          <div className="grid grid-cols-[repeat(4,minmax(180px,1fr))] gap-[15px] min-w-0 w-full">
            {vitals.map((item, i) => (
              <div key={i} className="flex items-center gap-[10px] border border-solid border-[#1B1B1B1A] rounded-[10px] p-[10px] min-h-[80px] min-w-0">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-[24px] h-[24px] shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <p className="text-[14px] font-semibold mb-[2px]">{item.label}</p>
                  <div className="flex items-center gap-[5px]">
                    <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: item.color }}></div>
                    <span className="text-[14px] text-[#2E2E2E] break-words">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-solid border-[#EAEAEA] flex flex-col gap-[24px] w-full">
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
              className="flex gap-[20px] items-center flex-wrap bg-[#F8FAFC] py-[18px] px-[24px] rounded-[12px] border-[1px] border-solid border-[#F1F5F9]"
            >
               <img
                src={getPhotoUrl(
                  pData?.photo_view_url || pData?.photo
                )}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = patientdetails;
                }}
                className="w-[76px] h-[76px] rounded-[16px] object-cover shrink-0 border-2 border-solid border-[#007F5F] shadow-[0_4px_12px_rgba(0,127,95,0.15)]"
              />
              <div className="flex flex-col gap-[4px]">
                <span className="text-[20px] font-bold text-[#1E293B]">
                  {careTeam.name || "Unknown Patient"}
                </span>
                <span className="text-[14px] text-[#64748B] font-medium">
                  Condition:{" "}
                  <strong className="text-[#007F5F]">
                    {careTeam.Condition || "General"}
                  </strong>
                </span>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[16px]">
              {[
                { label: "Phone Number", value: careTeam.Phone },
                { label: "Email Address", value: careTeam.Email },
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
                  className="bg-[#FAFAFA] border-[1px] border-solid border-[#E5E7EB] rounded-[10px] py-[14px] px-[16px] flex flex-col gap-[6px]"
                >
                  <div className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">
                    {item.label}
                  </div>
                  <div className="text-[14px] font-semibold text-[#1F2937] break-words">
                    {item.value || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* medical history */}
          <div className="bg-white rounded-[12px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] w-full flex flex-col gap-[16px] min-w-0">
            <SectionHeader title="Medical History">
              <DatePicker
                picker="year"
                defaultValue={dayjs("2025", "YYYY")}
                suffixIcon={<CalendarOutlined />}
                className="w-[100px]"
              />
            </SectionHeader>

            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
              bordered
              className="w-full"
            />
          </div>
          {/* Appointment Details + Timeline */}
          <div className="grid grid-cols-[2fr_1fr] gap-[20px] w-full">
            {/* LEFT: Appointment Details Timeline */}
            <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-[20px]">
              <SectionHeader title="Appointment Details" />
              <div className="relative ml-[20px] flex flex-col gap-[20px]">
                <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-[#2E2E2E] opacity-10"></div> {/* vertical line */}
                {appointmentDetails.map((item, index) => (
                  <div key={index} className="flex items-start gap-[15px] relative">
                    <div className="w-[12px] h-[12px] rounded-full bg-[#004E89] mt-[5px] shrink-0 z-10"></div>
                    <div className="bg-[#004E890A] border border-solid border-[#E6E8EB] rounded-[10px] p-[15px] flex-1 gap-[16px]">
                      <div className="flex justify-between items-center mb-[-10px]">
                        <p className="text-[12px] font-semibold mb-[8px] text-[#2E2E2E]">{item.date} </p>
                        <p>
                          {item.badge && (
                            <span className="bg-white text-[#2E2E2E] text-[12px] font-medium py-[2px] px-[8px] rounded-[6px] border border-solid border-[#1B1B1B33] ml-[10px]">{item.badge}</span>
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

            {/* RIGHT: Timeline */}
            <div className="bg-transparent rounded-[12px] p-[20px] flex flex-col border border-solid border-[#007F5F4D]">
              <SectionHeader title="Timeline" />
              {timelineData.map((item, index) => (
                <div key={index} className="mb-[20px] relative border-b border-solid border-[#007F5F4D] pb-[20px]">
                  <p
                    className="text-[14px] font-normal text-[#2E2E2E]"
                  >
                    {item.title}
                  </p>
                  {Array.isArray(item.details) ? (
                    item.title === "Vitals Recorded" ? (
                      <ul>
                        {item.details.map((d, i) => (
                          <li
                            className="text-[14px] font-normal text-[#06152BB2]"
                            key={i}
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      item.details.map((d, i) => (
                        <p
                          className="text-[14px] font-normal text-[#06152BB2]"
                          key={i}
                        >
                          {d}
                        </p>
                      ))
                    )
                  ) : (
                    <p
                      className="text-[14px] font-normal text-[#06152BB2]"
                    >
                      {item.details}
                    </p>
                  )}
                  <p className="text-[12px] italic text-[#6B7280] absolute bottom-[-5px] right-[8px]">{item.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Visit Reports & Clinical Documentation (#A) */}
          <div className="bg-white rounded-[12px] p-[24px] flex flex-col gap-[16px] w-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-solid border-[#007F5F33]">
            <div
              className="flex justify-between items-center flex-wrap gap-[12px]"
            >
              <div>
                <h3
                  className="text-[18px] font-semibold text-[#007F5F] m-0"
                >
                  Doctor Visit Reports & Clinical Documentation
                </h3>
                <p
                  className="text-[13px] text-[#6B7280] m-[4px 0 0 0]"
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


