import React from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";
import { Button, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Primarybtn from "../components/PrimaryBtn";

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

export default function MyCareTaker() {
  const appointmentDetails = [
    {
      date: "Aug 10, 2025 – 10:00 AM",
      title1: "Vitals Submitted",
      answer1: "BP 128/78, Sugar 110, Temp 36.8",
      title2: "Care Taker Note",
      answer2: "Patient stable, no issues. Continue medication as prescribed.",
    },
    {
      date: "Aug 10, 2025 – 10:00 AM",
      title1: "Vitals Submitted",
      answer1: "BP 128/78, Sugar 110, Temp 36.8",
      title2: "Care Taker Note",
      answer2: "Patient stable, no issues. Continue medication as prescribed.",
    },
    {
      date: "Aug 10, 2025 – 10:00 AM",
      title1: "Vitals Submitted",
      answer1: "BP 128/78, Sugar 110, Temp 36.8",
      title2: "Care Taker Note",
      answer2: "Patient stable, no issues. Continue medication as prescribed.",
    },
  ];

  const timelineData = [
    {
      bloodPressure: "128/78",
      bloodSugar: "110",
      temp: "36.8",
      oxygen: "95",
      heartRate: "78",
      weight: "70kg",
      date: "Aug 15, 2025 – 11:00 am",
    },
    {
      bloodPressure: "128/78",
      bloodSugar: "110",
      temp: "36.8",
      oxygen: "95",
      heartRate: "78",
      weight: "70kg",
      date: "Aug 15, 2025 – 10:30 am",
    },
  ];

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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 20,
              width: "100%",
            }}
          >
            {/* LEFT: Latest Actions Timeline */}
            <div style={appointmentWrapper}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <SectionHeader title="Latest Actions by Care Taker" />
                <Button
                  onClick={() => {}}
                  style={{
                    border: "none",
                    boxShadow: "none",
                    color: "#F0C330",
                    fontSize: 20,
                    fontWeight: "600",
                  }}
                >
                  View All
                </Button>
              </div>
              <div style={timelineWrapper}>
                <div style={timelineLine}></div> {/* vertical line */}
                {appointmentDetails.map((item, index) => (
                  <div key={index} style={timelineItem}>
                    <div style={timelineDot}></div>
                    <div style={timelineContent}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: -10,
                        }}
                      >
                        <p style={apptDate}>{item.date} </p>
                      </div>
                      {item.title1 && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          {item.title1}:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.answer1}
                          </span>
                        </p>
                      )}
                      {item.title2 && (
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2E2E2E",
                          }}
                        >
                          {item.title2}:{" "}
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "#06152B99",
                            }}
                          >
                            {item.answer2}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Timeline */}
            <div style={timelineCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <SectionHeader title="Health Monitoring Snapshot" />
                <Button
                  onClick={() => {}}
                  style={{
                    border: "none",
                    boxShadow: "none",
                    color: "#F0C330",
                    fontSize: 20,
                    fontWeight: "600",
                    backgroundColor: "transparent",
                  }}
                >
                  View All
                </Button>
              </div>
              {timelineData.map((item, index) => (
                <div key={index} style={timelineBox}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#2E2E2E",
                    }}
                  >
                    Blood Pressure:{" "}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#06152B99",
                      }}
                    >
                      {item.bloodPressure}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#2E2E2E",
                    }}
                  >
                    Blood Sugar:{" "}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#06152B99",
                      }}
                    >
                      {item.bloodSugar}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#2E2E2E",
                    }}
                  >
                    Temperature:{" "}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#06152B99",
                      }}
                    >
                      {item.temp}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#2E2E2E",
                    }}
                  >
                    Oxygen:{" "}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#06152B99",
                      }}
                    >
                      {item.oxygen}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#2E2E2E",
                    }}
                  >
                    Heart Rate:{" "}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#06152B99",
                      }}
                    >
                      {item.heartRate}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#2E2E2E",
                    }}
                  >
                    Weight:{" "}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#06152B99",
                      }}
                    >
                      {item.weight}
                    </span>
                  </p>
                  <p style={timelineDate}>{item.date}</p>
                </div>
              ))}
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

          {/* Feedback To My Care Taker */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              width: "97%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <SectionHeader title="Feedback to My Care Taker" />
            {/* divider */}
            <div
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#1B1B1B",
                opacity: 0.1,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 20,
                width: "100%",
              }}
            >
              {/* How are you feeling today? */}
              <div style={{ flex: 1 }}>
                <Select
                  style={{ width: "100%", height: 42 }}
                  placeholder="How are you feeling today?"
                  options={[
                    { value: "good", label: "Good" },
                    { value: "okay", label: "Okay" },
                    { value: "not_well", label: "Not Well" },
                  ]}
                />
              </div>
              {/* Attach Photo */}
              <div style={{ flex: 1 }}>
                <Upload
                  name="photo"
                  listType="picture"
                  maxCount={1}
                  showUploadList={{ showPreviewIcon: false }}
                  beforeUpload={() => false}
                  style={{ width: "100%" }}
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{
                      width: "100%",
                      height: 42,
                    }}
                  >
                    Attach Photo (medication pack, wound check)
                  </Button>
                </Upload>
              </div>
            </div>
            {/* Your Comments */}
            <div style={{ width: "100%", marginTop: 20 }}>
              <Input.TextArea
                rows={4}
                placeholder="Your Comments"
                style={{ width: "100%" }}
              />
            </div>
            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 24,
                width: "100%",
              }}
            >
              <SecondaryBtn name="Cancel" onClick={() => {}} />
              <Primarybtn name="Submit Feedback" onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* LEFT SIDE */
const appointmentWrapper = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const timelineWrapper = {
  position: "relative",
  marginLeft: 20,
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
  opacity: 0.1,
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

/* RIGHT SIDE */
const timelineCard = {
  background: "#004E890A",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #004E89",
};

const timelineBox = {
  marginBottom: 20,
  position: "relative",
  borderBottom: "1px solid #1B1B1B1A",
  paddingBottom: 20,
};

const timelineDate = {
  fontSize: 12,
  fontStyle: "italic",
  color: "#6B7280",
  position: "absolute",
  bottom: -5,
  right: 8,
};
