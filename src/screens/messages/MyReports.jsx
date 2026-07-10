import React from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import bloodPressure from "../../assets/icons/blood-pressure.svg";
import heartRate from "../../assets/icons/heart-rate.svg";
import oxygen from "../../assets/icons/oxygen.svg";
import respiratory from "../../assets/icons/respiratory.svg";
import statusIcon from "../../assets/icons/status.svg";
import sugar from "../../assets/icons/sugar.svg";
import weight from "../../assets/icons/weight.svg";
import temperature from "../../assets/icons/temperature.png";
import Primarybtn from "../../components/common/PrimaryBtn";
import { Button, Table } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

function SectionHeader({ title, children }) {
  return (
    <div
      className="flex justify-between items-center flex-wrap gap-[10px] min-w-0"
    >
      <p className="text-[16px] font-semibold text-[#1B1B1B]">{title}</p>
      <div className="flex gap-[10px] flex-wrap">
        {children}
      </div>
    </div>
  );
}

export default function MyReports() {
  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

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

  const myDailyReports = [
    {
      date: "Aug 15, 2025",
      time: "10:00 AM",
      bp: "129/84",
      sugar: "111",
      temp: "36.7",
      oxygen: "95%",
      hr: "76",
      weight: "70.4kg",
    },
    {
      date: "Aug 15, 2025",
      time: "10:00 AM",
      bp: "129/84",
      sugar: "111",
      temp: "36.7",
      oxygen: "95%",
      hr: "76",
      weight: "70.4kg",
    },
    {
      date: "Aug 15, 2025",
      time: "10:00 AM",
      bp: "129/84",
      sugar: "111",
      temp: "36.7",
      oxygen: "95%",
      hr: "76",
      weight: "70.4kg",
    },
    {
      date: "Aug 15, 2025",
      time: "10:00 AM",
      bp: "129/84",
      sugar: "111",
      temp: "36.7",
      oxygen: "95%",
      hr: "76",
      weight: "70.4kg",
    },
  ];

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
      title: "BP",
      dataIndex: "bp",
      key: "bp",
      width: 120,
    },
    {
      title: "Sugar",
      dataIndex: "sugar",
      key: "sugar",
      width: 120,
    },
    {
      title: "Temp",
      dataIndex: "temp",
      key: "temp",
      width: 120,
    },
    {
      title: "Oxygen",
      dataIndex: "oxygen",
      key: "oxygen",
      width: 120,
    },
    {
      title: "HR",
      dataIndex: "hr",
      key: "hr",
      width: 120,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: 120,
    },
  ];

  const dataSource = myDailyReports.map((item, index) => ({
    key: index,
    ...item,
  }));

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
        <div
          className="p-[30px] overflow-y-auto overflow-x-hidden gap-[20px] flex flex-col items-center"
        >
          {/* vitals */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[15px] min-w-0 w-full">
            {vitals.map((item, i) => (
              <div key={i} className="flex items-center gap-[10px] border-[1px] border-solid border-[#1B1B1B1A] rounded-[10px] p-[10px] min-h-[80px] min-w-0">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-[24px] h-[24px] shrink-0"
                />
                <div
                  className="flex flex-col min-w-0"
                >
                  <p className="text-[14px] font-semibold mb-[2px]">{item.label}</p>
                  <div
                    className="flex items-center gap-[5px]"
                  >
                    <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: item.color }}></div>
                    <span className="text-[14px] text-[#2E2E2E] break-words">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* divider */}
          <div
            className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
          />

          {/* My Daily Reports Table */}
          <div className="bg-white rounded-[12px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] w-[97%] flex flex-col gap-[20px]">
            <SectionHeader title="My Daily Reports">
              <div
                className="flex items-center justify-center gap-[12px]"
              >
                <Button
                  className="h-[38px] rounded-[12px] border-[1px] border-solid border-[#0000001F]"
                  onClick={() => {}}
                >
                  2025 <CalendarOutlined />
                </Button>
                <Primarybtn name="Export" />
              </div>
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

          {/* divider */}
          <div
            className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
          />

          {/* Medical Reports & Daily Reports */}
          <div
            className="flex items-start justify-between w-full gap-[12px]"
          >
            <div
              className="p-[20px] rounded-[16px] w-[60%] bg-[#004E890A] border-[1px] border-solid border-[#004E89]"
            >
              <div
                className="flex items-center justify-between"
              >
                <p
                  className="text-[#2E2E2E] text-[16px] font-medium"
                >
                  Medical Reports (Doctor Reports)
                </p>
                <Primarybtn name="View Full Reports" onClick={() => {}} />
              </div>
              <div
                className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
              />
              <div>
                <p
                  className="text-[#2E2E2E] font-medium"
                >
                  - Patient stable, continue medication, BP to be checked daily.
                </p>
                <div
                  className="flex flex-row items-center justify-between"
                >
                  <p
                    className="text-[#2E2E2E] font-medium"
                  >
                    - Diabetes under control, advised diet adjustment.
                  </p>
                  <p
                    className="text-[#2E2E2E] italic"
                  >
                    Aug 15, 2025 – Dr. Paul
                  </p>
                </div>
              </div>
              <div
                className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
              />
              <div>
                <p
                  className="text-[#2E2E2E] font-medium"
                >
                  - BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable
                </p>
                <div
                  className="flex flex-row items-center justify-between"
                >
                  <p
                    className="text-[#2E2E2E] font-medium"
                  >
                    - BP: 150/92 | Status: ⚠ Escalated to Physician
                  </p>
                  <p
                    className="text-[#2E2E2E] text-[16px] italic"
                  >
                    Aug 16, 2025 – Nurse Clarisse
                  </p>
                </div>
              </div>
            </div>
            <div
              className="w-[40%] bg-white p-[20px] rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <div
                className="flex items-center justify-between"
              >
                <p
                  className="text-[#007F5F] text-[16px] font-medium"
                >
                  Daily Reports (Submitted by Care Taker)
                </p>
                <Primarybtn name="View All" onClick={() => {}} />
              </div>
              <div
                className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
              />
              <div>
                <p
                  className="text-[#2E2E2E] font-medium"
                >
                  - Patient stable, continue medication, BP to be checked daily.
                </p>
                <div
                  className="flex flex-row items-center justify-between"
                >
                  <p
                    className="text-[#2E2E2E] font-medium"
                  >
                    - Diabetes under control, advised diet adjustment.
                  </p>
                  <p
                    className="text-[#2E2E2E] italic"
                  >
                    Aug 15, 2025 – Dr. Paul
                  </p>
                </div>
              </div>
              <div
                className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
              />
              <div>
                <p
                  className="text-[#2E2E2E] font-medium"
                >
                  - BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable
                </p>
                <div
                  className="flex flex-row items-center justify-between"
                >
                  <p
                    className="text-[#2E2E2E] font-medium"
                  >
                    - BP: 150/92 | Status: ⚠ Escalated to Physician
                  </p>
                  <p
                    className="text-[#2E2E2E] italic"
                  >
                    Aug 16, 2025 – Nurse Clarisse
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

