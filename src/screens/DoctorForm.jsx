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
import { useLocation } from "react-router-dom";

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

      const payloadData = {
        doctor: appointmentData?.doc?.id,
        patient: appointmentData?.patient?.id,
        sponsor: appointmentData?.sponsor?.id,
        caretaker: appointmentData?.caretaker?.id || 4,
        patient_name: appointmentData?.patient?.patient_name,
        blood_group: values.bloodGroup || "N/A",
        bp: appointmentData?.patient?.blood_pressure || "N/A",
        heart_rate: appointmentData?.patient?.heartRate || "N/A",
        sugar: appointmentData?.patient?.blood_sugar || "N/A",
        oxygen: appointmentData?.patient?.oxygen || "N/A",
        temperature: appointmentData?.patient?.temperature || "N/A",
        respiratory_rate: appointmentData?.patient?.respiratory_rate || "N/A",
        weight: appointmentData?.patient?.weight || "N/A",
        doctor_notes: values.doctorNotes,
      };

      const formData = new FormData();
      formData.append("doc_reports_data", JSON.stringify(payloadData));

      const files = values.documents || [];
      files.forEach((file) => {
        const fileObj = file.originFileObj || file;
        if (fileObj) formData.append("doc_reports", fileObj);
      });

      const response = await axios.post(endpoint, formData, { headers });
      console.log("API Response:", response.data);

      message.success("Report submitted successfully!");
      setIsSuccessModalOpen(true);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting report:", error);
      message.error("Failed to submit report. Please try again.");
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
                patientName: doc_data.patient_name,
                bloodGroup: doc_data.blood_group,
                bp: doc_data.bp,
                heartRate: doc_data.heart_rate,
                sugar: doc_data.sugar,
                oxygen: doc_data.oxygen,
                temperature: doc_data.temperature,
                respiratoryRate: doc_data.respiratory_rate,
                weight: doc_data.weight,
                doctorNotes: doc_data.doctor_notes,
                initial_visit: doc_data.initialVisit,
                doc_reports: doc_data.documents,
              }}
            >
              {/* Patient Info */}
              {/* <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                }}
              >
                <Form.Item label="Patient Name" name="patientName">
                  <Input />
                </Form.Item>
              </div> */}

              {/* Vitals */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                  marginTop: 16,
                }}
              >
                <Form.Item label="Blood Group" name="bloodGroup">
                  <Select>
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
                <Form.Item label="BP" name="bp">
                  <Input />
                </Form.Item>
                <Form.Item label="Heart Rate" name="heartRate">
                  <Input />
                </Form.Item>
                <Form.Item label="Sugar" name="sugar">
                  <Input />
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
                <Form.Item label="Oxygen" name="oxygen">
                  <Input />
                </Form.Item>
                <Form.Item label="Temperature" name="temperature">
                  <Input />
                </Form.Item>
                <Form.Item label="Respiratory Rate" name="respiratoryRate">
                  <Input />
                </Form.Item>
                <Form.Item label="Weight" name="weight">
                  <Input />
                </Form.Item>
              </div>

              {/* Upload Documents & Initial Visits */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                  marginTop: 16,
                }}
              >
                <Form.Item
                  label="Upload Documents"
                  name="documents"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  style={{ margin: 0 }}
                >
                  <Upload multiple beforeUpload={() => false} listType="text">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item label="Initial Visit" name="initialVisit">
                  <Input />
                </Form.Item>
              </div>

              {/* Doctor Notes */}
              <h3 style={{ marginTop: 20, color: "#007F5F" }}>Doctor Notes</h3>
              <Form.Item name="doctorNotes">
                <Input.TextArea rows={4} placeholder="Add your comments here" />
              </Form.Item>

              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
              >
                <Button
                  onClick={() => {
                    form.resetFields();
                    setIsSuccessModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit Report
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
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#2E2E2E",
                  textAlign: "center",
                }}
              >
                Your appointment with Dr.
                {appointmentData?.patient?.user?.first_name +
                  " " +
                  appointmentData?.patient?.user?.last_name}{" "}
                has been completed successfully. You'll receive email.
              </p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
