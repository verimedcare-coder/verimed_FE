import React from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import bloodPressure from "../assets/icons/blood-pressure.svg";
import heartRate from "../assets/icons/heart-rate.svg";
import oxygen from "../assets/icons/oxygen.svg";
import respiratory from "../assets/icons/respiratory.svg";
import statusIcon from "../assets/icons/status.svg";
import sugar from "../assets/icons/sugar.svg";
import weight from "../assets/icons/weight.svg";
import temperature from "../assets/icons/temperature.png";
import Primarybtn from "../components/PrimaryBtn";
import { Button, Table } from "antd";
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
            padding: "30px",
            overflowY: "auto",
            overflowX: "hidden",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* vitals */}
          <div style={vitalsGrid}>
            {vitals.map((item, i) => (
              <div key={i} style={vitalCard}>
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{ width: 24, height: 24, flexShrink: 0 }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                  }}
                >
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

          {/* divider */}
          <div
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#1B1B1B",
              opacity: 0.1,
              marginTop: 10,
              marginBottom: 10,
            }}
          />

          {/* My Daily Reports Table */}
          <div style={tableContainer}>
            <SectionHeader title="My Daily Reports">
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

          {/* divider */}
          <div
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#1B1B1B",
              opacity: 0.1,
              marginTop: 10,
              marginBottom: 10,
            }}
          />

          {/* Medical Reports & Daily Reports */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
              gap: 12,
            }}
          >
            <div
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#004E89",
                padding: 20,
                borderRadius: 16,
                width: "60%",
                backgroundColor: "#004E890A",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{ color: "#2E2E2E", fontSize: 16, fontWeight: "500" }}
                >
                  Medical Reports (Doctor Reports)
                </p>
                <Primarybtn name="View Full Reports" onClick={() => {}} />
              </div>
              <div
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#1B1B1B",
                  opacity: 0.1,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
              <div>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontWeight: "500",
                  }}
                >
                  - Patient stable, continue medication, BP to be checked daily.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                    }}
                  >
                    - Diabetes under control, advised diet adjustment.
                  </p>
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontStyle: "italic",
                    }}
                  >
                    Aug 15, 2025 – Dr. Paul
                  </p>
                </div>
              </div>
              <div
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#1B1B1B",
                  opacity: 0.1,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
              <div>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontWeight: "500",
                  }}
                >
                  - BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                    }}
                  >
                    - BP: 150/92 | Status: ⚠ Escalated to Physician
                  </p>
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontSize: 16,
                      fontStyle: "italic",
                    }}
                  >
                    Aug 16, 2025 – Nurse Clarisse
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "40%",
                backgroundColor: "white",
                padding: 20,
                borderRadius: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{ color: "#007F5F", fontSize: 16, fontWeight: "500" }}
                >
                  Daily Reports (Submitted by Care Taker)
                </p>
                <Primarybtn name="View All" onClick={() => {}} />
              </div>
              <div
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#1B1B1B",
                  opacity: 0.1,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
              <div>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontWeight: "500",
                  }}
                >
                  - Patient stable, continue medication, BP to be checked daily.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                    }}
                  >
                    - Diabetes under control, advised diet adjustment.
                  </p>
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontStyle: "italic",
                    }}
                  >
                    Aug 15, 2025 – Dr. Paul
                  </p>
                </div>
              </div>
              <div
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#1B1B1B",
                  opacity: 0.1,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
              <div>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontWeight: "500",
                  }}
                >
                  - BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                    }}
                  >
                    - BP: 150/92 | Status: ⚠ Escalated to Physician
                  </p>
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontStyle: "italic",
                    }}
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

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };

const tableContainer = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  width: "97%",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};
