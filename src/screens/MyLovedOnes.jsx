/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { myLovedOnesService } from "../services/myLovedOnesService";
import Header from "../components/Header";
import Sider from "../components/Sider";
import Primarybtn from "../components/PrimaryBtn";
import SecondaryBtn from "../components/SecondaryBtn";
import bloodPressure from "../assets/icons/blood-pressure.svg";
import heartRate from "../assets/icons/heart-rate.svg";
import oxygen from "../assets/icons/oxygen.svg";
import respiratory from "../assets/icons/respiratory.svg";
import statusIcon from "../assets/icons/status.svg";
import sugar from "../assets/icons/sugar.svg";
import weight from "../assets/icons/weight.svg";
import temperature from "../assets/icons/temperature.png";
import patientdetails from "../assets/images/patient-profile.jpg";
import { Table, message, Modal, Form, Input, Upload, Button, Select, DatePicker, AutoComplete } from "antd";
import dayjs from "dayjs";
import { getData } from "country-list";
import { UploadOutlined, EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { base_url } from "../constants/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

  const twoColGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  };

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
        care_taker_notes: item.care_taker_notes,
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
          comments: vitalsData.care_taker_notes || "",
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
              vitalsData.care_taker_notes || "",
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
        <div
          style={{
            backgroundColor: "#F7F9FB",
            padding: "30px",
            overflowY: "auto",
            overflowX: "hidden",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Content area */}
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

          {/* patient details */}
          <div style={cardStyle}>
            <SectionHeader title="Patient Details">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{
                    background: "#007F5F",
                    borderColor: "#007F5F",
                    borderRadius: 20,
                    fontWeight: 500,
                  }}
                  onClick={handleEditOpen}
                >
                  Edit Profile & Photo
                </Button>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#2E2E2E",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  Renewal Due Aug 25, 2025
                </p>
              </div>
            </SectionHeader>

            {/* Profile */}
            <div style={profileBox}>
              <img
                src={getPhotoUrl(
                  patientData?.photo_view_url || patientData?.photo
                )}
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = patientdetails;
                }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "12px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div style={infoGrid}>
                {patientData ? (
                  <>
                    <InfoItem
                      label="Name"
                      value={`${patientData?.patient_name} (${patientData?.id})`}
                    />
                    <InfoItem
                      label="Condition"
                      value={patientData?.medical_his_diagnosis}
                    />
                    <InfoItem
                      label="Assigned Doctor"
                      value={`${vitalsData?.doc?.user?.first_name || "N/A"} ${
                        vitalsData?.doc?.user?.last_name || ""
                      }`}
                    />
                    <InfoItem
                      label="Care Taker"
                      value={vitalsData?.caretaker?.caretaker_id || "N/A"}
                    />
                  </>
                ) : (
                  <p style={{ color: "#999" }}>Loading patient details...</p>
                )}
              </div>
            </div>
            {/* Vitals */}
            <div style={vitalsGrid}>
              <div style={vitalsGrid}>
                {vitals.map((item, i) => (
                  <div key={i} style={vitalCard}>
                    <img
                      src={item.icon}
                      alt={item.label}
                      style={{ width: 24, height: 24 }}
                    />
                    <div>
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

          {/* medical history */}
          <div style={tableContainer}>
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
            </div>

           
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
            </div> */}
            {/* LEFT: Appointment Details Timeline */}
            <div style={appointmentWrapper}>
              <SectionHeader title="Appointment Details" />
              <div style={timelineWrapper}>
                <div style={timelineLine}></div>
                {appointmentDetailsDynamic.map((item, index) => (
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
                        <p style={apptDate}>{item.date}</p>
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
                          <span style={{ color: "#06152B99" }}>
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
                          <span style={{ color: "#06152B99" }}>
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
                          <span style={{ color: "#06152B99" }}>
                            {item.status}
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
                          <span style={{ color: "#06152B99" }}>
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
            <div style={timelineCard}>
              <SectionHeader title="Timeline" />
              {timelineDataDynamic.map((item, index) => (
                <div key={index} style={timelineBox}>
                  <p
                    style={{ fontSize: 14, fontWeight: 400, color: "#2E2E2E" }}
                  >
                    {item.title}
                  </p>
                  {Array.isArray(item.details) && item.details.length > 0 ? (
                    <ul>
                      {item.details.map((d, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "#06152BB2",
                          }}
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#06152BB2",
                      }}
                    >
                      No details available
                    </p>
                  )}
                  <p style={timelineDate}>{item.date}</p>
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
          style={{ marginTop: 16 }}
        >
          <div style={{ maxHeight: "68vh", overflowY: "auto", paddingRight: 8 }}>
            <h3>1. Personal Information</h3>
            <div style={twoColGrid}>
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
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Gender" name="patient_gender">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Gender"
                  options={GENDER_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Blood Group" name="blood_group">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Blood Group"
                  options={BLOOD_GROUP_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Height" name="height">
                <AutoComplete
                  style={{ width: "100%" }}
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 175 cm or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Weight" name="weight">
                <AutoComplete
                  style={{ width: "100%" }}
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 70 kg or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Blood Pressure" name="blood_pressure">
                <AutoComplete
                  style={{ width: "100%" }}
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Blood Pressure or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Heart Rate" name="heart_rate">
                <AutoComplete
                  style={{ width: "100%" }}
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Heart Rate or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Blood Sugar" name="blood_sugar">
                <AutoComplete
                  style={{ width: "100%" }}
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Blood Sugar or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Oxygen" name="oxygen">
                <AutoComplete
                  style={{ width: "100%" }}
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Oxygen or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Temperature" name="temperature">
                <AutoComplete
                  style={{ width: "100%" }}
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Temperature or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Respiratory Rate" name="respiratory_rate">
                <AutoComplete
                  style={{ width: "100%" }}
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
            <div style={twoColGrid}>
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
            <div style={twoColGrid}>
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
            <div style={twoColGrid}>
              <Form.Item label="Primary Medical Condition / Diagnosis" name="condition">
                <Input.TextArea placeholder="e.g. Hypertension, Diabetes" />
              </Form.Item>
              <Form.Item label="Cancer History" name="medical_his_cancer">
                <Select
                  style={{ width: "100%" }}
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
                  style={{ width: "100%" }}
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 2 months ago, June 2024, or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Do you have a doctor you see regularly?" name="has_regular_doctor">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Yes, No, or Not Known"
                  options={YES_NO_NOT_KNOWN_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Regular Doctor's Name & Contact Info" name="regular_doctor_name">
                <AutoComplete
                  style={{ width: "100%" }}
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
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 24,
            }}
          >
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={editLoading}
              style={{ background: "#007F5F", borderColor: "#007F5F" }}
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
  gap: 16,
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

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };
