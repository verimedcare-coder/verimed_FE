import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";
import Success from "../assets/icons/success.svg";
import { Form, Input, Select, Button, Modal, message } from "antd";
import axios from "axios";
import { base_url } from "../constants/constants";

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

export default function DoctorForm(doc_reports_data, base_url) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // const endpoint = `${base_url}/doctor_reports_curd/`;
      const endpoint = `https://verimedramja.pythonanywhere.com/verimed/doctor_reports_curd/`;
      const headers = {
        Authorization: "Token 7d406eecd7d9be342a7dbad264a73c5ac761f19a",
      };

      // Fixed payload
      const payload = {
        doc_reports_data: {
          doc_report_updateid: doc_reports_data.doc_report_updateid,
          patient: doc_reports_data.patient,
          doc: doc_reports_data.doc,
          sponsor: doc_reports_data.sponsor,
          caretaker: doc_reports_data.caretaker,
          patient_name: values.patientName,
          patient_age: values.age,
          patient_gender: values.gender,
          nationality: values.nationality,
          blood_group: values.bloodGroup,
          bp: values.bp,
          heart_rate: values.heartRate,
          sugar: values.sugar,
          oxygen: values.oxygen,
          temperature: values.temperature,
          respiratory_rate: values.respiratoryRate,
          weight: values.weight,
          status: values.status,
          address_1: values.address1,
          address_2: values.address2,
          city: values.city,
          state: values.state,
          country: values.country,
          pincode: values.pincode,
          doctor_notes: values.doctorNotes,
        },
      };

      const response = await axios.post(endpoint, payload, { headers });
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
    name: "Mr. Samuel N. (VM-976-324)",
    Condition: "Hypertension, Diabetes",
    AssignedDoctor: "Dr. Paul M.",
    CareTaker: "Nurse Clarisse A.",
    Conditions: "Hypertension, Type 2 Diabetes",
    AssignedSince: "July 2025",
    SponsorInfo: "John N. (Toronto, Canada)",
    SponsorNumber: "+966 558441502",
    Address: "Douala, Cameroon",
    PrimaryCareTaker: "Clarisse Abena",
    AssignedPhysician: "Dr. Paul Ekom",
    CareCoordinator: "Marie T.",
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
                patientName: doc_reports_data.patient_name,
                age: doc_reports_data.patient_age,
                gender: doc_reports_data.patient_gender,
                nationality: doc_reports_data.nationality,
                bloodGroup: doc_reports_data.blood_group,
                bp: doc_reports_data.bp,
                heartRate: doc_reports_data.heart_rate,
                sugar: doc_reports_data.sugar,
                oxygen: doc_reports_data.oxygen,
                temperature: doc_reports_data.temperature,
                respiratoryRate: doc_reports_data.respiratory_rate,
                weight: doc_reports_data.weight,
                status: doc_reports_data.status,
                address1: doc_reports_data.address_1,
                address2: doc_reports_data.address_2,
                city: doc_reports_data.city,
                state: doc_reports_data.state,
                country: doc_reports_data.country,
                pincode: doc_reports_data.pincode,
                doctorNotes: doc_reports_data.doctor_notes,
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
                  <Input />
                </Form.Item>
                <Form.Item label="Age" name="age">
                  <Input type="number" />
                </Form.Item>
                <Form.Item label="Gender" name="gender">
                  <Select>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Nationality" name="nationality">
                  <Input />
                </Form.Item>
              </div>

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

              <Form.Item label="Status" name="status" style={{ marginTop: 16 }}>
                <Input />
              </Form.Item>

              {/* Address */}
              <h3 style={{ marginTop: 20, color: "#007F5F" }}>
                Address Information
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                }}
              >
                <Form.Item label="Address Line 1" name="address1">
                  <Input />
                </Form.Item>
                <Form.Item label="Address Line 2" name="address2">
                  <Input />
                </Form.Item>
                <Form.Item label="City" name="city">
                  <Input />
                </Form.Item>
                <Form.Item label="State" name="state">
                  <Input />
                </Form.Item>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                }}
              >
                <Form.Item label="Country" name="country">
                  <Input />
                </Form.Item>
                <Form.Item label="Pincode" name="pincode">
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
                    Appointment Booked Successfully
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
                Your appointment with Dr. Paul Ekom is scheduled for Aug 20,
                2025 at 10:00 AM. You will receive reminders 24 hours and 1 hour
                before your visit.
              </p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
