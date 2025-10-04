import React from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";
import { Button, Table } from "antd";
import Primarybtn from "../components/PrimaryBtn";
import { CalendarOutlined } from "@ant-design/icons";

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
    <div style={{ display: "flex", backgroundColor: "#F7F9FB" }}>
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
            display: "flex",
            backgroundColor: "#F7F9FB",
            flexDirection: "column",
            padding: 20,
            gap: 20,
          }}
        >
          <div
            style={{
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: 20,
              width: "auto",
            }}
          >
            {/* Header Row */}

            <div
              style={{
                borderTop: "1px solid #E5E7EB",
                marginBottom: "16px",
              }}
            />

            {/* Content Row */}
            <div style={{ display: "flex", gap: "16px" }}>
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
              </div>
            </div>
          </div>
        </div>

        {/* daily reports table */}
        <div style={tableContainer}>
          <SectionHeader title="Patient Vitals History">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <Button
                style={{
                  height: 38,
                  borderColor: "#0000001F",
                  borderRadius: 12,
                }}
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
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

const tableContainer = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  margin: 20,
  minWidth: 0,
};
