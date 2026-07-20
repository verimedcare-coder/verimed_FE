import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import Success from "../../assets/icons/success.svg";
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

import { base_url } from "../../constants/constants";
import { useLocation, useNavigate } from "react-router-dom";

const { Option } = Select;

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
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0 bg-white border-r border-[#E5E7EB]">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="shrink-0 bg-white border-b border-[#E5E7EB]">
          <Header />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-[16px] lg:p-[24px]">
          <div className="w-full flex flex-col gap-[20px] box-border">
            
            {/* Back Button */}
            <div className="flex items-center">
              <button
                onClick={() => appointmentData ? navigate("/view_patient_details", { state: { appointmentData } }) : navigate(-1)}
                className="flex items-center gap-[8px] text-[#004E89] font-semibold text-[14px] bg-white border border-[#E5E7EB] rounded-[10px] px-[16px] py-[10px] cursor-pointer hover:bg-[#F0F7FF] transition-colors shadow-sm"
              >
                ← Back to Patient
              </button>
            </div>

            {/* Patient Summary Card */}
            <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm overflow-hidden w-full">
              <div className="h-[6px] bg-gradient-to-r from-[#004E89] to-[#007F5F]"></div>
              <div className="p-[20px] flex flex-col sm:flex-row gap-[16px] items-start sm:items-center">
                <img
                  src={appointmentData ? appointmentData?.patient?.photo_view_url : patientdetails}
                  alt="Profile"
                  onError={(e) => { e.target.onerror = null; e.target.src = patientdetails; }}
                  className="w-[70px] h-[70px] rounded-[12px] shrink-0 object-cover border-[3px] border-[#F3F4F6] shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-[22px] font-bold text-[#111827] m-0 mb-[4px] truncate">{careTeam.name || "Patient"}</h2>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'12px', marginTop:'12px'}}>
                    {[
                      { label: "Condition", value: careTeam.Condition },
                      { label: "Assigned Doctor", value: careTeam.AssignedDoctor },
                      { label: "Assigned Since", value: careTeam.AssignedSince },
                      { label: "Sponsor", value: careTeam.SponsorInfo },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide m-0">{item.label}</p>
                        <p className="text-[13px] font-bold text-[#111827] m-0 truncate">{item.value || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm p-[20px] lg:p-[28px] w-full">
              <h3 className="text-[18px] font-bold text-[#007F5F] border-b border-[#E5E7EB] pb-[16px] mb-[24px] m-0">
                Patient Visit Report
              </h3>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="w-full"
                initialValues={{
                  patientName: doc_data.patient_name || appointmentData?.patient?.patient_name,
                  bloodGroup: doc_data.bloodGroup || appointmentData?.patient?.blood_group,
                  bp: doc_data.bp || appointmentData?.patient?.blood_pressure,
                  heartRate: doc_data.heart_rate || appointmentData?.patient?.heartRate,
                  sugar: doc_data.sugar || appointmentData?.patient?.blood_sugar,
                  oxygen: doc_data.oxygen || appointmentData?.patient?.oxygen,
                  temperature: doc_data.temperature || appointmentData?.patient?.temperature,
                  respiratoryRate: doc_data.respiratory_rate || appointmentData?.patient?.respiratory_rate,
                  weight: doc_data.weight || appointmentData?.patient?.weight,
                  doctorNotes: doc_data.doctor_notes,
                  initialVisit: doc_data.initialVisit,
                  documents: doc_data.documents,
                }}
              >
                {/* Basic Info */}
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px', marginBottom:'8px'}}>
                  <Form.Item label="Patient Name" name="patientName">
                    <Input placeholder="Patient Name" />
                  </Form.Item>
                  <Form.Item label="Initial Visit" name="initialVisit">
                    <Input placeholder="Initial Visit Info" />
                  </Form.Item>
                </div>

                {/* Vitals Section */}
                <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E5E7EB] p-[16px] mb-[20px]">
                  <h4 className="text-[14px] font-bold text-[#374151] m-0 mb-[16px]">Vitals</h4>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'16px'}}>
                    <Form.Item label="Blood Group" name="bloodGroup" className="m-0">
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
                    <Form.Item label="Blood Pressure" name="bp" className="m-0">
                      <Input placeholder="120/80" />
                    </Form.Item>
                    <Form.Item label="Heart Rate (bpm)" name="heartRate" className="m-0">
                      <Input placeholder="72" />
                    </Form.Item>
                    <Form.Item label="Blood Sugar (mg/dL)" name="sugar" className="m-0">
                      <Input placeholder="95" />
                    </Form.Item>
                    <Form.Item label="Oxygen (%)" name="oxygen" className="m-0">
                      <Input placeholder="98" />
                    </Form.Item>
                    <Form.Item label="Temperature (°C)" name="temperature" className="m-0">
                      <Input placeholder="36.8" />
                    </Form.Item>
                    <Form.Item label="Respiratory Rate" name="respiratoryRate" className="m-0">
                      <Input placeholder="16" />
                    </Form.Item>
                    <Form.Item label="Weight (kg)" name="weight" className="m-0">
                      <Input placeholder="70" />
                    </Form.Item>
                  </div>
                </div>

                {/* Uploads */}
                <div className="mb-[20px]">
                  <h4 className="text-[14px] font-bold text-[#007F5F] m-0 mb-[14px]">Clinical Reports & Documentation</h4>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'16px'}} className="bg-[#F8FAFC] p-[16px] rounded-[12px] border border-[#E5E7EB]">
                    <Form.Item label={<span className="font-semibold text-[#1E293B]">Results & Medical Records</span>} name="results_records" valuePropName="fileList" getValueFromEvent={normFile} className="m-0">
                      <Upload multiple beforeUpload={() => false} listType="text">
                        <Button icon={<UploadOutlined />} className="w-full">Upload Results & Records</Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item label={<span className="font-semibold text-[#1E293B]">Diagnostic Images & Scans</span>} name="diagnostic_images" valuePropName="fileList" getValueFromEvent={normFile} className="m-0">
                      <Upload multiple beforeUpload={() => false} listType="text" accept="image/*">
                        <Button icon={<UploadOutlined />} className="w-full">Upload Images & Scans</Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item label={<span className="font-semibold text-[#1E293B]">Voice Notes & Audio</span>} name="voice_notes" valuePropName="fileList" getValueFromEvent={normFile} className="m-0">
                      <Upload multiple beforeUpload={() => false} listType="text" accept="audio/*">
                        <Button icon={<UploadOutlined />} className="w-full">Upload Voice Notes</Button>
                      </Upload>
                    </Form.Item>
                  </div>
                  <div className="mt-[14px]">
                    <Form.Item label="Other Supplementary Documents" name="documents" valuePropName="fileList" getValueFromEvent={normFile} className="m-0">
                      <Upload multiple beforeUpload={() => false} listType="text">
                        <Button icon={<UploadOutlined />}>Upload Other Documents</Button>
                      </Upload>
                    </Form.Item>
                  </div>
                </div>

                {/* Doctor Notes */}
                <div className="mb-[24px]">
                  <h4 className="text-[14px] font-bold text-[#007F5F] m-0 mb-[10px]">Doctor Notes & Clinical Synthesis</h4>
                  <Form.Item name="doctorNotes" className="m-0">
                    <Input.TextArea rows={4} placeholder="Add clinical synthesis, diagnostic findings, and patient instructions here..." />
                  </Form.Item>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-[12px] pt-[16px] border-t border-[#E5E7EB]">
                  <Button
                    onClick={() => {
                      form.resetFields();
                      if (appointmentData) {
                        navigate("/view_patient_details", { state: { appointmentData } });
                      } else {
                        navigate(-1);
                      }
                    }}
                    className="px-[20px] h-[40px]"
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading} className="bg-[#007F5F] border border-solid border-[#007F5F] px-[24px] h-[40px] font-semibold">
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
                  <div className="text-center">
                    <img src={Success} alt="Success" className="w-[60px] h-[60px] mb-[16px]" />
                    <h2 className="text-[#007F5F] text-[20px] font-bold m-0">Report Submitted Successfully</h2>
                  </div>
                }
              >
                <p className="text-[15px] font-medium text-[#2E2E2E] text-center leading-[1.6]">
                  Your clinical report for patient{" "}
                  <strong>
                    {appointmentData?.patient?.patient_name ||
                      appointmentData?.patient?.user?.first_name +
                        " " +
                        appointmentData?.patient?.user?.last_name ||
                      "the patient"}
                  </strong>{" "}
                  has been recorded. An email notification has been dispatched to the sponsor.
                </p>
                <div className="text-center mt-[24px]">
                  <Button
                    type="primary"
                    className="bg-[#007F5F] rounded-[6px] py-[0px] px-[24px] h-[40px] font-medium border border-solid border-[#007F5F]"
                    onClick={() => {
                      setIsSuccessModalOpen(false);
                      if (appointmentData) {
                        navigate("/view_patient_details", { state: { appointmentData } });
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
    </div>
  );
}
