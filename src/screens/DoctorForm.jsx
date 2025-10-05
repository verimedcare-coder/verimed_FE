import React from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";

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

export default function DoctorForm() {
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
        </div>
      </div>
    </div>
  );
}
