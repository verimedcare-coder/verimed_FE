/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import { useNavigate } from "react-router-dom";
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
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  DatePicker,
  TimePicker,
  Upload,
  Button,
} from "antd";
import { Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { TextArea } = Input;
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

export default function DailyReports() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Data:", values);
  };

  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: "100/67 mmHg",
      color: "#27AE60",
    },
    { icon: heartRate, label: "Heart Rate", value: "89 bpm", color: "#EF1E1E" },
    { icon: sugar, label: "Sugar", value: "180", color: "#27AE60" },
    { icon: oxygen, label: "Oxygen", value: "96", color: "#27AE60" },
    {
      icon: temperature,
      label: "Temperature",
      value: "101 °C",
      color: "#27AE60",
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: "24 rpm",
      color: "#EF1E1E",
    },
    { icon: weight, label: "Weight", value: "100 kg", color: "#27AE60" },
    { icon: statusIcon, label: "Status", value: "Stable", color: "#27AE60" },
  ];

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

  const careTeam = {
    name: "Mr. Samuel N. (VM-976-324)",
    Condition: "Hypertension, Diabetes",
    AssignedDoctor: "Dr. Paul M.",
    CareTaker: "Nurse Clarisse A.",
    Conditions: "Hypertension, Type 2 Diabetes",
    AssignedSince: "July 2025",
    SponsorInfo: "John N. (Toronto, Canada)",
    SponsorNumber: "+966 558441502",
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
          className="flex bg-[#F7F9FB] flex-col p-[20px] gap-[20px]"
        >
          <div className="grid grid-cols-4 gap-[15px] min-w-0 w-full">
            {vitals.map((item, i) => (
              <div key={i} className="flex items-center gap-[10px] border-[1px] border-solid border-[#1B1B1B1A] bg-white rounded-[10px] p-[10px] min-h-[80px] min-w-0">
                <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-[20px] h-[20px] object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[14px] font-semibold mb-[2px]">{item.label}</p>
                  <div className="flex items-center gap-[6px]">
                    <div
                      className="w-[8px] h-[8px] rounded-full shrink-0"
                      style={{ background: item.color }}
                    ></div>
                    <span className="text-[14px] text-[#2E2E2E] break-words">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="bg-transparent border-[1px] border-solid border-[#E5E7EB] rounded-[10px] p-[20px] w-auto"
          >
            {/* Header Row */}

            <div
              className="mb-[16px] border-t-[1px] border-solid border-[#E5E7EB]"
            />

            {/* Content Row */}
            <div className="flex gap-[16px]">
              {/* Left - Avatar */}
              <img
                src={patientdetails}
                alt="Profile"
                className="w-[60px] h-[60px] rounded-[12px] shrink-0 object-cover"
              />

              {/* Right - Info Grid */}
              <div
                className="flex-1 flex flex-col gap-[14px]"
              >
                {/* Row 1 */}
                <div className="grid grid-cols-4 gap-[10px]">
                  <div>
                    <div
                      className="text-[13px] text-[#2E2E2E] mb-[3px]"
                    >
                      Name
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.name}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-[13px] text-[#2E2E2E] mb-[3px]"
                    >
                      Condition
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.Condition}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-[13px] text-[#2E2E2E] mb-[3px]"
                    >
                      Assigned Doctor
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.AssignedDoctor}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-[13px] text-[#2E2E2E] mb-[3px]"
                    >
                      Care Taker
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.CareTaker}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t-[1px] border-solid border-[#E5E7EB]" />
                <div className="grid grid-cols-4 gap-[10px]">
                  {/* Row 3 */}
                  <div>
                    <div
                      className="text-[13px] text-[#2E2E2E] mb-[3px]"
                    >
                      Condition(s)
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.Conditions}
                    </div>
                  </div>
                  <div>
                    {" "}
                    <div
                      className="text-[13px] text-[#2E2E2E] mb-[3px]"
                    >
                      Assigned Since
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.AssignedSince}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-[13px] text-[#2E2E2E] mb-[3px]"
                    >
                      Sponsor Info
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.SponsorInfo}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-[13px] text-[#2E2E2E] mb-[3px]"
                    >
                      Sponsor Number
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.SponsorNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* form */}
          <div
            className="bg-white border-[1px] border-solid border-[#E5E7EB] rounded-[10px] p-[20px] mt-[20px]"
          >
            <h3 className="mb-[20px] text-[#007F5F]">Today Report</h3>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              {/* Vitals Row */}
              <div className="grid grid-cols-3 gap-[16px]">
                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Blood Pressure (Systolic/Diastolic)
                    </span>
                  }
                  name="bloodPressure"
                >
                  <Input placeholder="e.g. 120/80" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Blood Sugar (Mg/DL)
                    </span>
                  }
                  name="bloodSugar"
                >
                  <Input placeholder="e.g. 100" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Temperature (°C)
                    </span>
                  }
                  name="temperature"
                >
                  <Input placeholder="e.g. 36.6" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Oxygen Saturation (%)
                    </span>
                  }
                  name="oxygenSaturation"
                >
                  <Input placeholder="e.g. 98" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Heart Rate (BPM)
                    </span>
                  }
                  name="heartRate"
                >
                  <Input placeholder="e.g. 72" />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Weight (Kg)
                    </span>
                  }
                  name="weight"
                >
                  <Input placeholder="e.g. 70" />
                </Form.Item>
              </div>

              {/* Patient Status Row */}
              <div className="grid grid-cols-3 gap-[16px]">
                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Patient Status
                    </span>
                  }
                  name="patientStatus"
                >
                  <Select placeholder="Select status">
                    <Option value="stable">Stable</Option>
                    <Option value="critical">Critical</Option>
                    <Option value="recovering">Recovering</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Symptoms Observed
                    </span>
                  }
                  name="symptoms"
                >
                  <Input placeholder="e.g. Fever, cough..." />
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Treatment Performed
                    </span>
                  }
                  name="treatment"
                >
                  <Select placeholder="Select treatment">
                    <Option value="medication">Medication</Option>
                    <Option value="injection">Injection</Option>
                    <Option value="observation">Observation</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Escalation + Next Check + Upload Row */}
              <div className="grid grid-cols-3 gap-[16px]">
                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Escalate To Physician?
                    </span>
                  }
                  name="escalate"
                >
                  <Radio.Group>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Next Suggested Check
                    </span>
                  }
                  className="mb-[0px]"
                >
                  <div className="flex gap-[8px]">
                    <Form.Item
                      name="nextDate"
                      className="mb-[0px] flex-1"
                    >
                      <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item
                      name="nextTime"
                      className="mb-[0px] flex-1"
                    >
                      <TimePicker className="w-full" format="HH:mm" />
                    </Form.Item>
                  </div>
                </Form.Item>

                <Form.Item
                  label={
                    <span
                      className="text-[#1B1B1B] text-[15px] font-semibold"
                    >
                      Lab Report
                    </span>
                  }
                  name="labReport"
                >
                  <Upload beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />} className="w-full">
                      Upload Attachments
                    </Button>
                  </Upload>
                </Form.Item>
              </div>

              {/* Notes */}
              <Form.Item
                label={
                  <span
                    className="text-[#1B1B1B] text-[15px] font-semibold"
                  >
                    Care Taker Notes
                  </span>
                }
                name="notes"
              >
                <TextArea rows={4} placeholder="Add your comments here" />
              </Form.Item>

              {/* Buttons */}
              <div
                className="flex justify-end gap-[10px]"
              >
                <SecondaryBtn name="Cancel" />

                <Primarybtn name=" Submit Report" htmlType="submit" />
              </div>
            </Form>
          </div>

          {/* medical history */}
          <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-[16px] min-w-0">
            <SectionHeader title="Medical History">
              <Primarybtn
                name="Request Appointment"
                onClick={() => navigate("/appointments", { state: { openBookingModal: true } })}
              />
              <SecondaryBtn name="update membership" />
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
        </div>
      </div>
    </div>
  );
}
