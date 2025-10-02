import React from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";

export default function MyCareTaker() {
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
          {/* Care Taker Details */}
          <div
            style={{
              width: "98%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                textAlign: "left",
                textTransform: "capitalize",
                color: "#2E2E2E",
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Care Taker Details
            </p>
            <SecondaryBtn name="Send Message" onClick={() => {}} />
          </div>
          <div
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#1B1B1B1A",
              padding: 20,
              borderRadius: 16,
              width: "95%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <img
                  src={patientdetails}
                  alt="profile"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "12px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontWeight: "500",
                      opacity: 0.6,
                    }}
                  >
                    Name
                  </p>
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    Clarissa A.
                  </p>
                </div>
              </div>
              <div>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontWeight: "500",
                    opacity: 0.6,
                  }}
                >
                  Role
                </p>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  Geriatric Care
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontWeight: "500",
                    opacity: 0.6,
                  }}
                >
                  Contact Number
                </p>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  +966 558441502
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontWeight: "500",
                    opacity: 0.6,
                  }}
                >
                  Assigned Since
                </p>
                <p
                  style={{
                    color: "#2E2E2E",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  July 2025
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
                  opacity: 0.6,
                }}
              >
                Role
              </p>
              <p
                style={{
                  color: "#2E2E2E",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                Daily monitoring, vitals check, record submission
              </p>
            </div>
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

          {/* Latest Actions By Care Taker */}
        </div>
      </div>
    </div>
  );
}
