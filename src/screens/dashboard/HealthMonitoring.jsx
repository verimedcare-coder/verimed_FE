import React from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { Button, Table } from "antd";
import Primarybtn from "../../components/common/PrimaryBtn";
import { CalendarOutlined } from "@ant-design/icons";

function SectionHeader({ title, children }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-[10px] min-w-0">
      <p className="text-[16px] font-semibold text-[#1B1B1B] m-0">{title}</p>
      <div className="flex gap-[10px] flex-wrap">{children}</div>
    </div>
  );
}

export default function HealthMonitoring() {
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
      width: 100,
    },
    {
      title: "Sugar",
      dataIndex: "sugar",
      key: "sugar",
      width: 100,
    },
    {
      title: "Temp",
      dataIndex: "temp",
      key: "temp",
      width: 100,
    },
    {
      title: "Oxygen",
      dataIndex: "oxygen",
      key: "oxygen",
      width: 100,
    },
    {
      title: "Heart Rate",
      dataIndex: "hr",
      key: "hr",
      width: 120,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: 100,
    },
  ];

  const dataSource = myDailyReports.map((item, index) => ({
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
        <div className="flex bg-[#F7F9FB] flex-col p-[20px] gap-[20px]">
          <div className="bg-transparent border border-solid border-[#E5E7EB] rounded-[10px] p-[20px] w-auto">
            {/* Header Row */}
            <div className="border-t border-solid border-[#E5E7EB] mb-[16px]" />

            {/* Content Row */}
            <div className="flex gap-[16px]">
              {/* Left - Avatar */}
              <img
                src={patientdetails}
                alt="Profile"
                className="w-[60px] h-[60px] rounded-[12px] object-cover shrink-0"
              />

              {/* Right - Info Grid */}
              <div className="flex-1 flex flex-col gap-[14px]">
                {/* Row 1 */}
                <div className="grid grid-cols-4 gap-[10px]">
                  <div>
                    <div className="text-[13px] text-[#2E2E2E] mb-[3px]">
                      Name
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#2E2E2E] mb-[3px]">
                      Condition
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.Condition}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#2E2E2E] mb-[3px]">
                      Assigned Doctor
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.AssignedDoctor}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#2E2E2E] mb-[3px]">
                      Care Taker
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.CareTaker}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-solid border-[#E5E7EB]" />
                <div className="grid grid-cols-4 gap-[10px]">
                  {/* Row 3 */}
                  <div>
                    <div className="text-[13px] text-[#2E2E2E] mb-[3px]">
                      Condition(s)
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.Conditions}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#2E2E2E] mb-[3px]">
                      Assigned Since
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.AssignedSince}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#2E2E2E] mb-[3px]">
                      Sponsor Info
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.SponsorInfo}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#2E2E2E] mb-[3px]">
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
        </div>

        {/* daily reports table */}
        <div className="bg-white rounded-[12px] p-[20px] shadow-sm flex flex-col gap-[16px] m-[20px] min-w-0">
          <SectionHeader title="Patient Vitals History">
            <div className="flex items-center justify-center gap-[12px]">
              <Button
                className="h-[38px] border-[#0000001F] rounded-[12px]"
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
      </div>
    </div>
  );
}
