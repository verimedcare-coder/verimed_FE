import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";
import Success from "../assets/icons/success.svg";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Upload,
  DatePicker,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { base_url } from "../constants/constants";
import { useLocation, useNavigate } from "react-router-dom";

const { Option } = Select;

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

export default function DoctorForm(doc_data) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentData } = location.state || {};

  const token = localStorage.getItem("token");

  // normalize upload value for Form
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const endpoint = `${base_url}/doctor_reports_curd/`;
      const headers = {
        Authorization: `Token ${token}`,
      };

      let finalCaretakerId =
        appointmentData?.caretaker?.id ||
        appointmentData?.caretakerid ||
        null;
      let finalDoctorId =
        appointmentData?.doc?.id || appointmentData?.docid || null;
      let finalPatientId =
        appointmentData?.patient?.id || appointmentData?.patientid || null;
      let finalSponsorId =
        appointmentData?.sponsor?.id || appointmentData?.sponsorid || null;

      if (
        !finalCaretakerId ||
        !finalDoctorId ||
        !finalPatientId ||
        !finalSponsorId
      ) {
        try {
          if (!finalCaretakerId) {
            const cRes = await axios.get(`${base_url}/caretakerprofile_list/`, {
              headers,
            });
            if (Array.isArray(cRes.data) && cRes.data.length > 0) {
              finalCaretakerId = cRes.data[0]?.id || null;
            }
          }
          if (!finalDoctorId) {
            const dRes = await axios.get(`${base_url}/doctorprofile_list/`, {
              headers,
            });
            if (Array.isArray(dRes.data) && dRes.data.length > 0) {
              finalDoctorId = dRes.data[0]?.id || null;
            }
          }
          if (!finalPatientId) {
            const pRes = await axios.get(`${base_url}/patientprofile_list/`, {
              headers,
            });
            if (Array.isArray(pRes.data) && pRes.data.length > 0) {
              finalPatientId = pRes.data[0]?.id || null;
            }
          }
          if (!finalSponsorId) {
            const sRes = await axios.get(`${base_url}/sponsorprofile_list/`, {
              headers,
            });
            if (Array.isArray(sRes.data) && sRes.data.length > 0) {
              finalSponsorId = sRes.data[0]?.id || null;
            }
          }
        } catch (err) {
          console.log(
            "Error auto-fetching fallback profile IDs in DoctorForm:",
            err,
          );
        } finally {
          // Completed auto-fetching fallback profile IDs
        }
      }

      const payloadData = {
        doctor: finalDoctorId,
        patient: finalPatientId,
        sponsor: finalSponsorId,
        caretaker: finalCaretakerId,
        patient_name:
          values.patientName || appointmentData?.patient?.patient_name || "N/A",
        blood_group:
          values.bloodGroup || appointmentData?.patient?.blood_group || "N/A",
        bp: values.bp || appointmentData?.patient?.blood_pressure || "N/A",
        heart_rate:
          values.heartRate || appointmentData?.patient?.heartRate || "N/A",
        sugar: values.sugar || appointmentData?.patient?.blood_sugar || "N/A",
        oxygen: values.oxygen || appointmentData?.patient?.oxygen || "N/A",
        temperature:
          values.temperature || appointmentData?.patient?.temperature || "N/A",
        respiratory_rate:
          values.respiratoryRate ||
          appointmentData?.patient?.respiratory_rate ||
          "N/A",
        weight: values.weight || appointmentData?.patient?.weight || "N/A",
        doctor_notes: values.doctorNotes || "",
      };

      const formData = new FormData();
      formData.append("doc_reports_data", JSON.stringify(payloadData));

      const allFiles = [
        ...(values.results_records || []),
        ...(values.diagnostic_images || []),
        ...(values.voice_notes || []),
        ...(values.documents || []),
      ];
      allFiles.forEach((file) => {
        const fileObj = file.originFileObj || file;
        if (fileObj) formData.append("doc_reports", fileObj);
      });
      (values.results_records || []).forEach((file) => {
        const fileObj = file.originFileObj || file;
        if (fileObj) formData.append("results_records", fileObj);
      });
      (values.diagnostic_images || []).forEach((file) => {
        const fileObj = file.originFileObj || file;
        if (fileObj) formData.append("diagnostic_images", fileObj);
      });
      (values.voice_notes || []).forEach((file) => {
        const fileObj = file.originFileObj || file;
        if (fileObj) formData.append("voice_notes", fileObj);
      });

      const response = await axios.post(endpoint, formData, { headers });
      console.log("API Response:", response.data);

      message.success("Report submitted successfully!");
      setIsSuccessModalOpen(true);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting report:", error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to submit report. Please try again.";
      message.error(errMsg);
      Modal.error({
        title: "Submission Failed",
        content: errMsg,
        centered: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const careTeam = {
    name: appointmentData?.patient?.patient_name || "",
    Condition: appointmentData?.appointment_type,
    AssignedDoctor:
      appointmentData?.doc?.user?.first_name +
        " " +
        appointmentData?.doc?.user?.last_name || "N/A",
    // CareTaker:
    //   appointmentData?.caretaker?.user?.first_name +
    //     " " +
    //     appointmentData?.caretaker?.user?.last_name || "N/A",
    Conditions: appointmentData?.appointment_type,
    AssignedSince: appointmentData?.appointment_date || "N/A",
    SponsorInfo:
      appointmentData?.sponsor?.user?.first_name +
        " " +
        appointmentData?.sponsor?.user?.last_name || "N/A",
    SponsorNumber: appointmentData?.sponsor?.user?.phone || "N/A",
    Address: appointmentData?.patient?.patient_home_address || "N/A",
    // PrimaryCareTaker:
    //   appointmentData?.caretaker?.user?.first_name +
    //     " " +
    //     appointmentData?.caretaker?.user?.last_name || "N/A",
    AssignedPhysician:
      appointmentData?.doc?.user?.first_name +
        " " +
        appointmentData?.doc?.user?.last_name || "N/A",
    //
  };

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

        {/* Content area with just text */}
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
          {/* details */}
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            {/* Left - Avatar */}
            <img
              src={
                appointmentData
                  ? appointmentData?.patient?.photo_view_url
                  : patientdetails
              }
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

              <div style={{ borderTop: "1px solid #E5E7EB" }} />
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
                    Address
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {careTeam.Address}
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
                    Primary Care Taker
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {careTeam.PrimaryCareTaker}
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
                    Assigned Physician
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {careTeam.AssignedPhysician}
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
                    Care Coordinator
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {careTeam.CareCoordinator}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: 20,
              marginTop: 20,
              width: "95%",
            }}
          >
            <h3 style={{ marginBottom: 20, color: "#007F5F" }}>
              Patient Details
            </h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{ width: "100%" }}
              initialValues={{
                patientName:
                  doc_data.patient_name ||
                  appointmentData?.patient?.patient_name,
                bloodGroup:
                  doc_data.bloodGroup || appointmentData?.patient?.blood_group,
                bp: doc_data.bp || appointmentData?.patient?.blood_pressure,
                heartRate:
                  doc_data.heart_rate || appointmentData?.patient?.heartRate,
                sugar: doc_data.sugar || appointmentData?.patient?.blood_sugar,
                oxygen: doc_data.oxygen || appointmentData?.patient?.oxygen,
                temperature:
                  doc_data.temperature || appointmentData?.patient?.temperature,
                respiratoryRate:
                  doc_data.respiratory_rate ||
                  appointmentData?.patient?.respiratory_rate,
                weight: doc_data.weight || appointmentData?.patient?.weight,
                doctorNotes: doc_data.doctor_notes,
                initialVisit: doc_data.initialVisit,
                documents: doc_data.documents,
              }}
            >
              {/* Patient Info */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                }}
              >
                <Form.Item label="Patient Name" name="patientName">
                  <Input placeholder="Patient Name" />
                </Form.Item>
                <Form.Item label="Initial Visit" name="initialVisit">
                  <Input placeholder="Initial Visit Info" />
                </Form.Item>
              </div>

              {/* Vitals 1 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                  marginTop: 16,
                }}
              >
                <Form.Item label="Blood Group" name="bloodGroup">
                  <Select placeholder="Select Blood Group">
                    <Option value="A+">A+</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B-">B-</Option>
                    <Option value="O+">O+</Option>
                    <Option value="O-">O-</Option>
                    <Option value="AB+">AB+</Option>
                    <Option value="AB-">AB-</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Blood Pressure (BP)" name="bp">
                  <Input placeholder="120/80" />
                </Form.Item>
                <Form.Item label="Heart Rate (bpm)" name="heartRate">
                  <Input placeholder="72" />
                </Form.Item>
                <Form.Item label="Blood Sugar (mg/dL)" name="sugar">
                  <Input placeholder="95" />
                </Form.Item>
              </div>

              {/* Vitals 2 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                  marginTop: 16,
                }}
              >
                <Form.Item label="Oxygen (%)" name="oxygen">
                  <Input placeholder="98" />
                </Form.Item>
                <Form.Item label="Temperature (°C)" name="temperature">
                  <Input placeholder="36.8" />
                </Form.Item>
                <Form.Item label="Respiratory Rate" name="respiratoryRate">
                  <Input placeholder="16" />
                </Form.Item>
                <Form.Item label="Weight (kg)" name="weight">
                  <Input placeholder="70" />
                </Form.Item>
              </div>

              {/* Categorized Report Uploads (#A) */}
              <h3 style={{ marginTop: 24, marginBottom: 12, color: "#007F5F", fontSize: 16 }}>
                Clinical Reports & Documentation
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  background: "#F8FAFC",
                  padding: 16,
                  borderRadius: 10,
                  border: "1px solid #E2E8F0",
                }}
              >
                <Form.Item
                  label={
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>
                      Results & Medical Records
                    </span>
                  }
                  name="results_records"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  style={{ margin: 0 }}
                >
                  <Upload multiple beforeUpload={() => false} listType="text">
                    <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                      Upload Results & Records
                    </Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  label={
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>
                      Diagnostic Images & Scans
                    </span>
                  }
                  name="diagnostic_images"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  style={{ margin: 0 }}
                >
                  <Upload multiple beforeUpload={() => false} listType="text" accept="image/*">
                    <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                      Upload Images & Scans
                    </Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  label={
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>
                      Voice Notes & Audio
                    </span>
                  }
                  name="voice_notes"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  style={{ margin: 0 }}
                >
                  <Upload multiple beforeUpload={() => false} listType="text" accept="audio/*">
                    <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                      Upload Voice Notes
                    </Button>
                  </Upload>
                </Form.Item>
              </div>

              <div style={{ marginTop: 16 }}>
                <Form.Item
                  label="Other Supplementary Documents"
                  name="documents"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload multiple beforeUpload={() => false} listType="text">
                    <Button icon={<UploadOutlined />}>Upload Other Documents</Button>
                  </Upload>
                </Form.Item>
              </div>

              {/* Doctor Notes */}
              <h3 style={{ marginTop: 20, color: "#007F5F" }}>Doctor Notes & Clinical Synthesis</h3>
              <Form.Item name="doctorNotes">
                <Input.TextArea rows={4} placeholder="Add clinical synthesis, diagnostic findings, and patient instructions here..." />
              </Form.Item>

              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
              >
                <Button
                  onClick={() => {
                    form.resetFields();
                    if (appointmentData) {
                      navigate("/view_patient_details", {
                        state: { appointmentData },
                      });
                    } else {
                      navigate(-1);
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading} style={{ background: "#007F5F", borderColor: "#007F5F" }}>
                  Submit Visit Report
                </Button>
              </div>
            </Form>

            <Modal
              open={isSuccessModalOpen}
              onCancel={() => setIsSuccessModalOpen(false)}
              footer={null}
              centered
              title={
                <div style={{ textAlign: "center" }}>
                  <img
                    src={Success}
                    alt="Success"
                    style={{ width: 60, height: 60, marginBottom: 16 }}
                  />

                  <h2
                    style={{
                      color: "#007F5F",
                      fontSize: "20px",
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    Report Submitted Successfully
                  </h2>
                </div>
              }
            >
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#2E2E2E",
                  textAlign: "center",
                  lineHeight: "1.6",
                }}
              >
                Your clinical report for patient{" "}
                <strong>
                  {appointmentData?.patient?.patient_name ||
                    appointmentData?.patient?.user?.first_name +
                      " " +
                      appointmentData?.patient?.user?.last_name ||
                      "the patient"}
                </strong>{" "}
                has been recorded on the backend. An email notification containing the visit summary, results, and attached records has been dispatched to the sponsor.
              </p>
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Button
                  type="primary"
                  style={{
                    background: "#007F5F",
                    borderColor: "#007F5F",
                    borderRadius: "6px",
                    padding: "0 24px",
                    height: "40px",
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    if (appointmentData) {
                      navigate("/view_patient_details", {
                        state: { appointmentData },
                      });
                    } else {
                      navigate(-1);
                    }
                  }}
                >
                  Return to Patient Profile
                </Button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
