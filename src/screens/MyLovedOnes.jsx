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
import { Table, message, Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined, EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { base_url } from "../constants/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyLovedOnes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [vitalsData, setVitalsData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);

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
    if (!url) return patientdetails;
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
      condition: patientData.medical_his_diagnosis || "",
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
      const patientprofile_data = {
        updateid: patientData.id,
        patient_name: values.name,
        phone: values.phone,
        email: values.email,
        medical_his_diagnosis: values.condition,
        sponsorid: Number(storedSponsorId),
        sponsor: Number(storedSponsorId),
      };
      const formData = new FormData();
      formData.append("patientprofile_data", JSON.stringify(patientprofile_data));
      if (values.photo && values.photo.length > 0) {
        const fileObj = values.photo[0].originFileObj || values.photo[0];
        formData.append("patient_photo", fileObj);
        formData.append("photo", fileObj);
        formData.append("user_photo", fileObj);
      }
      await axios.post(`${base_url}/patientprofile_create_update/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Loved one profile and photo updated successfully!");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sponsorPatients"] });
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

  const vitals = vitalsData
    ? [
        {
          icon: bloodPressure,
          label: "Blood Pressure",
          value: vitalsData.blood_pressure || "N/A",
          color: getVitalColor("Blood Pressure", vitalsData.blood_pressure),
        },
        {
          icon: heartRate,
          label: "Heart Rate",
          value: vitalsData.heart_rate || "N/A",
          color: getVitalColor("Heart Rate", vitalsData.heart_rate),
        },
        {
          icon: sugar,
          label: "Blood Sugar",
          value: vitalsData.blood_sugar || "N/A",
          color: getVitalColor("Blood Sugar", vitalsData.blood_sugar),
        },
        {
          icon: oxygen,
          label: "Oxygen",
          value: vitalsData.oxygen || "N/A",
          color: getVitalColor("Oxygen", vitalsData.oxygen),
        },
        {
          icon: temperature,
          label: "Temperature",
          value: vitalsData.temperature || "N/A",
          color: getVitalColor("Temperature", vitalsData.temperature),
        },
        {
          icon: respiratory,
          label: "Respiratory Rate",
          value: vitalsData.respiratory_rate || "N/A",
          color: getVitalColor("Respiratory Rate", vitalsData.respiratory_rate),
        },
        {
          icon: weight,
          label: "Weight",
          value: vitalsData.weight || "N/A",
          color: getVitalColor("Weight", vitalsData.weight),
        },
        {
          icon: statusIcon,
          label: "Status",
          value: vitalsData.status || "N/A",
          color: getVitalColor("Status", vitalsData.status),
        },
      ]
    : [];

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
                {vitals.length > 0 ? (
                  vitals.map((item, i) => (
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
                  ))
                ) : (
                  <p style={{ color: "#999" }}>Loading vitals...</p>
                )}
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
        title="Edit Loved One Profile & Photo"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Loved One Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter patient name" />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item label="Email Address" name="email">
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item
            label="Primary Medical Condition / Diagnosis"
            name="condition"
          >
            <Input placeholder="e.g. Hypertension, Diabetes" />
          </Form.Item>
          <Form.Item
            label="Upload New Photo"
            name="photo"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>Select Photo</Button>
            </Upload>
          </Form.Item>
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
