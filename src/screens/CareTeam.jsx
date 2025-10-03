import React from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";

export default function CareTeam() {
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
            flex: 1,
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            padding: 20,
            overflowY: "auto",
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

              {/* Action 1 */}
              <div style={timelineItem}>
                <div style={timelineDot}></div>
                <div style={timelineContent}>
                  <p style={apptDate}>Aug 15, 2025 — 10:00 AM</p>
                  <p
                    style={{ fontSize: 14, fontWeight: 600, color: "#2E2E2E" }}
                  >
                    Vitals Submitted → BP 128/78, Sugar 110, Temp 36.8
                  </p>
                  <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                    <strong>Care Taker Note:</strong> Patient stable, no issues.
                    Continue medication as prescribed.
                  </p>
                </div>
              </div>

              {/* Action 2 */}
              <div style={timelineItem}>
                <div style={timelineDot}></div>
                <div style={timelineContent}>
                  <p style={apptDate}>Aug 10, 2025 — 4:00 PM</p>
                  <p
                    style={{ fontSize: 14, fontWeight: 600, color: "#2E2E2E" }}
                  >
                    Follow-up Recorded → Virtual consult with Dr. Paul completed
                  </p>
                  <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                    <strong>Care Taker Note:</strong> BP slightly elevated.
                    Physician adjusted dosage.
                  </p>
                </div>
              </div>

              {/* Action 3 */}
              <div style={timelineItem}>
                <div style={timelineDot}></div>
                <div style={timelineContent}>
                  <p style={apptDate}>July 25, 2025 — 9:00 PM</p>
                  <p
                    style={{ fontSize: 14, fontWeight: 600, color: "#2E2E2E" }}
                  >
                    Emergency Report → High sugar, IV fluids administered
                  </p>
                  <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                    <strong>Care Taker Note:</strong> Patient stabilized.
                    Physician informed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Health Monitoring Snapshot (updated to match image) */}
          <div style={snapshotWrapper}>
            <SectionHeader title="Health Monitoring Snapshot">
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

            <div style={snapshotBox}>
              {/* First snapshot block */}
              <div style={vitalsGrid}>
                <InfoItem label="Blood Pressure" value="128/78" />
                <InfoItem label="Blood Sugar" value="110" />
                <InfoItem label="Temperature" value="36.8°C" />
                <InfoItem label="Oxygen" value="95%" />
                <InfoItem label="Heart Rate" value="78 bpm" />
                <InfoItem label="Weight" value="70 kg" />
              </div>

              <div style={lastUpdateRow}>
                <span />
                <p style={lastUpdateText}>
                  Last Update: Aug 15, 2025 — 10:00 AM
                </p>
              </div>

              <div style={divider} />

              {/* Second snapshot block (older values) */}
              <div style={{ marginTop: 8 }}>
                <div style={vitalsGrid}>
                  <InfoItem label="Blood Pressure" value="128/78" />
                  <InfoItem label="Blood Sugar" value="110" />
                  <InfoItem label="Temperature" value="36.8°C" />
                  <InfoItem label="Oxygen" value="95%" />
                  <InfoItem label="Heart Rate" value="78 bpm" />
                  <InfoItem label="Weight" value="70 kg" />
                </div>

                <div style={lastUpdateRow}>
                  <span />
                  <p style={lastUpdateText}>
                    Last Update: Aug 14, 2025 — 10:00 AM
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
  width: "100%",
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

const vitalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "8px 16px",
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
