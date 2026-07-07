/* eslint-disable no-unused-vars */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { careTeamService } from "../services/careTeamService";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";
import { base_url } from "../constants/constants";
import axios from "axios";
import { Empty, message } from "antd";
const actions = [
  {
    date: "Aug 15, 2025 — 10:00 AM",
    title: "Vitals Submitted → BP 128/78, Sugar 110, Temp 36.8",
    note: "Patient stable, no issues. Continue medication as prescribed.",
  },
  {
    date: "Aug 10, 2025 — 4:00 PM",
    title: "Follow-up Recorded → Virtual consult with Dr. Paul completed",
    note: "BP slightly elevated. Physician adjusted dosage.",
  },
  {
    date: "July 25, 2025 — 9:00 PM",
    title: "Emergency Report → High sugar, IV fluids administered",
    note: "Patient stabilized. Physician informed.",
  },
];

export default function CareTeam() {
  const token = localStorage.getItem("token");

  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  if (!user) {
    window.location.href = "/";
  }

  const profileId = user?.profile_id || 4;
  const { data: appointments = [] } = useQuery({
    queryKey: ["patientAppointments", profileId],
    queryFn: async () => {
      const res = await careTeamService.getPatientAppointments(profileId);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!profileId && !!token,
  });

  const vitalsData = appointments.length > 0 ? appointments[0] : null;
  const patientData = vitalsData?.patient || null;

  const careTeam = vitalsData
    ? {
        name:
          vitalsData.caretaker?.caretaker_id ||
          `${vitalsData.caretaker?.user || ""}` ||
          "N/A",
        role: "Caretaker",
        contact: vitalsData.caretaker?.contact || "N/A",
        nextVisit: vitalsData.appointment_date || "N/A",
        frequency: "Weekly",
        specialization: vitalsData.caretaker?.skillset || "General Care",
        experience: vitalsData.caretaker?.caretaker_exprience || "N/A",
        languages: vitalsData.caretaker?.languages || "N/A",
      }
    : {};

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

        {/* Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            background: "#F9FAFB",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: 20,
              margin: "20px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  margin: 0,
                  color: "#2E2E2E",
                }}
              >
                Care Team Details
              </h3>

              <SecondaryBtn name="view reports" onClick={() => {}} />
            </div>
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
                src={careTeam?.avatar || patientdetails}
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
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Name
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Role
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.role || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Experience
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.Experience || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Languages
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.Languages || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Contact Number
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.Contact || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #E5E7EB" }} />

                {/* Row 3 */}
                <div>
                  <div style={{ fontSize: "13px", color: "#6B7280" }}>
                    Specialization
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    {careTeam.specialization || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 20,
              minWidth: 0,
              overflowY: "auto",
              padding: "20px",
            }}
          >
            {/* LEFT SIDE - Latest Actions by Care Taker (kept same) */}
            <div style={cardStyle}>
              <SectionHeader title="Latest Actions by Care Taker">
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#007F5F",
                    cursor: "pointer",
                  }}
                >
                  View All
                </p>
              </SectionHeader>

              <div style={timelineWrapper}>
                <div style={timelineLine}></div>

                {/* {actions.map((action, index) => (
                  <div key={index} style={timelineItem}>
                    <div style={timelineDot}></div>
                    <div style={timelineContent}>
                      <p style={apptDate}>{action.date}</p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#2E2E2E",
                        }}
                      >
                        {action.title}
                      </p>
                      <p
                        style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}
                      >
                        <strong>Care Taker Note:</strong> {action.note}
                      </p>
                    </div>
                  </div>
                ))} */}
                <Empty description="no data" />
              </div>
            </div>

            {/* 
          Right panel */}
            <div style={timelineCard}>
              <SectionHeader title="Health Monitoring Snapshot">
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#B78520",
                    cursor: "pointer",
                  }}
                >
                  View All
                </p>
              </SectionHeader>

              {/* {[
                {
                  date: "Aug 15, 2025 — 10:00 AM",
                  vitals: {
                    "Blood Pressure": "128/78",
                    "Blood Sugar": "110",
                    Temperature: "36.8°C",
                    Oxygen: "95%",
                    "Heart Rate": "78 bpm",
                    Weight: "70 kg",
                  },
                },
                {
                  date: "Aug 14, 2025 — 10:00 AM",
                  vitals: {
                    "Blood Pressure": "130/80",
                    "Blood Sugar": "112",
                    Temperature: "36.7°C",
                    Oxygen: "96%",
                    "Heart Rate": "76 bpm",
                    Weight: "70 kg",
                  },
                },
              ].map((snapshot, idx, arr) => (
                <div
                  key={idx}
                  style={{
                    ...timelineBox,
                    borderBottom:
                      idx === arr.length - 1 ? "none" : "1px solid #007F5F4D",
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <div style={vitalsGrid}>
                      {Object.entries(snapshot.vitals).map(
                        ([label, value], i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                fontSize: 14,
                                color: "#6B7280",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {label}
                            </p>
                            :{" "}
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#1B1B1B",
                              }}
                            >
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <p style={timelineDateRight}>
                      Last Update: {snapshot.date}
                    </p>
                  </div>
                </div>
              ))} */}
              <Empty description="no data" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Section Header */
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
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#1B1B1B",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* 🔹 Styles */
const cardStyle = {
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  minWidth: 0,
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const timelineWrapper = {
  position: "relative",
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
  opacity: 0.08,
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

/* Snapshot / Right Column styles */
const snapshotWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const snapshotBox = {
  background: "#EAF6FB", // pale blue like screenshot
  border: "1px solid #CFEFF9",
  borderRadius: 10,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const lastUpdateRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 6,
};

const lastUpdateText = {
  fontSize: 12,
  color: "#6B7280",
  fontStyle: "italic",
  margin: 0,
};

const divider = {
  height: 1,
  background: "rgba(0,0,0,0.06)",
  borderRadius: 1,
  marginTop: 6,
};

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
  textAlign: "right",
};

const timelineDateRight = {
  fontSize: 12,
  fontStyle: "italic",
  color: "#6B7280",
  textAlign: "right",
  margin: 0,
};

const vitalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
  gap: "8px 16px",
};
