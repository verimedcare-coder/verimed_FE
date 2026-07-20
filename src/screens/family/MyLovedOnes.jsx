/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { myLovedOnesService } from "../../services/myLovedOnesService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import Primarybtn from "../../components/common/PrimaryBtn";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import bloodPressure from "../../assets/icons/blood-pressure.svg";
import heartRate from "../../assets/icons/heart-rate.svg";
import oxygen from "../../assets/icons/oxygen.svg";
import respiratory from "../../assets/icons/respiratory.svg";
import statusIcon from "../../assets/icons/status.svg";
import sugar from "../../assets/icons/sugar.svg";
import weight from "../../assets/icons/weight.svg";
import temperature from "../../assets/icons/temperature.png";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { Table, message, Modal, Form, Input, Upload, Button, Select, DatePicker, AutoComplete } from "antd";
import dayjs from "dayjs";
import { getData } from "country-list";
import { UploadOutlined, EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { base_url } from "../../constants/constants";

import { useNavigate } from "react-router-dom";

const calculateAge = (dob) => {
  if (!dob) return "N/A";
  const diff = Date.now() - new Date(dob).getTime();
  const age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970);
};

const NOT_KNOWN_OPTIONS = [
  { label: "Not Known at time of enrolment", value: "Not Known at time of enrolment" },
];
const BLOOD_GROUP_OPTIONS = [
  { label: "A+", value: "A+" },
  { label: "A−", value: "A−" },
  { label: "B+", value: "B+" },
  { label: "B−", value: "B−" },
  { label: "AB+", value: "AB+" },
  { label: "AB−", value: "AB−" },
  { label: "O+", value: "O+" },
  { label: "O−", value: "O−" },
  { label: "Not Known at time of enrolment", value: "Not Known at time of enrolment" },
];
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];
const YES_NO_NOT_KNOWN_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Not Known at time of enrolment", value: "Not Known at time of enrolment" },
];

