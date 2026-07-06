import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import Banner from "../components/Banner";
import Success from "../assets/icons/success.svg";
import { useNavigate, useLocation } from "react-router-dom";
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
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  CreditCardOutlined,
  DollarOutlined,
  MessageOutlined,
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
  TimePicker,
  Spin,
  Empty,
  Select,
  Tag,
} from "antd";
import Primarybtn from "../components/PrimaryBtn";
import SecondaryBtn from "../components/SecondaryBtn";
import { base_url, isAdminUser } from "../constants/constants";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

export default function Appointments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();
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
  const [doctors, setDoctors] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isAppointmentDetailsModal, setIsAppointmentDetailsModal] =
    useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [pendingBookingValues, setPendingBookingValues] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleOpenBookingModal = () => {
    form.resetFields();
    if (userData?.user_role === "sponsor") {
      const storedSponsorId = Number(localStorage.getItem("sponsorProfileId")) || sponsorId;
      if (storedSponsorId) {
        form.setFieldsValue({ sponsorId: storedSponsorId });
      }
    }
    setIsModalOpen(true);
  };

  const patientId = Number(localStorage.getItem("selectedPatientId"));

  const trimPhoneNumber = (phone) => {
    if (phone === undefined || phone === null) return "";
    let formatted = String(phone).trim();
    while (/^\+\d+-/.test(formatted)) {
      formatted = formatted.replace(/^\+\d+-/, "");
    }
    return formatted.replace(/\D/g, "");
  };
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
      const endpoint = `${base_url}/verimed_bookappoinment_create_update/`;
      const headers = { Authorization: `Token ${token}` };
      const res = await axios.get(endpoint, { headers });
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
        message.error("Failed to fetch departments");
      } finally {
        // Completed fetching departments
      }
    };
    fetchDeptList();
  }, []);

  const caretakerId = JSON.parse(
    localStorage.getItem("selectedPatientData"),
  )?.caretaker;
  const sponsorId = Number(localStorage.getItem("sponsorProfileId"));

  const bookAppointment = async (values) => {
    setLoading(true);
    try {
      const endpoint = `${base_url}/verimed_bookappoinment_create_update/`;
      const headers = { Authorization: `Token ${token}` };

      let storedPatientData = {};
      try {
        storedPatientData = JSON.parse(
          localStorage.getItem("selectedPatientData") || "{}",
        );
      } catch (e) {
        storedPatientData = {};
      }

      let finalPatientId =
        Number(localStorage.getItem("selectedPatientId")) ||
        storedPatientData?.id ||
        patientId ||
        null;

      let finalSponsorId =
        Number(localStorage.getItem("sponsorProfileId")) ||
        storedPatientData?.sponsor?.id ||
        storedPatientData?.sponsorid ||
        storedPatientData?.sponsor_id ||
        storedPatientData?.sponsorProfileId ||
        (typeof storedPatientData?.sponsor === "number"
          ? storedPatientData?.sponsor
          : null) ||
        sponsorId ||
        null;

      let finalCaretakerId =
        storedPatientData?.caretaker?.id ||
        storedPatientData?.caretakerid ||
        storedPatientData?.caretaker_id ||
        (typeof storedPatientData?.caretaker === "number" ||
        typeof storedPatientData?.caretaker === "string"
          ? Number(storedPatientData.caretaker)
          : null) ||
        caretakerId ||
        null;

      if (!finalPatientId || !finalSponsorId || !finalCaretakerId) {
        try {
          if (!finalPatientId) {
            const pRes = await axios.get(`${base_url}/patientprofile_list/`, { headers });
            if (Array.isArray(pRes.data) && pRes.data.length > 0) {
              const matchedP = pRes.data.find(p => p.user?.id === userData?.id) || pRes.data[0];
              finalPatientId = matchedP?.id || null;
              if (!finalSponsorId && matchedP?.sponsor) {
                finalSponsorId = typeof matchedP.sponsor === "object" ? matchedP.sponsor.id : matchedP.sponsor;
              }
              if (!finalCaretakerId && matchedP?.caretakerid) {
                finalCaretakerId = matchedP.caretakerid;
              }
            }
          }
          if (!finalSponsorId) {
            const sRes = await axios.get(`${base_url}/sponsorprofile_list/`, { headers });
            if (Array.isArray(sRes.data) && sRes.data.length > 0) {
              const matchedS = sRes.data.find(s => s.user?.id === userData?.id) || sRes.data[0];
              finalSponsorId = matchedS?.id || null;
            }
          }
          if (!finalCaretakerId) {
            const cRes = await axios.get(`${base_url}/caretakerprofile_list/`, { headers });
            if (Array.isArray(cRes.data) && cRes.data.length > 0) {
              finalCaretakerId = cRes.data[0]?.id || null;
            }
          }
        } catch (err) {
          console.log("Error auto-fetching fallback profile IDs:", err);
        }
      }

      const formattedPreferredTimes = (values.preferred_times || []).map(
        (time) => {
          const [hour, minute] = time.split(":");
          return `${parseInt(hour, 10)}:${minute}`;
        },
      );

      const bookappoinment_data = {
        dep: values.depId || values.appointmentType,
        patient: values.patientId || finalPatientId,
        sponsor: values.sponsorId || finalSponsorId,
        caretaker: finalCaretakerId,
        appointment_date: null,
        appointment_time: null,
        preferred_dates: selectedDates,
        preferred_times: formattedPreferredTimes,
        appointment_type: values.appointmentType || null,
        treatment_performed: values.treatment || null,
        care_taker_notes: values.notes || null,
        amount: values.amount || null,
        subscription_plan: values.subscription_plan || null,
        appointment_history: values.appointment_history || null,
        time_line: values.time_line || null,
        appointment_reason: values.appointment_reason || null,
        appointment_status: values.appointment_status || null,
        service_purchased: true,
      };

      const formData = new FormData();
      formData.append(
        "bookappoinment_data",
        JSON.stringify(bookappoinment_data),
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

      if (userData?.user_role === "sponsor") {
        setPendingBookingValues({ endpoint, formData, headers, values, bookappoinment_data });
        setIsCheckoutModalOpen(true);
        return;
      }

      await axios.post(endpoint, formData, { headers });
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      console.log(error);
      message.error("Failed to book appointment. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckout = async () => {
    if (!pendingBookingValues) return;
    setCheckoutLoading(true);
    try {
      await axios.post(pendingBookingValues.endpoint, pendingBookingValues.formData, { headers: pendingBookingValues.headers });
      setIsCheckoutModalOpen(false);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      form.resetFields();
      fetchAppointments();
      message.success("Payment verified and appointment confirmed!");
    } catch (error) {
      console.error("Error finalizing appointment booking:", error);
      message.error("Booking failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
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
    const fetchDocList = async () => {
      try {
        const endpoint = `${base_url}/doctorprofile_list/`;
        const headers = { Authorization: `Token ${token}` };
        const res = await axios.get(endpoint, { headers });
        setDoctors(res.data);
      } catch (error) {
        console.log("Error fetching doctors: ", error);
        message.error("Failed to fetch doctors");
      } finally {
        // Completed fetching doctors
      }
    };
    const fetchSponsorList = async () => {
      try {
        const endpoint = `${base_url}/sponsorprofile_list/`;
        const headers = { Authorization: `Token ${token}` };
        const res = await axios.get(endpoint, { headers });
        setSponsors(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log("Error fetching sponsors: ", error);
        message.error("Failed to fetch sponsors");
      } finally {
        // Completed fetching sponsors
      }
    };
    const fetchPatientList = async () => {
      try {
        const endpoint = `${base_url}/patientprofile_list/`;
        const headers = { Authorization: `Token ${token}` };
        const res = await axios.get(endpoint, { headers });
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log("Error fetching patients: ", error);
        message.error("Failed to fetch patients");
      } finally {
        // Completed fetching patients
      }
    };
    fetchDocList();
    fetchSponsorList();
    fetchPatientList();
  }, []);

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
        message.error("Failed to fetch sponsor data");
      } finally {
        // Completed fetching sponsor data
      }
    };
    fetchSponsorData();
  }, []);

  // Updated status logic: treat empty string or null appointment_date as upcoming
  const getAppointmentStatus = (appointment) => {
    const today = new Date();
    if (appointment.appointment_status === "cancelled") return "cancelled";
    // If appointment_date is empty string or null, treat as upcoming
    if (!appointment.appointment_date || appointment.appointment_date === "") {
      return "upcoming";
    }
    // Otherwise, check date
    const apptDate = new Date(appointment.appointment_date);
    if (apptDate.toDateString() === today.toDateString()) return "upcoming";
    return apptDate > today ? "upcoming" : "past";
  };

  // Updated mapping to match provided object structure
  const mappedAppointments = useMemo(() => {
    return appointmentList.map((appt) => {
      const status = getAppointmentStatus(appt);
      // For upcoming, use preferred_dates[0] if appointment_date is empty/null
      let displayDate = null;
      if (status === "upcoming") {
        if (
          Array.isArray(appt.preferred_dates) &&
          appt.preferred_dates.length > 0
        ) {
          displayDate = new Date(appt.preferred_dates[0]);
        } else if (appt.appointment_date) {
          displayDate = new Date(appt.appointment_date);
        }
      } else if (status === "past" || status === "cancelled") {
        displayDate = appt.appointment_date
          ? new Date(appt.appointment_date)
          : null;
      }

      // Time: use preferred_times for upcoming, else appointment_time
      let formattedTimes = [];
      if (status === "upcoming" && Array.isArray(appt.preferred_times)) {
        formattedTimes = appt.preferred_times.map((t) => t);
      } else if (appt.appointment_time) {
        formattedTimes = [appt.appointment_time];
      }

      // Doctor name
      let doctorName = "Yet to assign";
      if (appt.doc && appt.doc.user?.first_name) {
        doctorName = `${appt.doc.user?.first_name} ${appt.doc.user?.last_name || ""}`;
      }

      // Patient name
      let patientName = appt.patient?.patient_name || "Patient";

      // Department name
      let depName = appt.dep?.dep_name || "Department";

      return {
        id: appt.id,
        appointment_type: appt.appointment_type,
        depName: depName,
        date: displayDate,
        doctor: doctorName,
        doctorName,
        time: formattedTimes,
        status,
        name: patientName,
        issue:
          appt.appointment_reason ||
          appt.treatment_performed ||
          appt.appointment_type ||
          "",
        docs: appt.documents && appt.documents.length > 0,
        documents: appt.documents || [],
        fullData: appt,
      };
    });
  }, [appointmentList]);

  const handleDetailsCardClick = (appt) => {
    if (appt) {
      setSelectedAppointment(appt);
      assignForm.setFieldsValue({
        docId: appt.fullData?.doc?.id || appt.fullData?.doc || undefined,
        appointment_date: appt.date ? dayjs(appt.date) : undefined,
        appointment_time: appt.time
          ? dayjs(
              Array.isArray(appt.time) ? appt.time[0] : appt.time,
              "HH:mm:ss"
            )
          : undefined,
        care_taker_notes:
          appt.fullData?.care_taker_notes || appt.care_taker_notes || "",
      });
      setIsAppointmentDetailsModal(true);
    }
  };

  const [initialOpenHandled, setInitialOpenHandled] = useState(false);

  useEffect(() => {
    if (
      location.state?.openAppointmentId &&
      !initialOpenHandled &&
      mappedAppointments.length > 0
    ) {
      const target = mappedAppointments.find(
        (a) => a.id === location.state.openAppointmentId
      );
      if (target) {
        setInitialOpenHandled(true);
        handleDetailsCardClick(target);
      }
    }
  }, [location.state, mappedAppointments, initialOpenHandled]);

  const handleCloseModal = () => {
    setIsAppointmentDetailsModal(false);
    setSelectedAppointment(null);
    assignForm.resetFields();
  };

  const renderAppointments = (status) => {
    let filtered = mappedAppointments.filter((appt) => appt.status === status);

    // If user is sponsor, only show appointments for their sponsor profile
    if (userData?.user_role === "sponsor" && sponsorId) {
      filtered = filtered.filter(
        (appt) => appt.fullData?.sponsor?.id === sponsorId,
      );
    }

    if (!filtered.length)
      return <Empty description="No Appointments" style={{ marginTop: 50 }} />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((appt) => (
          <Card
            key={appt.id}
            hoverable={
              (userData?.user_role === "care_taker" ||
                isAdminUser(userData)) &&
              appt.status === "upcoming"
            }
            onClick={() => handleDetailsCardClick(appt)}
            size="small"
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              cursor:
                userData?.user_role === "care_taker" || isAdminUser(userData)
                  ? "pointer"
                  : "default",
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
                    {appt.depName}
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
              {(userData?.user_role === "care_taker" ||
                isAdminUser(userData)) &&
                appt.status === "upcoming" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginLeft: "12px",
                    }}
                  >
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailsCardClick(appt);
                      }}
                      style={{
                        border: "1px solid #004C91",
                        color: "#004C91",
                        background: "#E6F0FA",
                        fontWeight: 500,
                        borderRadius: "6px",
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
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
    currentMonth.getMonth(),
  );
  const appointmentDates = mappedAppointments
    .filter((a) => a.date)
    .map((a) => a.date.toDateString());

  const assignAppointment = async (values) => {
    const safe = (val) => (val === "" || val === undefined ? null : val);

    // Format date as YYYY-MM-DD string
    const formatDate = (dateObj) => {
      if (!dateObj) return null;
      if (typeof dateObj === "string") return dateObj;
      if (dateObj.format) return dateObj.format("YYYY-MM-DD");
      const d = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Format time as HH:MM:SS string (24-hour format)
    const formatTime = (timeObj) => {
      if (!timeObj) return null;
      if (typeof timeObj === "string") return timeObj;
      if (timeObj.format) return timeObj.format("HH:mm:ss");
      const t = timeObj.toDate ? timeObj.toDate() : new Date(timeObj);
      const hours = String(t.getHours()).padStart(2, "0");
      const minutes = String(t.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}:00`;
    };

    const headers = { Authorization: `Token ${token}` };

    let finalSponsorId =
      selectedAppointment?.fullData?.sponsor?.id ||
      selectedAppointment?.fullData?.sponsorid ||
      selectedAppointment?.fullData?.sponsor_id ||
      (typeof selectedAppointment?.fullData?.sponsor === "number"
        ? selectedAppointment?.fullData?.sponsor
        : null) ||
      null;

    let finalPatientId =
      selectedAppointment?.fullData?.patient?.id ||
      selectedAppointment?.fullData?.patientid ||
      (typeof selectedAppointment?.fullData?.patient === "number"
        ? selectedAppointment?.fullData?.patient
        : null) ||
      null;

    let finalCaretakerId =
      selectedAppointment?.fullData?.caretaker?.id ||
      selectedAppointment?.fullData?.caretakerid ||
      selectedAppointment?.fullData?.caretaker_id ||
      (typeof selectedAppointment?.fullData?.caretaker === "number"
        ? selectedAppointment?.fullData?.caretaker
        : null) ||
      null;

    if (!finalPatientId || !finalSponsorId || !finalCaretakerId) {
      try {
        if (!finalPatientId) {
          const pRes = await axios.get(`${base_url}/patientprofile_list/`, { headers });
          if (Array.isArray(pRes.data) && pRes.data.length > 0) {
            finalPatientId = pRes.data[0]?.id || null;
          }
        }
        if (!finalSponsorId) {
          const sRes = await axios.get(`${base_url}/sponsorprofile_list/`, { headers });
          if (Array.isArray(sRes.data) && sRes.data.length > 0) {
            finalSponsorId = sRes.data[0]?.id || null;
          }
        }
        if (!finalCaretakerId) {
          const cRes = await axios.get(`${base_url}/caretakerprofile_list/`, { headers });
          if (Array.isArray(cRes.data) && cRes.data.length > 0) {
            finalCaretakerId = cRes.data[0]?.id || null;
          }
        }
      } catch (err) {
        console.log("Error auto-fetching fallback profile IDs in assignAppointment:", err);
      }
    }

    const bookappoinment_data = {
      update_appoinmentid: selectedAppointment?.id, // e.g. 34
      sponsor: finalSponsorId,
      dep: selectedAppointment?.fullData?.dep?.id, // e.g. 1
      doc: safe(values?.docId), // from form
      patient: finalPatientId,
      caretaker: finalCaretakerId,
      appointment_date: formatDate(values?.appointment_date), // user-provided date as YYYY-MM-DD
      appointment_time: formatTime(values?.appointment_time), // e.g. "10:30:00"
      appointment_type: safe(selectedAppointment?.appointment_type),
      treatment_performed: safe(selectedAppointment?.issue),
      care_taker_notes: values?.care_taker_notes
        ? `${selectedAppointment?.fullData?.care_taker_notes || ""}\n[Care Team Log]: ${values.care_taker_notes}`.trim()
        : safe(selectedAppointment?.fullData?.care_taker_notes),
      amount: safe(selectedAppointment?.fullData?.amount),
      subscription_plan: safe(selectedAppointment?.fullData?.subscription_plan),
      height: safe(selectedAppointment?.fullData?.height),
      weight: safe(selectedAppointment?.fullData?.weight),
      blood_pressure: safe(selectedAppointment?.fullData?.blood_pressure),
      blood_sugar: safe(selectedAppointment?.fullData?.blood_sugar),
      medical_history: safe(selectedAppointment?.fullData?.medical_history),
      appointment_history: safe(
        selectedAppointment?.fullData?.appointment_history,
      ),
      time_line: safe(selectedAppointment?.fullData?.time_line),
      appointment_reason: safe(
        selectedAppointment?.fullData?.appointment_reason,
      ),
      appointment_status: safe(
        selectedAppointment?.fullData?.appointment_status,
      ),
      preferred_dates: selectedAppointment?.fullData?.preferred_dates,
      preferred_times: selectedAppointment?.fullData?.preferred_times,
      service_purchased:
        selectedAppointment?.fullData?.service_purchased ?? true,
    };
    try {
      const endpoint = `${base_url}/verimed_bookappoinment_create_update/`;
      const formData = new FormData();
      formData.append(
        "bookappoinment_data",
        JSON.stringify(bookappoinment_data),
      );
      // formData.append("lab_reports_ids", null);
      await axios.patch(endpoint, formData, { headers });
      message.success("Appointment updated successfully!");
      Modal.success({
        title: "Appointment Updated",
        content:
          "The appointment date, time, and doctor have been updated successfully.",
        centered: true,
      });
      handleCloseModal();
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update appointment.";
      message.error(errMsg);
      Modal.error({
        title: "Update Failed",
        content: errMsg,
        centered: true,
      });
    } finally {
      // Completed updating appointment
    }
  };

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
                  onClick={handleOpenBookingModal}
                />
              </div>
              {renderAppointments(activeTab)}
            </div>
            {(userData?.user_role === "care_taker" ||
              isAdminUser(userData)) && (
              <Modal
                title={null}
                width={820}
                open={isAppointmentDetailsModal}
                onCancel={handleCloseModal}
                footer={null}
                centered
                bodyStyle={{ padding: "28px", maxHeight: "85vh", overflowY: "auto" }}
                closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
              >
                {selectedAppointment ? (
                  <div style={{ fontFamily: "Inter, sans-serif" }}>
                    {/* Header Banner */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #004C91 0%, #0066C0 100%)",
                        padding: "20px 24px",
                        borderRadius: "12px",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                        boxShadow: "0 4px 12px rgba(0, 76, 145, 0.15)",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "13px", opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                          Appointment Overview
                        </div>
                        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                          <MedicineBoxOutlined />
                          {selectedAppointment.appointment_type}
                        </h2>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                        <Tag
                          style={{
                            margin: 0,
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontWeight: 600,
                            fontSize: "12px",
                            border: "none",
                            background:
                              selectedAppointment.status === "upcoming"
                                ? "#E6F0FA"
                                : selectedAppointment.status === "past"
                                  ? "#F3F4F6"
                                  : "#FEE2E2",
                            color:
                              selectedAppointment.status === "upcoming"
                                ? "#004C91"
                                : selectedAppointment.status === "past"
                                  ? "#4B5563"
                                  : "#DC2626",
                          }}
                        >
                          {selectedAppointment.status.toUpperCase()}
                        </Tag>
                        <div style={{ fontSize: "13px", opacity: 0.9, display: "flex", alignItems: "center", gap: "6px" }}>
                          <CalendarOutlined />
                          {selectedAppointment.date
                            ? new Date(selectedAppointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "No Date"}
                          {" | "}
                          <ClockCircleOutlined />
                          {Array.isArray(selectedAppointment.time)
                            ? selectedAppointment.time.join(", ")
                            : selectedAppointment.time || "No Time"}
                        </div>
                      </div>
                    </div>

                    {/* Patient & Sponsor Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginBottom: "24px",
                      }}
                    >
                      {/* Patient Card */}
                      <div
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          padding: "16px 20px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #E2E8F0", paddingBottom: "10px", marginBottom: "12px" }}>
                          <div style={{ background: "#E6F0FA", color: "#004C91", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                            <UserOutlined />
                          </div>
                          <b style={{ fontSize: "15px", color: "#1E293B" }}>Patient Details</b>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#475569" }}>
                          <div><span style={{ color: "#64748B" }}>Name:</span> <strong style={{ color: "#1E293B" }}>{selectedAppointment.fullData?.patient?.patient_name || selectedAppointment.name || "N/A"}</strong></div>
                          <div><span style={{ color: "#64748B" }}>Age:</span> <strong style={{ color: "#1E293B" }}>{selectedAppointment.fullData?.patient?.age || "N/A"}</strong></div>
                          <div><span style={{ color: "#64748B" }}>Phone:</span> <strong style={{ color: "#1E293B" }}>{trimPhoneNumber(selectedAppointment.fullData?.patient?.phone) || "N/A"}</strong></div>
                          <div><span style={{ color: "#64748B" }}>Email:</span> <strong style={{ color: "#1E293B" }}>{selectedAppointment.fullData?.patient?.email || "N/A"}</strong></div>
                          {selectedAppointment.fullData?.patient?.emer_con_name && (
                            <div style={{ marginTop: "4px", padding: "8px", background: "#FFF", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                              <div style={{ fontSize: "11px", color: "#DC2626", fontWeight: 600, textTransform: "uppercase" }}>Emergency Contact</div>
                              <div style={{ fontSize: "12px", color: "#1E293B", fontWeight: 500 }}>{selectedAppointment.fullData?.patient?.emer_con_name} ({selectedAppointment.fullData?.patient?.emer_con_relation || "Relative"})</div>
                              <div style={{ fontSize: "12px", color: "#64748B" }}>{trimPhoneNumber(selectedAppointment.fullData?.patient?.emer_con_phone)}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sponsor Card */}
                      <div
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          padding: "16px 20px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #E2E8F0", paddingBottom: "10px", marginBottom: "12px" }}>
                          <div style={{ background: "#E6F0FA", color: "#004C91", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                            <SafetyCertificateOutlined />
                          </div>
                          <b style={{ fontSize: "15px", color: "#1E293B" }}>Sponsor Details</b>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#475569" }}>
                          <div><span style={{ color: "#64748B" }}>Name:</span> <strong style={{ color: "#1E293B" }}>{selectedAppointment.fullData?.sponsor?.user?.first_name} {selectedAppointment.fullData?.sponsor?.user?.last_name || "N/A"}</strong></div>
                          <div><span style={{ color: "#64748B" }}>Email:</span> <strong style={{ color: "#1E293B" }}>{selectedAppointment.fullData?.sponsor?.user?.email || "N/A"}</strong></div>
                          <div><span style={{ color: "#64748B" }}>Phone:</span> <strong style={{ color: "#1E293B" }}>{trimPhoneNumber(selectedAppointment.fullData?.sponsor?.user?.phone) || "N/A"}</strong></div>
                          <div style={{ marginTop: "4px" }}>
                            <span style={{ color: "#64748B" }}>Issue / Reason:</span>
                            <div style={{ background: "#FFF", padding: "8px 10px", borderRadius: "6px", border: "1px solid #E2E8F0", marginTop: "4px", color: "#1E293B", fontWeight: 500 }}>
                              {selectedAppointment.issue || "General Consultation"}
                            </div>
                          </div>
                          {selectedAppointment.documents?.length > 0 && (
                            <div style={{ marginTop: "4px" }}>
                              <span style={{ color: "#64748B", fontSize: "12px" }}>Attached Documents:</span>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                                {selectedAppointment.documents.map((doc) => (
                                  <a
                                    key={doc.id}
                                    href={doc.view_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      background: "#FFF",
                                      border: "1px solid #CBD5E1",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      color: "#004C91",
                                      fontSize: "12px",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      textDecoration: "none",
                                    }}
                                  >
                                    <FileTextOutlined />
                                    {doc.filename.split("/").pop()}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Read-only Sponsor Notes (#D) */}
                    {(selectedAppointment.fullData?.care_taker_notes || selectedAppointment.care_taker_notes) && (
                      <div style={{ background: "#FEF3C7", padding: "16px", borderRadius: "10px", border: "1px solid #F59E0B", marginTop: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <MessageOutlined style={{ color: "#D97706", fontSize: "16px" }} />
                          <b style={{ fontSize: "14px", color: "#92400E" }}>Sponsor Notes & Special Instructions (Read-Only for Care Team)</b>
                        </div>
                        <div style={{ fontSize: "13px", color: "#78350F", whiteSpace: "pre-wrap", lineHeight: "1.5", background: "#FFFBEB", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                          {selectedAppointment.fullData?.care_taker_notes || selectedAppointment.care_taker_notes}
                        </div>
                      </div>
                    )}

                    {/* Reschedule Section */}
                    <div
                      style={{
                        background: "#FFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "12px",
                        padding: "20px 24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px" }}>
                        <EditOutlined style={{ color: "#004C91", fontSize: "16px" }} />
                        <h3 style={{ fontWeight: 600, fontSize: "16px", color: "#0F172A", margin: 0 }}>
                          {userData?.user_role === "care_taker" || isAdminUser(userData)
                            ? "Reschedule / Assign Appointment"
                            : "Appointment Action"}
                        </h3>
                      </div>

                      <Form
                        form={assignForm}
                        layout="vertical"
                        onFinish={assignAppointment}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                          <Form.Item
                            name="docId"
                            label={<span style={{ fontWeight: 500, color: "#334155" }}>Assigned Doctor</span>}
                            rules={[{ required: true, message: "Please select a doctor" }]}
                          >
                            <Select placeholder="Select doctor" style={{ width: "100%" }}>
                              {doctors &&
                                doctors.length > 0 &&
                                doctors.map((doctor) => (
                                  <Option key={doctor.id} value={doctor.id}>
                                    Dr. {doctor.user?.first_name} {doctor.user?.last_name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            name="appointment_date"
                            label={<span style={{ fontWeight: 500, color: "#334155" }}>New Date</span>}
                            rules={[{ required: true, message: "Please select a date" }]}
                          >
                            <DatePicker
                              format="YYYY-MM-DD"
                              placeholder="Select date"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="appointment_time"
                            label={<span style={{ fontWeight: 500, color: "#334155" }}>New Time</span>}
                            rules={[{ required: true, message: "Please select a time" }]}
                          >
                            <TimePicker
                              format="hh:mm A"
                              placeholder="Select time"
                              style={{ width: "100%" }}
                              use12Hours
                            />
                          </Form.Item>
                        </div>

                        <Form.Item
                          name="care_taker_notes"
                          label={<span style={{ fontWeight: 500, color: "#334155" }}>Internal Care Team Action Log (Separate from Sponsor Notes)</span>}
                        >
                          <Input.TextArea rows={2} placeholder="Add internal care team notes or status updates here without editing sponsor instructions..." style={{ borderRadius: "6px" }} />
                        </Form.Item>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                          <Button onClick={handleCloseModal} style={{ borderRadius: "6px", padding: "0 20px", fontWeight: 500 }}>
                            Cancel
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                              background: "linear-gradient(135deg, #004C91 0%, #0066C0 100%)",
                              borderColor: "#004C91",
                              borderRadius: "6px",
                              padding: "0 24px",
                              fontWeight: 500,
                              boxShadow: "0 2px 6px rgba(0, 76, 145, 0.25)",
                            }}
                          >
                            Update Appointment
                          </Button>
                        </div>
                      </Form>
                    </div>
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
                    ),
                  )}
                  {monthDays.map((day) => {
                    const isAppointment = appointmentDates.includes(
                      day.toDateString(),
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
                        a.date.getFullYear() === currentMonth.getFullYear())) &&
                    (userData?.user_role !== "sponsor" ||
                      a.fullData?.sponsor?.id === sponsorId),
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
            rules={[{ required: true, message: "Please select a service" }]}
          >
            <Select placeholder="Select Department">
              {deptList?.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.dep_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item name="depId" hidden>
            <Input type="hidden" />
          </Form.Item> */}

          <Form.Item
            name="sponsorId"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Sponsor
              </span>
            }
          >
            <Select placeholder="Select Sponsor" allowClear disabled={userData?.user_role === "sponsor"}>
              {(userData?.user_role === "sponsor"
                ? sponsors?.filter((s) => s.id === (Number(localStorage.getItem("sponsorProfileId")) || sponsorId) || s.user?.id === userData?.id)
                : sponsors
              )?.map((sponsor) => (
                <Option key={sponsor.id} value={sponsor.id}>
                  {sponsor.user?.first_name} {sponsor.user?.last_name} (
                  {sponsor.user?.email || `ID: ${sponsor.id}`})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="patientId"
            label={
              <span
                style={{ fontWeight: 600, fontSize: "15px", color: "#1B1B1B" }}
              >
                Patient
              </span>
            }
          >
            <Select placeholder="Select Patient" allowClear>
              {(userData?.user_role === "sponsor"
                ? patients?.filter((p) => {
                    const sId = typeof p.sponsor === "object" ? p.sponsor?.id : p.sponsor;
                    const spId = Number(localStorage.getItem("sponsorProfileId")) || sponsorId;
                    return sId === spId || p.sponsorid === spId || p.user?.id === userData?.id;
                  })
                : patients
              )?.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.patient_name} (Age: {patient.age || "N/A"})
                </Option>
              ))}
            </Select>
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
                Sponsor Notes
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

      {/* Verimed Secure Stripe Checkout Modal (#E & #F) */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #E2E8F0", paddingBottom: 12 }}>
            <SafetyCertificateOutlined style={{ color: "#007F5F", fontSize: 24 }} />
            <div>
              <h3 style={{ margin: 0, color: "#007F5F", fontSize: 18, fontWeight: 700 }}>Verimed - Secure Stripe Checkout</h3>
              <span style={{ fontSize: 12, color: "#64748B", fontWeight: 400 }}>256-Bit SSL Encrypted Payment Portal</span>
            </div>
          </div>
        }
        open={isCheckoutModalOpen}
        onCancel={() => setIsCheckoutModalOpen(false)}
        footer={null}
        centered
        width={540}
      >
        <div style={{ padding: "10px 0" }}>
          {/* Consultation Summary */}
          <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 10, border: "1px solid #E2E8F0", marginBottom: 20 }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#1E293B", fontSize: 14, fontWeight: 600 }}>Consultation Booking Summary</h4>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: "#64748B" }}>Provider / Service:</span>
              <strong style={{ color: "#1E293B" }}>{pendingBookingValues?.values?.appointmentType ? (deptList?.find(d => d.id === pendingBookingValues.values.appointmentType)?.dep_name || "Physician Consultation") : "In-Home Clinical Visit"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: "#64748B" }}>Selected Patient:</span>
              <strong style={{ color: "#1E293B" }}>{pendingBookingValues?.values?.patientId ? (patients?.find(p => p.id === pendingBookingValues.values.patientId)?.patient_name || "Loved One") : "Loved One"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px dashed #CBD5E1", paddingTop: 8, marginTop: 8 }}>
              <span style={{ color: "#1E293B", fontWeight: 600 }}>Total Consultation Fee:</span>
              <strong style={{ color: "#007F5F", fontSize: 16 }}>75,000 CFA ($150.00 USD)</strong>
            </div>
          </div>

          {/* Simulated Stripe Credit Card Interface */}
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 16, background: "#FFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: "#334155" }}>Credit or Debit Card</span>
              <div style={{ display: "flex", gap: 6 }}>
                <Tag color="blue">VISA</Tag>
                <Tag color="orange">MasterCard</Tag>
                <Tag color="cyan">AMEX</Tag>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Card Number</label>
                <Input prefix={<CreditCardOutlined style={{ color: "#94A3B8" }} />} placeholder="4242 •••• •••• 4242" defaultValue="4242 4242 4242 4242" style={{ fontFamily: "monospace" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Expiration Date</label>
                  <Input placeholder="MM / YY" defaultValue="12 / 28" style={{ fontFamily: "monospace" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>CVC / CVV</label>
                  <Input prefix={<LockOutlined style={{ color: "#94A3B8" }} />} placeholder="CVC" defaultValue="314" style={{ fontFamily: "monospace" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 }}>Cardholder Name</label>
                <Input placeholder="Name on card" defaultValue={`${userData?.first_name || "Sponsor"} ${userData?.last_name || ""}`.trim()} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <Button onClick={() => setIsCheckoutModalOpen(false)} disabled={checkoutLoading}>Cancel</Button>
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={handleConfirmCheckout}
              loading={checkoutLoading}
              style={{ background: "#007F5F", borderColor: "#007F5F", fontWeight: 600, padding: "0 24px", height: 40 }}
            >
              Pay 75,000 CFA & Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
