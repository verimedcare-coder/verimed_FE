import React, { useEffect, useMemo, useState } from "react";
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
  BookOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  Tabs,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Upload,
  message,
  DatePicker,
  Spin,
  Empty,
  Select,
  Tag,
} from "antd";
import Primarybtn from "../components/PrimaryBtn";
import SecondaryBtn from "../components/SecondaryBtn";
import { base_url } from "../constants/constants";
import axios from "axios";

const { Option } = Select;

export default function Appointments() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const today = new Date();
  const defaultMonth = today.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [currentMonth, setCurrentMonth] = useState(today);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [bookedDateTime, setBookedDateTime] = useState(null);
  const [appointmentList, setAppointmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [sponsorUser, setSponsorUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAppointmentDetailsModal, setIsAppointmentDetailsModal] =
    useState(false);

  const patientId = localStorage.getItem("sponsorPatientIds");

  const cleanedPatientId = Number(patientId?.replace(/[\[\]]/g, ""));

  const handleDateSelect = (date) => {
    if (!date) return;
    const formatted = date.format("YYYY-MM-DD");
    if (!selectedDates.includes(formatted)) {
      setSelectedDates([...selectedDates, formatted]);
    }
  };

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const endpoint = `${base_url}/vb_patientappoinment_list/`;
      const headers = { Authorization: `Token ${token}` };
      const payload = { patientprofileid: cleanedPatientId };
      const res = await axios.post(endpoint, payload, { headers });
      setAppointmentList(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchDeptList = async () => {
      try {
        const endpoint = `${base_url}/verimed_department_create_update/`;
        const headers = {
          Authorization: `Token ${token}`,
        };
        const res = await axios.get(endpoint, { headers });
        setDeptList(res.data);
      } catch (error) {
        console.log("Error fetching departments: ", error);
      }
    };
    fetchDeptList();
  }, []);

  const bookAppointment = async (values) => {
    setLoading(true);
    try {
      const endpoint = `${base_url}/verimed_bookappoinment_create_update/`;
      const headers = { Authorization: `Token ${token}` };

      const formattedPreferredTimes = (values.preferred_times || []).map(
        (time) => {
          const [hour, minute] = time.split(":");
          return `${parseInt(hour, 10)}:${minute}`;
        }
      );

      const bookappoinment_data = {
        dep: values.depId,
        patient: cleanedPatientId,
        caretaker: 1,
        appointment_date: null,
        appointment_time: null,
        preferred_dates: selectedDates,
        preferred_times: formattedPreferredTimes,
        appointment_type: values.appointmentType || null,
        treatment_performed: values.treatment || null,
        care_taker_notes: values.notes || null,
        amount: values.amount || null,
        subscription_plan: values.subscription_plan || null,
        height: values.height || null,
        weight: values.weight || null,
        blood_pressure: values.blood_pressure || null,
        blood_sugar: values.blood_sugar || null,
        medical_history: values.medical_history || null,
        appointment_history: values.appointment_history || null,
        time_line: values.time_line || null,
        appointment_reason: values.appointment_reason || null,
        appointment_status: values.appointment_status || null,
      };

      const formData = new FormData();
      formData.append(
        "bookappoinment_data",
        JSON.stringify(bookappoinment_data)
      );

      if (values.labReport && values.labReport.length > 0) {
        values.labReport.forEach((fileObj) => {
          formData.append("lab_reports", fileObj.originFileObj);
        });
      }

      const formattedDate = values.date
        ? values.date.format("MMM DD, YYYY")
        : "";
      const formattedTime = values.time
        ? `${values.time.slice(0, 5)} ${
            parseInt(values.time.slice(0, 2), 10) < 12 ? "AM" : "PM"
          }`
        : "";
      setBookedDateTime({ date: formattedDate, time: formattedTime });

      await axios.post(endpoint, formData, { headers });
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => setActiveTab(key);
  const handleMonthChange = (value) => setSelectedMonth(value);

  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        const endpoint = `${base_url}/user_view/`;
        const headers = { Authorization: `Token ${token}` };
        const res = await axios.get(endpoint, { headers });
        const sponsorData = res.data;
        setSponsorUser(sponsorData);
      } catch (error) {
        console.log("Error fetching sponsor data: ", error);
      }
    };
    fetchSponsorData();
  }, []);

  const getAppointmentStatus = (appointment) => {
    const today = new Date();

    if (appointment.appointment_status === "cancelled") return "cancelled";

    if (appointment.appointment_date) {
      const apptDate = new Date(appointment.appointment_date);
      if (apptDate.toDateString() === today.toDateString()) return "upcoming";
      return apptDate > today ? "upcoming" : "past";
    }

    if (
      Array.isArray(appointment.preferred_dates) &&
      appointment.preferred_dates.length > 0
    ) {
      const firstPreferred = new Date(appointment.preferred_dates[0]);
      return firstPreferred >= today ? "upcoming" : "past";
    }

    return "upcoming";
  };

  const mappedAppointments = useMemo(() => {
    return appointmentList.map((appt) => {
      const sponsor = sponsorUser?.find((s) => s.id === appt.sponsor?.user);
      const status = getAppointmentStatus(appt);

      let displayDate = null;
      if (
        status === "upcoming" &&
        Array.isArray(appt.preferred_dates) &&
        appt.preferred_dates.length > 0
      ) {
        displayDate = new Date(appt.preferred_dates[0]);
      } else if (status === "past" || status === "cancelled") {
        displayDate = appt.appointment_date
          ? new Date(appt.appointment_date)
          : null;
      }

      let formattedTimes = [];
      if (Array.isArray(appt.appointment_time)) {
        formattedTimes = appt.appointment_time.map((t) =>
          new Date(`1970-01-01T${t}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } else if (appt.appointment_time) {
        formattedTimes = [
          new Date(`1970-01-01T${appt.appointment_time}`).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        ];
      }

      return {
        id: appt.id,
        appointment_type: appt.appointment_type,
        date: displayDate,
        doctor: appt.doc?.doctor_id ? `Dr. ${appt.doc.doctor_id}` : "Doctor",
        doctorName: appt.doc?.doctor_id
          ? `Dr. ${appt.doc.doctor_id}`
          : "Doctor",
        time: formattedTimes,
        status,
        name: appt.patient?.patient_id
          ? `Sponsor: ${
              sponsor
                ? `${sponsor.first_name || ""} ${sponsor.last_name || ""}`
                : "N/A"
            } - Patient: ${
              appt.patient?.user
                ? `${appt.patient.user.first_name || ""} ${
                    appt.patient.user.last_name || ""
                  }`
                : "Unknown"
            }`
          : "Patient",
        issue: appt.appointment_reason || appt.appointment_type || "",
        docs: appt.documents && appt.documents.length > 0,
        documents: appt.documents || [],
      };
    });
  }, [appointmentList, sponsorUser]);

  const handleDetailsCardClick = (appt) => {
    if (userData?.user_role === "care_taker" && appt.status === "upcoming") {
      setSelectedAppointment(appt);
      setIsAppointmentDetailsModal(true);
    }
  };

  const handleCloseModal = () => {
    setIsAppointmentDetailsModal(false);
    setSelectedAppointment(null);
  };

  const renderAppointments = (status) => {
    const filtered = mappedAppointments.filter(
      (appt) => appt.status === status
    );
    if (!filtered.length)
      return <Empty description="No Appointments" style={{ marginTop: 50 }} />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((appt) => (
          <Card
            key={appt.id}
            hoverable={
              userData?.user_role === "care_taker" && appt.status === "upcoming"
            }
            onClick={() => handleDetailsCardClick(appt)}
            size="small"
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              cursor:
                userData?.user_role === "care_taker" ? "pointer" : "default",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
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
                    height: "40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {appt.date ? (
                    <>
                      <div style={{ fontSize: "13px" }}>
                        {appt.date.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        {appt.date.getDate()}
                      </div>
                    </>
                  ) : (
                    <CalendarOutlined style={{ fontSize: "18px" }} />
                  )}
                </div>
                <div
                  style={{
                    width: "1px",
                    background: "#E5E7EB",
                    height: "48px",
                    alignSelf: "stretch",
                  }}
                />
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
                    <BookOutlined style={{ color: "#6B7280" }} />
                    {appt.appointment_type}
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
                      gap: 4,
                      flexDirection: "row",
                    }}
                  >
                    <FileTextOutlined />
                    {appt.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.view_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#004C91",
                          textDecoration: "underline",
                          fontSize: "12px",
                          marginTop: "2px",
                        }}
                      >
                        {doc.filename.split("/").pop()}
                      </a>
                    ))}
                  </span>
                )}
              </div>
              {/* <div
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
              </div> */}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );

  const handleCardClick = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    navigate(`/appointments/${appointment.id}`);
  };

  const formatMonthYear = (date) =>
    date.toLocaleString("default", { month: "short", year: "numeric" });

  const getMonthDays = (year, month) => {
    const days = [];
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
  const appointmentDates = mappedAppointments
    .filter((a) => a.date)
    .map((a) => a.date.toDateString());

  return (
    <div style={{ display: "flex", backgroundColor: "#F7F9FB" }}>
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            width: "100%",
          }}
        >
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
                width: "100%",
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
                <Primarybtn
                  name={
                    userData?.user_role === "sponsor"
                      ? "Request Appointment"
                      : "Book Appointment"
                  }
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
              {renderAppointments(activeTab)}
            </div>
            {/* {userData?.user_role === "care_taker" && (
              <Modal
                title="Appointment Details"
                open={isAppointmentDetailsModal}
                onCancel={handleCloseModal}
                footer={null}
              >
                {selectedAppointment ? (
                  <div>
                    <p>
                      <b>Appointment ID:</b> {selectedAppointment.id}
                    </p>
                  </div>
                ) : (
                  <p>No appointment selected.</p>
                )}
              </Modal>
            )} */}
            {userData?.user_role === "care_taker" && (
              <Modal
                title="Appointment Details"
                width={"auto"}
                open={isAppointmentDetailsModal}
                onCancel={handleCloseModal}
                footer={null}
                centered
              >
                {selectedAppointment ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      columnGap: "20px",
                      rowGap: "12px",
                      fontSize: "15px",
                    }}
                  >
                    {/* <div>
                      <b>Appointment ID:</b> {selectedAppointment.id}
                    </div> */}

                    <div>
                      <b>Appointment Type:</b>{" "}
                      {selectedAppointment.appointment_type}
                    </div>

                    <div>
                      <b>Date:</b>{" "}
                      {selectedAppointment.date
                        ? new Date(
                            selectedAppointment.date
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>

                    <div>
                      <b>Time:</b> {selectedAppointment.time || "N/A"}
                    </div>

                    <div>
                      <b>Doctor:</b> {selectedAppointment.doctorName || "N/A"}
                    </div>

                    <div>
                      <b>Patient:</b> {selectedAppointment.name || "N/A"}
                    </div>

                    <div>
                      <b>Issue/Reason:</b> {selectedAppointment.issue || "N/A"}
                    </div>
                    <div>
                      {" "}
                      <b>Status:</b>{" "}
                      <Tag
                        color={
                          selectedAppointment.status === "upcoming"
                            ? "blue"
                            : selectedAppointment.status === "past"
                            ? "gray"
                            : "red"
                        }
                      >
                        {selectedAppointment.status.toUpperCase()}
                      </Tag>
                    </div>

                    {selectedAppointment.documents?.length > 0 && (
                      <div>
                        <b>Documents:</b>
                        <div style={{ marginTop: "8px", marginLeft: "16px" }}>
                          {selectedAppointment.documents.map((doc) => (
                            <div key={doc.id}>
                              <a
                                href={doc.view_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#004C91",
                                  textDecoration: "underline",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <FileTextOutlined />
                                {doc.filename.split("/").pop()}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>No appointment selected.</p>
                )}
              </Modal>
            )}
          </div>

          {/* Right Section */}
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
              </div>
              <div
                style={{ borderTop: "1px solid #E5E7EB", marginBottom: "8px" }}
              />

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
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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

              {showCalendar && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    marginTop: "-15px",
                    textAlign: "center",
                    fontSize: "12px",
                    padding: "10px 10px",
                    borderBottomRightRadius: 8,
                    borderBottomLeftRadius: 8,
                    background: "#007F5F14",
                    position: "relative",
                  }}
                >
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} style={{ fontWeight: 600 }}>
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: monthDays[0].getDay() }).map(
                    (_, idx) => (
                      <div key={`empty-${idx}`} />
                    )
                  )}
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
                        }}
                      >
                        {day.getDate()}
                      </div>
                    );
                  })}
                </div>
              )}

              {mappedAppointments
                .filter(
                  (a) =>
                    a.status &&
                    (a.status === "upcoming" ||
                      (a.date &&
                        a.date.getMonth() === currentMonth.getMonth() &&
                        a.date.getFullYear() === currentMonth.getFullYear()))
                )
                .map((appt, index) => {
                  const isSelected =
                    selectedAppointmentId === appt.id ||
                    (selectedAppointmentId === null && index === 0);
                  return (
                    <div
                      key={appt.id}
                      // onClick={() => handleCardClick(appt)}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        background: isSelected ? "#004C91" : "#F3F4F6",
                        color: isSelected ? "#fff" : "#000",
                        borderRadius: "8px",
                        padding: "10px",
                        // cursor: "pointer",
                      }}
                    >
                      <div
                        className="date-box"
                        style={{
                          background: "#FFFFFF",
                          color: "#000",
                          borderRadius: "6px",
                          width: "45px",
                          textAlign: "center",
                          padding: "5px 0",
                        }}
                      >
                        {appt.status === "upcoming" ? (
                          appt.date ? (
                            <>
                              <div style={{ fontSize: "13px" }}>
                                {appt.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </div>
                              <div
                                style={{ fontSize: "16px", fontWeight: 600 }}
                              >
                                {appt.date.getDate()}
                              </div>
                            </>
                          ) : (
                            <div
                              style={{
                                background: "#004C91",
                                color: "#fff",
                                borderRadius: "6px",
                                width: "45px",
                                height: "45px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <CalendarOutlined />
                            </div>
                          )
                        ) : (
                          // For past/cancelled → always show date
                          appt.date && (
                            <>
                              <div style={{ fontSize: "13px" }}>
                                {appt.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </div>
                              <div
                                style={{ fontSize: "16px", fontWeight: 600 }}
                              >
                                {appt.date.getDate()}
                              </div>
                            </>
                          )
                        )}
                      </div>

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

      {/* Request Appointment Modal */}
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
              Request a New Medical Appointment
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
          onFinish={bookAppointment}
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
                Request Service
              </span>
            }
          >
            <Select
              placeholder="Select Department"
              onChange={(value, option) => {
                form.setFieldsValue({ depId: option.depId });
              }}
            >
              {deptList?.map((dept) => (
                <Option key={dept.id} value={dept.dep_name} depId={dept.id}>
                  {dept.dep_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="depId" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Preferred Date(s)
              </span>
            }
          >
            <DatePicker onChange={handleDateSelect} />
            <div style={{ marginTop: 8 }}>
              {selectedDates.map((d) => (
                <Tag
                  key={d}
                  closable
                  onClose={() =>
                    setSelectedDates(selectedDates.filter((date) => date !== d))
                  }
                >
                  {d}
                </Tag>
              ))}
            </div>
          </Form.Item>

          <Form.Item
            name="preferred_times"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Preferred Time(s)
              </span>
            }
            rules={[
              { required: true, message: "Please select at least one time" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select time(s)"
              style={{ width: "100%" }}
            >
              {Array.from({ length: 13 }, (_, i) => {
                const hour = 9 + i;
                const value = `${hour.toString().padStart(2, "0")}:00:00`;
                const display =
                  hour < 12
                    ? `${hour}:00 AM`
                    : hour === 12
                    ? "12:00 PM"
                    : `${hour - 12}:00 PM`;
                return (
                  <Option key={value} value={value}>
                    {display}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="treatment"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Pre Existing Conditions
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
            <Primarybtn
              name="Request Appointment"
              type="button"
              onClick={() => form.submit()}
            />
          </div>
        </Form>
      </Modal>

      {/* Request Appointment Success Modal */}
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
                textTransform: "capitalize",
                lineHeight: 1.5,
              }}
            >
              Your Appointment Request Sent Successfully <br />
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
          Our Practice Manager will review your request and get back to you
          shortly.
        </p>
      </Modal>
    </div>
  );
}