export default function MyLovedOnes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [vitalsData, setVitalsData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);

  const countryOptions = useMemo(() => {
    return getData().map((country) => ({
      label: country.name,
      value: country.code,
    }));
  }, []);



  const token = localStorage.getItem("token");
  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

  const [selectedPatientId, setSelectedPatientId] = useState(() =>
    localStorage.getItem("selectedPatientId")
  );

  useEffect(() => {
    const handlePatientChange = () => {
      setSelectedPatientId(localStorage.getItem("selectedPatientId"));
    };
    window.addEventListener("patientChanged", handlePatientChange);
    window.addEventListener("storage", handlePatientChange);
    return () => {
      window.removeEventListener("patientChanged", handlePatientChange);
      window.removeEventListener("storage", handlePatientChange);
    };
  }, []);

  const cleanedPatientId = Number(selectedPatientId);

  const { data: medicalReports = [] } = useQuery({
    queryKey: ["lovedOnesMedicalHistory", cleanedPatientId],
    queryFn: async () => {
      const data = await myLovedOnesService.getPatientAppointments(cleanedPatientId);
      return (data || []).map((item, index) => ({
        key: index,
        appointment_date: item.appointment_date,
        appointment_time: item.appointment_time,
        doctor: item.doc?.user
          ? `${item.doc.user.first_name} ${item.doc.user.last_name}`
          : "—",
        appointment_type: item.appointment_type,
        care_taker_notes: [item.care_taker_notes, item.doctor_notes].filter(Boolean).join("\n") || "",
        treatment_performed: item.treatment_performed,
      }));
    },
    enabled: !isNaN(cleanedPatientId) && cleanedPatientId > 0 && !!token,
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "appointment_date",
      key: "appointment_date",
      width: 120,
    },
    {
      title: "Time",
      dataIndex: "appointment_time",
      key: "appointment_time",
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
      dataIndex: "treatment_performed",
      key: "treatment_performed",
      width: 200,
    },
    {
      title: "Comments",
      dataIndex: "care_taker_notes",
      key: "care_taker_notes",
      ellipsis: true,
    },
  ];


  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  if (!user) {
    window.location.href = "/";
  }

  const sponsorId = localStorage.getItem("sponsorProfileId");

  const getPhotoUrl = (url) => {
    if (!url || typeof url !== "string" || url === "null" || url === "undefined") return patientdetails;
    if (url?.startsWith("http")) return url;
    url = url.replace(/^\/media\/+/i, "/");
    const base = base_url.replace(/\/+$/, "");
    const cleanedUrl = url.replace(/^\/+/, "");
    return `${base}/${cleanedUrl}`;
  };

  const storedSponsorId = localStorage.getItem("sponsorProfileId") || sponsorId;
  const { data: sponsorPatients = [] } = useQuery({
    queryKey: ["sponsorPatients", storedSponsorId],
    queryFn: async () => {
      const data = await myLovedOnesService.getSponsorPatients(storedSponsorId);
      if (Array.isArray(data)) {
        localStorage.setItem("sponsorPatientData", JSON.stringify(data));
      }
      return data || [];
    },
    enabled: !!storedSponsorId && storedSponsorId !== "null" && storedSponsorId !== "undefined" && storedSponsorId !== "0" && !!token,
  });

  const patientData = useMemo(() => {
    return sponsorPatients.find((p) => p.id === cleanedPatientId) || null;
  }, [sponsorPatients, cleanedPatientId]);

  const handleEditOpen = () => {
    if (!patientData) return;
    editForm.setFieldsValue({
      name: patientData.patient_name || "",
      phone: patientData.phone || "",
      email: patientData.email || "",
      age: patientData.age || "",
      patient_dob: patientData.patient_dob ? dayjs(patientData.patient_dob) : null,
      patient_gender: patientData.patient_gender || "",
      blood_group: patientData.blood_group || "",
      height: patientData.height || "",
      weight: patientData.weight || "",
      blood_pressure: patientData.blood_pressure || patientData.bp || "",
      heart_rate: patientData.heart_rate || patientData.heartRate || "",
      blood_sugar: patientData.blood_sugar || patientData.sugar || "",
      oxygen: patientData.oxygen || "",
      temperature: patientData.temperature || "",
      respiratory_rate: patientData.respiratory_rate || patientData.respiratoryRate || "",
      country_code: patientData.country_code || "",
      patient_home_address: patientData.patient_home_address || "",
      primary_language: patientData.primary_language || "",
      religion: patientData.religion || "",
      emer_con_name: patientData.emer_con_name || "",
      emer_con_relation: patientData.emer_con_relation || "",
      emer_con_country_code: patientData.emer_con_country_code || "",
      emer_con_phone: patientData.emer_con_phone || "",
      local_con_name: patientData.local_con_name || "",
      local_con_relation: patientData.local_con_relation || "",
      local_con_country_code: patientData.local_con_country_code || "",
      local_con_phone: patientData.local_con_phone || "",
      condition: patientData.medical_his_diagnosis || "",
      medical_his_cancer: patientData.medical_his_cancer || "",
      medical_his_major_surgeries: patientData.medical_his_major_surgeries || "",
      medical_his_curr_symp: patientData.medical_his_curr_symp || "",
      last_doctor_visit: patientData.last_doctor_visit || "",
      has_regular_doctor: patientData.has_regular_doctor || "",
      regular_doctor_name: patientData.regular_doctor_name || "",
      allergies_drug: patientData.allergies_drug || "",
      allergies_food: patientData.allergies_food || "",
      photo: undefined,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    setEditLoading(true);
    try {
      const storedSponsorId =
        localStorage.getItem("sponsorProfileId") ||
        patientData?.sponsorid ||
        patientData?.sponsor ||
        0;
      const formattedDOB =
        values.patient_dob && dayjs.isDayjs(values.patient_dob)
          ? values.patient_dob.format("YYYY-MM-DD")
          : values.patient_dob || "";
      const patientprofile_data = {
        id: Number(patientData.id),
        patient_profile_updateid: Number(patientData.id),
        updateid: Number(patientData.id),
        patientprofileid: Number(patientData.id),
        patient_name: values.name || "",
        phone: values.phone || "",
        email: values.email || "",
        age: values.age || "",
        patient_dob: formattedDOB,
        patient_gender: values.patient_gender || "",
        blood_group: values.blood_group || "",
        height: values.height || "",
        weight: values.weight || "",
        blood_pressure: values.blood_pressure || "",
        heart_rate: values.heart_rate || "",
        blood_sugar: values.blood_sugar || "",
        oxygen: values.oxygen || "",
        temperature: values.temperature || "",
        respiratory_rate: values.respiratory_rate || "",
        country_code: values.country_code || patientData.country_code || "",
        patient_home_address: values.patient_home_address || "",
        primary_language: values.primary_language || "",
        religion: values.religion || "",
        emer_con_name: values.emer_con_name || "",
        emer_con_relation: values.emer_con_relation || "",
        emer_con_country_code: values.emer_con_country_code || "",
        emer_con_phone: values.emer_con_phone || "",
        local_con_name: values.local_con_name || "",
        local_con_relation: values.local_con_relation || "",
        local_con_country_code: values.local_con_country_code || "",
        local_con_phone: values.local_con_phone || "",
        medical_his_diagnosis: values.condition || "",
        medical_his_cancer: values.medical_his_cancer || "",
        medical_his_major_surgeries: values.medical_his_major_surgeries || "",
        medical_his_curr_symp: values.medical_his_curr_symp || "",
        last_doctor_visit: values.last_doctor_visit || "",
        has_regular_doctor: values.has_regular_doctor || "",
        regular_doctor_name: values.regular_doctor_name || "",
        allergies_drug: values.allergies_drug || "",
        allergies_food: values.allergies_food || "",
        reason_enrollment: patientData.reason_enrollment || patientData.reason || "Loved One",
        reason: patientData.reason_enrollment || patientData.reason || "Loved One",
        sponsorid: Number(storedSponsorId),
        sponsor: Number(storedSponsorId),
      };
      const formData = new FormData();
      formData.append("patientprofile_update_data", JSON.stringify(patientprofile_data));
      formData.append("patientprofile_data", JSON.stringify(patientprofile_data));
      if (values.photo && values.photo.length > 0) {
        const fileObj = values.photo[0].originFileObj || values.photo[0];
        formData.append("patient_photo", fileObj);
        formData.append("photo", fileObj);
        formData.append("user_photo", fileObj);
      }
      await myLovedOnesService.patchPatientProfile(formData);
      message.success("Loved one profile updated successfully!");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sponsorPatients"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["lovedOnesMedicalHistory"] });
    } catch (error) {
      console.error("Error updating loved one:", error);
      message.error("Failed to update loved one profile.");
    } finally {
      setEditLoading(false);
    }
  };

  const getVitalColor = (label, value) => {
    if (!value) return "#BDBDBD";
    switch (label) {
      case "Blood Pressure": {
        const match = value.match(/(\d+)\/(\d+)/);
        if (!match) return "#BDBDBD";
        const [sys, dia] = match.slice(1).map(Number);
        if (sys > 130 || dia > 85) return "#EF1E1E";
        return "#27AE60";
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

  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: vitalsData?.blood_pressure || "N/A",
      color: getVitalColor("Blood Pressure", vitalsData?.blood_pressure),
    },
    {
      icon: heartRate,
      label: "Heart Rate",
      value: vitalsData?.heart_rate || "N/A",
      color: getVitalColor("Heart Rate", vitalsData?.heart_rate),
    },
    {
      icon: sugar,
      label: "Blood Sugar",
      value: vitalsData?.blood_sugar || "N/A",
      color: getVitalColor("Blood Sugar", vitalsData?.blood_sugar),
    },
    {
      icon: oxygen,
      label: "Oxygen",
      value: vitalsData?.oxygen || "N/A",
      color: getVitalColor("Oxygen", vitalsData?.oxygen),
    },
    {
      icon: temperature,
      label: "Temperature",
      value: vitalsData?.temperature || "N/A",
      color: getVitalColor("Temperature", vitalsData?.temperature),
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: vitalsData?.respiratory_rate || "N/A",
      color: getVitalColor("Respiratory Rate", vitalsData?.respiratory_rate),
    },
    {
      icon: weight,
      label: "Weight",
      value: vitalsData?.weight || "N/A",
      color: getVitalColor("Weight", vitalsData?.weight),
    },
    {
      icon: statusIcon,
      label: "Status",
      value: vitalsData?.status || "N/A",
      color: getVitalColor("Status", vitalsData?.status),
    },
  ];

  const appointmentDetailsDynamic = vitalsData
    ? [
        {
          date: vitalsData.appointment_date
            ? new Date(vitalsData.appointment_date).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              ) + ` – ${vitalsData.appointment_time?.slice(0, 5)}`
            : "N/A",
          type: vitalsData.appointment_type || "N/A",
          provider: vitalsData.doc?.doctor_id || "N/A",
          status: vitalsData.appointment_status || "N/A",
          comments: [vitalsData.care_taker_notes, vitalsData.doctor_notes].filter(Boolean).join("\n\n") || "",
        },
      ]
    : [];

  const timelineDataDynamic = vitalsData
    ? vitalsData.time_line
      ? vitalsData.time_line.split("|").map((entry) => {
          const [dateStr, status] = entry.split(":").map((s) => s.trim());
          return {
            title: status,
            details: [
              vitalsData.treatment_performed || "No treatment info",
              [vitalsData.care_taker_notes, vitalsData.doctor_notes].filter(Boolean).join("\n") || "",
            ],
            date: new Date(dateStr).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          };
        })
      : []
    : [];

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
        <div className="bg-[#F7F9FB] p-[30px] overflow-y-auto gap-[20px] flex flex-col items-center overflow-x-hidden">
          {/* Content area */}
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

          {/* patient details */}
          <div className="rounded-[12px] p-[20px] w-full flex flex-col gap-[20px] min-w-0">
            <SectionHeader title="Patient Details">
              <div className="flex items-center gap-[12px]">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  className="bg-[#007F5F] rounded-[20px] font-medium border border-solid border-[#007F5F]"
                  onClick={handleEditOpen}
                >
                  Edit Profile & Photo
                </Button>
                <p
                  className="text-[14px] font-medium text-[#2E2E2E] m-0 italic"
                >
                  Renewal Due Aug 25, 2025
                </p>
              </div>
            </SectionHeader>

            {/* Profile */}
            <div className="flex items-center gap-[20px] border border-solid border-[#E6E8EB] rounded-[10px] p-[15px] min-w-0 flex-wrap">
              <img
                src={getPhotoUrl(
                  patientData?.photo_view_url || patientData?.photo
                )}
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = patientdetails;
                }}
                className="w-[64px] h-[64px] rounded-[12px] shrink-0 object-cover"
              />

              <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[10px_20px] min-w-0 flex-1">
                {patientData ? (
                  <>
                    <InfoItem
                      label="Name"
                      value={`${patientData?.patient_name} (${patientData?.id})`}
                    />
                    <InfoItem
                      label="Age/Gender"
                      value={`${
                        patientData?.age ||
                        calculateAge(patientData?.date_of_birth)
                      } Years / ${patientData?.gender}`}
                    />
                    <InfoItem
                      label="Relationship"
                      value={patientData?.relation || "Mother"}
                    />
                    <InfoItem
                      label="Primary Diagnosis"
                      value={
                        patientData?.diagnosis
                          ? Array.isArray(patientData.diagnosis)
                            ? patientData.diagnosis.map((d) => d.name || JSON.stringify(d)).join(", ")
                            : typeof patientData.diagnosis === "object"
                            ? patientData.diagnosis.name || JSON.stringify(patientData.diagnosis)
                            : patientData.diagnosis
                          : "Hypertension Type 2 Diabetes"
                      }
                    />
                    <InfoItem
                      label="Primary Doctor"
                      value={patientData?.primary_doctor || "Dr. Sarah Johnson"}
                    />
                    <InfoItem
                      label="Allergies"
                      value={
                        patientData?.allergies
                          ? Array.isArray(patientData.allergies)
                            ? patientData.allergies.map((a) => a.name || JSON.stringify(a)).join(", ")
                            : typeof patientData.allergies === "object"
                            ? patientData.allergies.name || JSON.stringify(patientData.allergies)
                            : patientData.allergies
                          : "Penicillin"
                      }
                    />
                    <InfoItem
                      label="Current Medication"
                      value={
                        patientData?.medication
                          ? Array.isArray(patientData.medication)
                            ? patientData.medication
                                .map((m) => m.name || JSON.stringify(m))
                                .join(", ")
                            : typeof patientData.medication === "object"
                            ? patientData.medication.name || JSON.stringify(patientData.medication)
                            : patientData.medication
                          : "Lisinopril 10mg"
                      }
                    />
                    <InfoItem
                      label="Insurance Provider"
                      value={patientData?.insurance || "BlueShield"}
                    />
                  </>
                ) : (
                  <p className="text-[#999]">Loading patient details...</p>
                )}
              </div>
            </div>
            {/* Vitals */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[15px] min-w-0 w-full">
              {vitals.map((item, i) => (
                <div key={i} className="flex items-center gap-[10px] border border-solid border-[#1B1B1B1A] rounded-[10px] p-[10px] min-h-[80px] min-w-0">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-[24px] h-[24px] shrink-0"
                  />
                  <div>
                    <p className="text-[14px] font-semibold mb-[2px]">{item.label}</p>
                    <div className="flex items-center gap-[5px]">
                      <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: item.color }}></div>
                      <span className="text-[14px] text-[#2E2E2E] break-words">{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* medical history */}
          <div className="bg-white rounded-[12px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] w-full flex flex-col gap-[16px] min-w-0">
            <SectionHeader title="Medical History">
              <Primarybtn
                name="Request Appointment"
                onClick={() => navigate("/appointments", { state: { openBookingModal: true } })}
              />
              {/* <SecondaryBtn name="update membership" /> */}
            </SectionHeader>

            <Table
              columns={columns}
              dataSource={medicalReports}
              pagination={{ pageSize: 5 }}
              // scroll={{ x: true }}
              bordered
              className="w-full"
            />
          </div>

          {/* Appointment Details + Timeline */}
          <div className="grid grid-cols-[2fr_1fr] gap-[20px] w-full">
            {/* LEFT: Appointment Details Timeline */}
            {/* <div style={appointmentWrapper}>
              <SectionHeader title="Appointment Details" />
              <div style={timelineWrapper}>
                <div style={timelineLine}></div>
                {appointmentDetails.map((item, index) => (
                  <div key={index} style={timelineItem}>
                    <div style={timelineDot}></div>
                    <div style={timelineContent}>
                      <div
                        className="flex justify-between items-center mb-[-10]"
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

           
            <div style={timelineCard}>
              <SectionHeader title="Timeline" />
              {timelineData.map((item, index) => (
                <div key={index} style={timelineBox}>
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
                  <p style={timelineDate}>{item.date}</p>
                </div>
              ))}
            </div> */}
            {/* LEFT: Appointment Details Timeline */}
            <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-[20px]">
              <SectionHeader title="Appointment Details" />
              <div className="relative ml-[20px] flex flex-col gap-[20px]">
                <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-[#2E2E2E] opacity-10"></div>
                {appointmentDetailsDynamic.map((item, index) => (
                  <div key={index} className="flex items-start gap-[15px] relative">
                    <div className="w-[12px] h-[12px] rounded-full bg-[#004E89] mt-[5px] shrink-0 z-10"></div>
                    <div className="bg-[#004E890A] border border-solid border-[#E6E8EB] rounded-[10px] p-[15px] flex-1 gap-[16px]">
                      <div className="flex justify-between items-center mb-[-10px]">
                        <p className="text-[12px] font-semibold mb-[8px] text-[#2E2E2E]">{item.date}</p>
                      </div>
                      {item.type && (
                        <p className="text-[14px] font-medium text-[#2E2E2E]">
                          Type:{" "}
                          <span className="text-[#06152B99]">
                            {item.type}
                          </span>
                        </p>
                      )}
                      {item.provider && (
                        <p className="text-[14px] font-medium text-[#2E2E2E]">
                          Assigned Provider:{" "}
                          <span className="text-[#06152B99]">
                            {item.provider}
                          </span>
                        </p>
                      )}
                      {item.status && (
                        <p className="text-[14px] font-medium text-[#2E2E2E]">
                          Status:{" "}
                          <span className="text-[#06152B99]">
                            {item.status}
                          </span>
                        </p>
                      )}
                      {item.comments && (
                        <p className="text-[14px] font-medium text-[#2E2E2E]">
                          Comments:{" "}
                          <span className="text-[#06152B99]">
                            {item.comments}
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
              {timelineDataDynamic.map((item, index) => (
                <div key={index} className="mb-[20px] relative border-b border-solid border-[#007F5F4D] pb-[20px]">
                  <p className="text-[14px] font-normal text-[#2E2E2E]">
                    {item.title}
                  </p>
                  {Array.isArray(item.details) && item.details.length > 0 ? (
                    <ul>
                      {item.details.map((d, i) => (
                        <li
                          key={i}
                          className="text-[14px] font-normal text-[#06152BB2]"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[14px] font-normal text-[#06152BB2]">
                      No details available
                    </p>
                  )}
                  <p className="text-[12px] italic text-[#6B7280] absolute bottom-[-5px] right-[8px]">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Loved One Modal (#B) */}
      <Modal
        title="Edit Profile & Photo"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={720}
        centered
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-[16px]"
        >
          <div className="max-h-[68vh] overflow-y-auto pr-[8px]">
            <h3>1. Personal Information</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input placeholder="Enter patient name" />
              </Form.Item>
              <Form.Item label="Upload New Photo" name="photo" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList}>
                <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                  <Button icon={<UploadOutlined />}>Select Photo</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Age" name="age">
                <Input placeholder="Age" />
              </Form.Item>
              <Form.Item label="Date of Birth" name="patient_dob">
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item label="Gender" name="patient_gender">
                <Select
                  className="w-full"
                  placeholder="Select Gender"
                  options={GENDER_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Blood Group" name="blood_group">
                <Select
                  className="w-full"
                  placeholder="Select Blood Group"
                  options={BLOOD_GROUP_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Height" name="height">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 175 cm or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Weight" name="weight">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 70 kg or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Blood Pressure" name="blood_pressure">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Blood Pressure or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Heart Rate" name="heart_rate">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Heart Rate or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Blood Sugar" name="blood_sugar">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Blood Sugar or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Oxygen" name="oxygen">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Oxygen or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Temperature" name="temperature">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Temperature or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Respiratory Rate" name="respiratory_rate">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Respiratory Rate or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Phone Number" name="phone">
                <Input placeholder="Enter phone number" />
              </Form.Item>
              <Form.Item label="Email Address" name="email">
                <Input placeholder="Enter email address" />
              </Form.Item>
              <Form.Item label="Country" name="country_code">
                <Select showSearch options={countryOptions} placeholder="Select Country" />
              </Form.Item>
              <Form.Item label="Home Address" name="patient_home_address">
                <Input placeholder="Enter address" />
              </Form.Item>
              <Form.Item label="Primary Language" name="primary_language">
                <Input placeholder="e.g. English" />
              </Form.Item>
              <Form.Item label="Religion" name="religion">
                <Input placeholder="Enter religion" />
              </Form.Item>
            </div>

            <h3>2. Emergency Contact</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item label="Full Name" name="emer_con_name">
                <Input placeholder="Enter emergency contact name" />
              </Form.Item>
              <Form.Item label="Relationship" name="emer_con_relation">
                <Input placeholder="e.g. Spouse, Brother" />
              </Form.Item>
              <Form.Item label="Country" name="emer_con_country_code">
                <Select showSearch options={countryOptions} placeholder="Select Country" />
              </Form.Item>
              <Form.Item label="Phone Number" name="emer_con_phone">
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </div>

            <h3>3. Local Contact (if different)</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item label="Full Name" name="local_con_name">
                <Input placeholder="Enter local contact name" />
              </Form.Item>
              <Form.Item label="Relationship" name="local_con_relation">
                <Input placeholder="e.g. Friend" />
              </Form.Item>
              <Form.Item label="Country" name="local_con_country_code">
                <Select showSearch options={countryOptions} placeholder="Select Country" />
              </Form.Item>
              <Form.Item label="Phone Number" name="local_con_phone">
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </div>

            <h3>4. Medical History & Allergies</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item label="Primary Medical Condition / Diagnosis" name="condition">
                <Input.TextArea placeholder="e.g. Hypertension, Diabetes" />
              </Form.Item>
              <Form.Item label="Cancer History" name="medical_his_cancer">
                <Select
                  className="w-full"
                  placeholder="Select cancer history"
                  options={YES_NO_NOT_KNOWN_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Major Surgeries" name="medical_his_major_surgeries">
                <Input placeholder="Enter major surgeries" />
              </Form.Item>
              <Form.Item label="Current Symptoms" name="medical_his_curr_symp">
                <Input.TextArea placeholder="Enter current symptoms" />
              </Form.Item>
              <Form.Item label="Last Doctor / Hospital Visit" name="last_doctor_visit">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 2 months ago, June 2024, or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Do you have a doctor you see regularly?" name="has_regular_doctor">
                <Select
                  className="w-full"
                  placeholder="Select Yes, No, or Not Known"
                  options={YES_NO_NOT_KNOWN_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Regular Doctor's Name & Contact Info" name="regular_doctor_name">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter doctor's name, clinic, or contact details"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Drug Allergies" name="allergies_drug">
                <Input placeholder="Enter drug allergies" />
              </Form.Item>
              <Form.Item label="Food Allergies" name="allergies_food">
                <Input placeholder="Enter food allergies" />
              </Form.Item>
            </div>
          </div>

          <div
            className="flex justify-end gap-[10px] mt-[24px]"
          >
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={editLoading}
              className="bg-[#007F5F] border border-solid border-[#007F5F]"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

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

/* 🔹 Info Item (label + value) */
function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[#6B7280] text-[14px] font-medium mb-[3px] break-words">
        {label}
      </p>
      <p className="text-[16px] font-semibold text-[#2E2E2E] break-words">
        {value}
      </p>
    </div>
  );
}


