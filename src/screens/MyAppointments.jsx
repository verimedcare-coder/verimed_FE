import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import Primarybtn from "../components/PrimaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";
import { Button, DatePicker, Table } from "antd";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const todaysAppointment = [
    {
      id: 1,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
    {
      id: 2,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
    {
      id: 3,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
    {
      id: 4,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
    {
      id: 5,
      name: "Mr. Samuel N.",
      disease: "Hypertension, Type 2 Diabetes",
      place: "Home Visit",
      date: "Aug 15",
      time: "10:00 AM - 01:00 PM",
      amount: "150,000 CFA",
      subscription: "Premium Plan",
    },
  ];

  const appointmentData = [
    {
      dateTime: "Aug 18, 10:00",
      patientName: "Samuel N.",
      type: "Home Visit",
      careTaker: "Nurse Clarisse",
      time: "11:00 AM",
      status: "Ongoing",
      action: "View Details",
    },
    {
      dateTime: "Aug 18, 11:00",
      patientName: "Emily R.",
      type: "Virtual Consult",
      careTaker: "Dr. Smith",
      time: "11:00 AM",
      status: "Ongoing",
      action: "View Details",
    },
    {
      dateTime: "Aug 18, 12:30",
      patientName: "Michael B.",
      type: "Home Visit",
      careTaker: "Nurse Jenna",
      time: "11:30 AM",
      status: "Ongoing",
      action: "View Details",
    },
    {
      dateTime: "Aug 19, 09:00",
      patientName: "Sarah L.",
      type: "Virtual Consult",
      careTaker: "Dr. Lee",
      time: "11:00 AM",
      status: "Ongoing",
      action: "View Details",
    },
    {
      dateTime: "Aug 19, 14:00",
      patientName: "James T.",
      type: "Home Visit",
      careTaker: "Nurse Alex",
      time: "11:00 AM",
      status: "Rescheduled",
      action: "View Details",
    },
    {
      dateTime: "Aug 19, 15:30",
      patientName: "Laura W.",
      type: "Consultation",
      careTaker: "Dr. Patel",
      time: "10:00 AM",
      status: "Completed",
      action: "View Details",
    },
    {
      dateTime: "Aug 20, 10:15",
      patientName: "David K.",
      type: "Home Visit",
      careTaker: "Nurse Bella",
      time: "10:00 AM",
      status: "Completed",
      action: "View Details",
    },
  ];

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
    {
      title: "Care Taker",
      dataIndex: "careTaker",
      key: "careTaker",
      width: 150,
    },
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
        let color = "#1890ff"; // default ongoing
        if (text === "Rescheduled") color = "#ff4d4f";
        if (text === "Completed") color = "#52c41a";
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              color: color,
              border: `1px solid ${color}`,
              fontWeight: 500,
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (text, record) => (
        <span
          style={{
            color: "#D97706",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => navigate("/view_patient_details")}
        >
          {text}
        </span>
      ),
    },
  ];

  const dataSource = appointmentData.map((item, index) => ({
    key: index,
    ...item,
  }));

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, todaysAppointment.length));
  };

  const showLess = () => {
    setVisibleCount(3);
  };

  const hasMore = visibleCount < todaysAppointment.length;

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
          {/* todays Appointment */}
          <div style={{ width: "100%" }}>
            <div
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
            </div>

            {/* Card Container */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(372px, 1fr))",
                gap: 16,
                marginTop: 16,
              }}
            >
              {todaysAppointment.slice(0, visibleCount).map((appt) => (
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
                      alt={appt.name}
                      src={patientdetails}
                      style={{
                        height: 65,
                        width: 65,
                        borderRadius: 100,
                        objectFit: "contain",
                      }}
                    />
                    <div>
                      <p style={{ fontSize: 16, fontWeight: "600" }}>
                        {appt.name}
                      </p>
                      <p style={{ color: "#7A7D84" }}>{appt.disease}</p>
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
                          {appt.place}
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM10 16.875C8.64026 16.875 7.31105 16.4718 6.18046 15.7164C5.04987 14.9609 4.16868 13.8872 3.64833 12.6309C3.12798 11.3747 2.99183 9.99237 3.2571 8.65875C3.52238 7.32513 4.17716 6.10013 5.13864 5.13864C6.10013 4.17716 7.32514 3.52237 8.65876 3.2571C9.99238 2.99183 11.3747 3.12798 12.631 3.64833C13.8872 4.16868 14.9609 5.04987 15.7164 6.18045C16.4718 7.31104 16.875 8.64025 16.875 10C16.8729 11.8227 16.1479 13.5702 14.8591 14.8591C13.5702 16.1479 11.8227 16.8729 10 16.875ZM15 10C15 10.1658 14.9342 10.3247 14.8169 10.4419C14.6997 10.5592 14.5408 10.625 14.375 10.625H10C9.83424 10.625 9.67527 10.5592 9.55806 10.4419C9.44085 10.3247 9.375 10.1658 9.375 10V5.625C9.375 5.45924 9.44085 5.30027 9.55806 5.18306C9.67527 5.06585 9.83424 5 10 5C10.1658 5 10.3247 5.06585 10.4419 5.18306C10.5592 5.30027 10.625 5.45924 10.625 5.625V9.375H14.375C14.5408 9.375 14.6997 9.44085 14.8169 9.55806C14.9342 9.67527 15 9.83424 15 10Z"
                        fill="#007F5F"
                      />
                    </svg>
                    <div>
                      <p style={{ color: "#2E2E2E", fontWeight: "600" }}>
                        {appt.date}
                      </p>
                      <p style={{ color: "#7A7D84", fontSize: 12 }}>
                        {appt.time}
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.375 6.99766V6.5625C14.375 4.60312 11.4195 3.125 7.5 3.125C3.58047 3.125 0.625 4.60312 0.625 6.5625V9.6875C0.625 11.3195 2.67578 12.6164 5.625 13.0047V13.4375C5.625 15.3969 8.58047 16.875 12.5 16.875C16.4195 16.875 19.375 15.3969 19.375 13.4375V10.3125C19.375 8.69531 17.3891 7.39687 14.375 6.99766ZM18.125 10.3125C18.125 11.3453 15.7195 12.5 12.5 12.5C12.2086 12.5 11.9195 12.4898 11.6344 12.4711C13.3195 11.857 14.375 10.8594 14.375 9.6875V8.26094C16.7086 8.60859 18.125 9.55234 18.125 10.3125ZM5.625 11.7383V9.87969C6.2467 9.96069 6.87304 10.0009 7.5 10C8.12696 10.0009 8.7533 9.96069 9.375 9.87969V11.7383C8.75422 11.83 8.12751 11.8757 7.5 11.875C6.87249 11.8757 6.24578 11.83 5.625 11.7383ZM13.125 8.58828V9.6875C13.125 10.343 12.1555 11.0469 10.625 11.4742V9.64844C11.6336 9.40391 12.4875 9.03984 13.125 8.58828ZM7.5 4.375C10.7195 4.375 13.125 5.52969 13.125 6.5625C13.125 7.59531 10.7195 8.75 7.5 8.75C4.28047 8.75 1.875 7.59531 1.875 6.5625C1.875 5.52969 4.28047 4.375 7.5 4.375ZM1.875 9.6875V8.58828C2.5125 9.03984 3.36641 9.40391 4.375 9.64844V11.4742C2.84453 11.0469 1.875 10.343 1.875 9.6875ZM6.875 13.4375V13.1117C7.08047 13.1195 7.28828 13.125 7.5 13.125C7.80312 13.125 8.09922 13.1148 8.38984 13.0977C8.7127 13.2132 9.04157 13.3113 9.375 13.3914V15.2242C7.84453 14.7969 6.875 14.093 6.875 13.4375ZM10.625 15.4883V13.625C11.2465 13.7085 11.8729 13.7503 12.5 13.75C13.127 13.7509 13.7533 13.7107 14.375 13.6297V15.4883C13.1316 15.6706 11.8684 15.6706 10.625 15.4883ZM15.625 15.2242V13.3984C16.6336 13.1539 17.4875 12.7898 18.125 12.3383V13.4375C18.125 14.093 17.1555 14.7969 15.625 15.2242Z"
                          fill="#007F5F"
                        />
                      </svg>
                      <div>
                        <p style={{ color: "#2E2E2E", fontWeight: "600" }}>
                          {appt.amount}
                        </p>
                        <p style={{ color: "#7A7D84", fontSize: 12 }}>
                          {appt.subscription}
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
                    <SecondaryBtn name="Patient Details" onClick={() => {}} />
                    <Primarybtn name="Visit Patient" onClick={() => {}} />
                  </div>
                </div>
              ))}
            </div>

            {/* Show More / Show Less Button */}
            {todaysAppointment.length > 3 && (
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

          {/* appoinment list */}
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
  width: "auto",
  minWidth: 0,
};
