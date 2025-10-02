import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import Banner from "../components/Banner";
import Success from "../assets/icons/success.svg";
import { useNavigate } from "react-router-dom";
import {
  DownOutlined,
  UpOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  UserOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Tabs,
  Button,
  Select,
  Card,
  Modal,
  Form,
  Input,
  Upload,
  message,
  DatePicker,
} from "antd";
import Primarybtn from "../components/PrimaryBtn";
import SecondaryBtn from "../components/SecondaryBtn";

const { TabPane } = Tabs;
const { Option } = Select;

export default function Appointments() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7));
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedMonth, setSelectedMonth] = useState("Aug 2025");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const appointments = [
    {
      id: 1,
      date: new Date(2025, 7, 14),
      doctor: "Dr. Ashton Cleve",
      time: "10:00am - 10:30am",
    },
    {
      id: 2,
      date: new Date(2025, 7, 15),
      doctor: "Dr. Ashton Cleve",
      time: "10:00am - 10:30am",
    },
  ];

  const [allAppointments] = useState([
    {
      id: 1,
      date: "Thu 15",
      issue: "Fever",
      name: "Stephine Claire",
      time: "09:00am - 09:30am",
      status: "upcoming",
      docs: true,
    },
    {
      id: 2,
      date: "Fri 16",
      issue: "Fever",
      name: "Stephine Claire",
      time: "09:00am - 09:30am",
      status: "upcoming",
      docs: true,
    },
    {
      id: 3,
      date: "Mon 19",
      issue: "Fever",
      name: "Stephine Claire",
      time: "09:00am - 09:30am",
      status: "upcoming",
      docs: false,
    },
    {
      id: 4,
      date: "Mon 02",
      issue: "Cold",
      name: "Stephine Claire",
      time: "09:00am - 09:30am",
      status: "past",
      docs: true,
    },
    {
      id: 5,
      date: "Tue 03",
      issue: "Fever",
      name: "Stephine Claire",
      time: "09:00am - 09:30am",
      status: "past",
      docs: true,
    },
    {
      id: 6,
      date: "Wed 04",
      issue: "Checkup",
      name: "Stephine Claire",
      time: "09:00am - 09:30am",
      status: "cancelled",
      docs: false,
    },
  ]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
    form.resetFields();
  };

  const renderAppointments = (status) => {
    const filtered = allAppointments.filter((appt) => appt.status === status);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((appt) => (
          <Card
            key={appt.id}
            size="small"
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left: Date and Info */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                {/* Date Box */}
                <div
                  style={{
                    background: "#004C91",
                    color: "#fff",
                    width: "50px",
                    borderRadius: "6px",
                    textAlign: "center",
                    padding: "5px 0",
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  {appt.date.split(" ")[0]}
                  <br />
                  <span style={{ fontSize: "16px", fontWeight: 600 }}>
                    {appt.date.split(" ")[1]}
                  </span>
                </div>

                {/* Vertical Divider */}
                <div
                  style={{
                    width: "1px",
                    background: "#E5E7EB",
                    height: "48px",
                    alignSelf: "stretch",
                  }}
                />

                {/* Appointment Info */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    <ClockCircleOutlined style={{ color: "#6B7280" }} />
                    {appt.time}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: "#6B7280",
                    }}
                  >
                    <UserOutlined style={{ color: "#6B7280" }} />
                    {appt.name}
                  </div>
                </div>
              </div>

              {/* Right Actions */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "13px", color: "#6B7280" }}>
                  Issue: {appt.issue}
                </div>
                {appt.docs && (
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#004C91",
                      cursor: "pointer",
                      textDecoration: "underline",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FileTextOutlined /> View Documents
                  </span>
                )}
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  style={{
                    border: "1px solid #E5E7EB",
                    color: "#374151",
                    background: "transparent",
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleCardClick = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    navigate(`/appointments/${appointment.id}`);
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const getMonthDays = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getMonthDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const appointmentDates = appointments.map((a) => a.date.toDateString());

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
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            width: "100%",
          }}
        >
          {/* Left Section - Image Design */}
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <Banner hideButtons={true} />
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Tabs defaultActiveKey="upcoming" onChange={handleTabChange}>
                  <Tabs.TabPane tab="Upcoming" key="upcoming" />
                  <Tabs.TabPane tab="Past" key="past" />
                  <Tabs.TabPane tab="Cancelled" key="cancelled" />
                </Tabs>

                <div style={{ display: "flex", gap: "10px" }}>
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    size="middle"
                    style={{ width: 130 }}
                  >
                    <Select.Option value="Aug 2025">Aug 2025</Select.Option>
                    <Select.Option value="Jul 2025">Jul 2025</Select.Option>
                    <Select.Option value="Jun 2025">Jun 2025</Select.Option>
                  </Select>

                  <Primarybtn
                    name="New Appointment"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
              </div>

              {renderAppointments(activeTab)}
            </div>
          </div>

          {/* Right Section - Appointments Calendar and Cards */}
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                background: "#fff",
                width: "300px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#1B1B1B",
                  }}
                >
                  Upcoming Appointments
                </p>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#B38C1D",
                    cursor: "pointer",
                  }}
                >
                  View All
                </span>
              </div>

              <div
                style={{
                  borderTop: "1px solid #E5E7EB",
                  marginBottom: "8px",
                }}
              />

              {/* Month Row */}
              <div
                style={{
                  background: "#E8F0EA",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={handlePrevMonth}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ‹
                  </button>
                  {formatMonthYear(currentMonth)}
                  <button
                    onClick={handleNextMonth}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ›
                  </button>
                </span>

                <span
                  style={{ cursor: "pointer", fontSize: "18px" }}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {showCalendar ? (
                    <UpOutlined style={{ fontSize: 14 }} />
                  ) : (
                    <DownOutlined style={{ fontSize: 14 }} />
                  )}
                </span>
              </div>

              {/* Calendar */}
              {showCalendar && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    marginTop: "-15px",
                    textAlign: "center",
                    fontSize: "12px",
                    padding: "10px 10px ",
                    borderBottomRightRadius: 8,
                    borderBottomLeftRadius: 8,
                    background: "#007F5F14",
                  }}
                >
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} style={{ fontWeight: 600 }}>
                      {d}
                    </div>
                  ))}
                  {monthDays.map((day) => {
                    const isAppointment = appointmentDates.includes(
                      day.toDateString()
                    );
                    return (
                      <div
                        key={day.toISOString()}
                        style={{
                          padding: "4px 0",
                          borderRadius: "6px",
                          textAlign: "center",
                          background: isAppointment
                            ? "linear-gradient(180deg, #B78520, #F0C330)"
                            : "transparent",
                          color: isAppointment ? "white" : "inherit",
                          fontWeight: isAppointment ? 600 : 400,
                          transition: "background 0.3s ease",
                        }}
                      >
                        {day.getDate()}
                        {isAppointment && (
                          <div
                            style={{
                              width: "5px",
                              height: "5px",
                              background: "#B38C1D",
                              borderRadius: "50%",
                              position: "absolute",
                              bottom: "2px",
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Appointment Cards */}
              {appointments
                .filter(
                  (a) =>
                    a.date.getMonth() === currentMonth.getMonth() &&
                    a.date.getFullYear() === currentMonth.getFullYear()
                )
                .map((appt, index) => {
                  const isSelected =
                    selectedAppointmentId === appt.id ||
                    (selectedAppointmentId === null && index === 0);

                  return (
                    <div
                      key={appt.id}
                      onClick={() => handleCardClick(appt)}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        background: isSelected ? "#004C91" : "#F3F4F6",
                        color: isSelected ? "#fff" : "#000",
                        borderRadius: "8px",
                        padding: "10px",
                        cursor: "pointer",
                        transition:
                          "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "#004E89";
                          e.currentTarget.style.color = "#fff";
                          const dateBox =
                            e.currentTarget.querySelector(".date-box");
                          dateBox.style.background = "#fff";
                          dateBox.style.color = "#00396E";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "#F3F4F6";
                          e.currentTarget.style.color = "#000";
                          const dateBox =
                            e.currentTarget.querySelector(".date-box");
                          // dateBox.style.background = "#FFFFFF";
                          // dateBox.style.color = "#000";
                          dateBox.style.background = "#004C91"; // keep blue for secondary cards
                          dateBox.style.color = "#fff"; // white text on blue
                        }
                      }}
                    >
                      {/* Date Box */}
                      <div
                        className="date-box"
                        style={{
                          background: isSelected ? "#FFFFFF" : "#FFFFFF",
                          color: isSelected ? "#000" : "#000",
                          borderRadius: "6px",
                          width: "45px",
                          textAlign: "center",
                          padding: "5px 0",
                          transition: "background 0.2s ease, color 0.2s ease",
                        }}
                      >
                        <div style={{ fontSize: "13px" }}>
                          {appt.date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 600 }}>
                          {appt.date.getDate()}
                        </div>
                      </div>

                      {/* Appointment Info */}
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 500 }}>
                          {appt.doctor}
                        </div>
                        <div style={{ fontSize: "13px" }}>{appt.time}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="80%"
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: "32px" }}
        closeIcon={<CloseOutlined style={{ fontSize: 20 }} />}
        centered
        title={
          <div>
            <h2
              style={{
                color: "#1B1B1B",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: 15,
              }}
            >
              Book a New Medical Appointment
            </h2>
            <div
              style={{
                width: "auto",
                background: "#E5E7EB",
                height: "1px",
                margin: 0,
              }}
            />
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginTop: -15,
          }}
        >
          <Form.Item
            name="appointmentType"
            label={
              <span style={{ fontWeight: 600, fontSize: "16px" }}>
                Appointment Type
              </span>
            }
          >
            <Select placeholder="Select type">
              <Option value="consultation">Consultation</Option>
              <Option value="followup">Follow-up</Option>
              <Option value="diagnostic">Diagnostic</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Date
              </span>
            }
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="time"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Time
              </span>
            }
          >
            <Select placeholder="Select time">
              <Option value="9am">9:00 AM</Option>
              <Option value="11am">11:00 AM</Option>
              <Option value="2pm">2:00 PM</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="doctor"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Doctor (Optional)
              </span>
            }
          >
            <Select placeholder="Select doctor">
              <Option value="dr_smith">Dr. Smith</Option>
              <Option value="dr_jones">Dr. Jones</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="treatment"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Treatment Performed
              </span>
            }
          >
            <Input placeholder="Describe treatment" />
          </Form.Item>

          <Form.Item
            name="labReport"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Lab Report
              </span>
            }
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload
              name="labReport"
              beforeUpload={() => false}
              onChange={handleFileChange}
              maxCount={1}
              style={{ width: "100%" }}
            >
              <Button icon={<UploadOutlined />} block style={{ width: "100%" }}>
                Upload
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="notes"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Care Taker Notes
              </span>
            }
            style={{ gridColumn: "1 / 4" }}
          >
            <Input.TextArea placeholder="Enter notes" rows={4} />
          </Form.Item>

          <div
            style={{
              gridColumn: "1 / 4",
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
              gap: 20,
            }}
          >
            <SecondaryBtn name="cancel" onClick={() => setIsModalOpen(false)} />
            <Primarybtn name="Book Appointment" onClick={() => form.submit()} />
          </div>
        </Form>
      </Modal>
      <Modal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={null}
        centered
        title={
          <div style={{ textAlign: "center" }}>
            <img
              src={Success}
              alt="Success"
              style={{ width: 60, height: 60, marginBottom: 16 }}
            />

            <h2
              style={{
                color: "#007F5F",
                fontSize: "20px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Appointment Booked Successfully
            </h2>
          </div>
        }
      >
        <p
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#2E2E2E",
            textAlign: "center",
          }}
        >
          Your appointment with Dr. Paul Ekom is scheduled for Aug 20, 2025 at
          10:00 AM. You will receive reminders 24 hours and 1 hour before your
          visit.
        </p>
      </Modal>
    </div>
  );
}
