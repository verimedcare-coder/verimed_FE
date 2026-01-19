import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import Primarybtn from "../components/PrimaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";
import { Button, DatePicker, Table, Spin } from "antd";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { base_url } from "../constants/constants";
import axios from "axios";

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

export default function MyAppointments() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  if (!user) {
    window.location.href = "/";
  }
  const { appointmentData } = location.state || {};

  const doctorDataRaw = localStorage.getItem("doctorData");
  let doctorId = null;
  if (doctorDataRaw && doctorDataRaw !== "undefined") {
    const doctorData = JSON.parse(doctorDataRaw);
    doctorId = doctorData?.id || null;
  }

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        const endpoint = `${base_url}/vb_doctorappoinment_list/`;
        const headers = { Authorization: `Token ${token}` };

        const payload = { doctorprofileid: doctorId };
        const res = await axios.post(endpoint, payload, { headers });
        if (Array.isArray(res.data)) {
          setDoctorAppointments(res.data);
        } else {
          console.warn("Unexpected doctor appointments response:", res.data);
        }
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      }
    };
    fetchDoctorAppointments();
  }, [doctorId, token]);

  const showMore = () =>
    setVisibleCount((prev) => Math.min(prev + 3, doctorAppointments.length));
  const showLess = () => setVisibleCount(3);
  const hasMore = visibleCount < doctorAppointments.length;

  // Columns for Table
  const columns = [
    {
      title: "Date & Time",
      dataIndex: "dateTime",
      key: "dateTime",
      width: 150,
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
      width: 150,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    // {
    //   title: "Care Taker",
    //   dataIndex: "careTaker",
    //   key: "careTaker",
    //   width: 150,
    // },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (text) => {
        let color = "#1890ff";
        if (text === "Rescheduled") color = "#ff4d4f";
        if (text === "Completed") color = "#52c41a";
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              color,
              border: `1px solid ${color}`,
              fontWeight: 500,
            }}
          >
            {text || "Ongoing"}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <span
          style={{
            color: "#D97706",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/view_patient_details", {
              state: { appointmentData: doctorAppointments[record.key] },
            })
          }
        >
          View Details
        </span>
      ),
    },
  ];

  // Map API data for Table
  const dataSource = doctorAppointments.map((appt, index) => {
    const patientUser = appt?.patient?.patient_name;
    const dateTime = appt.appointment_date
      ? new Date(
          `${appt.appointment_date}T${appt.appointment_time || "00:00:00"}`,
        )
      : null;
    return {
      key: index,
      dateTime: dateTime
        ? dateTime.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      patientName: patientUser || "",
      type: appt?.dep?.dep_name || "-",
      careTaker:
        appt.caretaker?.user?.first_name + appt?.caretaker?.user?.last_name ||
        "-",
      time: dateTime
        ? dateTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      status: appt.appointment_status || "Ongoing",
      action: "View Details",
    };
  });

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#F7F9FB" }}
    >
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />

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
          {/* Appointment Cards */}
          <div style={{ width: "100%" }}>
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ color: "#1B1B1B", fontWeight: "600", fontSize: 20 }}>
                Today's Schedule
              </p>
              <Primarybtn icon={<FilterOutlined />} name="Filter" />
            </div> */}

            {/* <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(372px, 1fr))",
                gap: 16,
                marginTop: 16,
              }}
            >
              {loading ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 40,
                  }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                appointmentData.slice(0, visibleCount).map((appt) => {
                  const name = appt?.patient?.patient_name;
                  const disease = appt?.appointment_type;
                  const place = appt.appointment_place;

                  const dt = appt.appointment_date
                    ? new Date(
                        `${appt.appointment_date}T${
                          appt.appointment_time || "00:00:00"
                        }`
                      )
                    : null;
                  const displayDate = dt
                    ? dt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "-";
                  const displayTime = dt
                    ? dt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  return (
                    <div
                      key={appt.id}
                      style={{
                        height: 256,
                        borderRadius: 16,
                        padding: 20,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <img
                          alt={name}
                          src={
                            appt
                              ? appt?.patient?.photo_view_url
                              : patientdetails
                          }
                          style={{
                            height: 65,
                            width: 65,
                            borderRadius: 100,
                            objectFit: "contain",
                          }}
                        />
                        <div>
                          <p style={{ fontSize: 16, fontWeight: "600" }}>
                            {name}
                          </p>
                          <p style={{ color: "#7A7D84" }}>{disease}</p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#004E891F",
                              height: 22,
                              width: 82,
                              borderRadius: 20,
                            }}
                          >
                            <p style={{ fontSize: 12, color: "#004E89" }}>
                              {place}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          height: 1,
                          width: "100%",
                          backgroundColor: "#E5E5E5",
                          margin: "12px 0",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                        }}
                      >
                        <div>
                          <p style={{ color: "#2E2E2E", fontWeight: "600" }}>
                            {displayDate}
                          </p>
                          <p style={{ color: "#7A7D84", fontSize: 12 }}>
                            {displayTime}
                          </p>
                        </div>

                        <div
                          style={{
                            height: "100%",
                            width: 1,
                            backgroundColor: "#E5E5E5",
                          }}
                        />

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                          }}
                        >
                          <div>
                            <p style={{ color: "#2E2E2E", fontWeight: "600" }}>
                              {appt.amount || "-"}
                            </p>
                            <p style={{ color: "#7A7D84", fontSize: 12 }}>
                              {appt.subscription_plan || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <SecondaryBtn
                          name="Patient Details"
                          onClick={() =>
                            navigate("/my_patients", {
                              state: { appointmentData: appt },
                            })
                          }
                        />
                        <Primarybtn name="Visit Patient" onClick={() => {}} />
                      </div>
                    </div>
                  );
                })
              )}
            </div> */}

            {doctorAppointments.length > 3 && !loading && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                {hasMore ? (
                  <button
                    onClick={showMore}
                    style={{
                      background: "transparent",
                      color: "#004E89",
                      border: "1px solid #004E89",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Show More
                  </button>
                ) : (
                  <button
                    onClick={showLess}
                    style={{
                      background: "transparent",
                      color: "#004E89",
                      border: "1px solid #004E89",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </div>
          <div style={{ width: "100%" }}>
            {/* Appointment Table */}
            <div style={tableContainer}>
              <SectionHeader title="Appointment List">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  <DatePicker
                    picker="year"
                    defaultValue={dayjs("2025", "YYYY")}
                    suffixIcon={<CalendarOutlined />}
                    style={{ width: 100 }}
                  />
                  <Primarybtn icon={<FilterOutlined />} name="Filter" />
                </div>
              </SectionHeader>

              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered={false}
                style={{ width: "100%" }}
              />
            </div>
          </div>
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
  width: "100%",
  minWidth: 0,
};
