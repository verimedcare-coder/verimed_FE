/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentsService } from "../../services/appointmentsService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import Banner from "../../components/illustrations/Banner";
import Success from "../../assets/icons/success.svg";
import { useNavigate, useLocation } from "react-router-dom";
import StripeCheckoutModal from "../../components/modals/StripeCheckoutModal";
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
import Primarybtn from "../../components/common/PrimaryBtn";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import { base_url, isAdminUser } from "../../constants/constants";
import axios from "axios";
import dayjs from "dayjs";
import * as yup from "yup";

const { Option } = Select;

const bookingValidationSchema = yup.object().shape({
  appointmentType: yup.string().required("Please select a service / department"),
  patientId: yup.mixed().required("Please select a patient"),
  preferred_dates: yup
    .array()
    .min(1, "Please select at least one preferred date")
    .required("Please select at least one preferred date"),
  preferred_times: yup
    .array()
    .min(1, "Please select at least one preferred time")
    .required("Please select at least one preferred time"),
});

const yupRule = (schema, fieldName) => ({
  validator: async (_, value) => {
    try {
      await schema.validateAt(fieldName, { [fieldName]: value });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(new Error(err.message));
    }
  },
});

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
  const queryClient = useQueryClient();
  const [bookedDateTime, setBookedDateTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isAppointmentDetailsModal, setIsAppointmentDetailsModal] =
    useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [pendingBookingValues, setPendingBookingValues] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleOpenBookingModal = () => {
    form.resetFields();
    setSelectedDates([]);
    form.setFieldsValue({ preferred_dates: [] });
    if (userData?.user_role === "sponsor") {
      const storedSponsorId = Number(localStorage.getItem("sponsorProfileId")) || sponsorId;
      if (storedSponsorId) {
        form.setFieldsValue({ sponsorId: storedSponsorId });
      }
    }
    setIsModalOpen(true);
  };

  const [selectedPatientId, setSelectedPatientId] = useState(() =>
    localStorage.getItem("selectedPatientId")
  );

  useEffect(() => {
    const handlePatientChange = () => {
      setSelectedPatientId(localStorage.getItem("selectedPatientId"));
    };
    window.addEventListener("patientChanged", handlePatientChange);
    window.addEventListener("storage", handlePatientChange);
    return () => {
      window.removeEventListener("patientChanged", handlePatientChange);
      window.removeEventListener("storage", handlePatientChange);
    };
  }, []);

  const patientId = Number(selectedPatientId);

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
      const newDates = [...selectedDates, formatted];
      setSelectedDates(newDates);
      form.setFieldsValue({ preferred_dates: newDates });
      form.validateFields(["preferred_dates"]);
    }
  };

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));

  const { data: appointmentList = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const data = await appointmentsService.getAllAppointments();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });

  const { data: deptList = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const data = await appointmentsService.getDepartments();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });

  const caretakerId = JSON.parse(
    localStorage.getItem("selectedPatientData"),
  )?.caretaker;
  const sponsorId = Number(localStorage.getItem("sponsorProfileId"));

  const bookAppointment = async (values) => {
    try {
      await bookingValidationSchema.validate(
        {
          appointmentType: values.appointmentType,
          patientId: values.patientId || selectedPatientId || localStorage.getItem("selectedPatientId"),
          preferred_dates: selectedDates,
          preferred_times: values.preferred_times,
        },
        { abortEarly: false }
      );
    } catch (validationError) {
      message.error(
        validationError.errors ? validationError.errors[0] : "Please check all required fields and try again."
      );
      return;
    }
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
        Number(selectedPatientId || localStorage.getItem("selectedPatientId")) ||
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
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
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
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
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

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const data = await appointmentsService.getDoctors();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });

  const { data: sponsors = [] } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const data = await appointmentsService.getSponsors();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const data = await appointmentsService.getPatients();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });

  // eslint-disable-next-line no-unused-vars
  const { data: sponsorUser = null } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await appointmentsService.getUsers();
      return data;
    },
    enabled: !!token,
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, mappedAppointments, initialOpenHandled]);

  useEffect(() => {
    if (location.state?.openBookingModal) {
      handleOpenBookingModal();
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

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
      return <Empty description="No Appointments" className="mt-[50px]" />;
    return (
      <div className="flex flex-col gap-[12px]">
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
            className={`bg-[#F9FAFB] border border-solid border-[#E5E7EB] rounded-[8px] ${userData?.user_role === "care_taker" || isAdminUser(userData) ? "cursor-pointer" : "cursor-default"}`}
          >
            <div
              className="flex justify-between items-center"
            >
              <div
                className="flex items-center gap-[12px]"
              >
                <div
                  className="bg-[#004C91] text-[#fff] w-[50px] rounded-[6px] text-center py-[5px] px-[0px] font-medium h-[40px] flex flex-col items-center justify-center leading-[1.2]"
                >
                  {appt.date ? (
                    <>
                      <div className="text-[13px]">
                        {appt.date.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-[16px] font-semibold">
                        {appt.date.getDate()}
                      </div>
                    </>
                  ) : (
                    <CalendarOutlined className="text-[18px]" />
                  )}
                </div>
                <div
                  className="w-[1px] bg-[#E5E7EB] h-[48px] self-stretch"
                />
                <div
                  className="flex flex-col gap-[4px]"
                >
                  <div
                    className="flex items-center gap-[6px] text-[14px] font-medium"
                  >
                    <BookOutlined className="text-[#6B7280]" />
                    {appt.depName}
                  </div>
                  <div
                    className="flex items-center gap-[6px] text-[13px] text-[#6B7280]"
                  >
                    <UserOutlined className="text-[#6B7280]" />
                    {appt.name}
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col items-center"
              >
                <div className="text-[13px] text-[#6B7280]">
                  Issue: {appt.issue}
                </div>
                {appt.docs && (
                  <span
                    className="text-[13px] text-[#004C91] cursor-pointer flex items-center gap-[4px] flex-row underline"
                  >
                    <FileTextOutlined />
                    {appt.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.view_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#004C91] text-[12px] mt-[2px] underline"
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
                    className="flex items-center gap-[12px] ml-[12px]"
                  >
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailsCardClick(appt);
                      }}
                      className="border-[1px] border-solid border-[#004C91] text-[#004C91] bg-[#E6F0FA] font-medium rounded-[6px]"
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

  // eslint-disable-next-line no-unused-vars
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
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
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
    <div className="flex bg-[#F7F9FB]">
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(255,255,255,0.7)] z-[9999] flex items-center justify-center">
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-[20px] w-full">
          <div
            className="p-[20px] flex flex-col gap-[20px]"
          >
            <Banner hideButtons={true} />
            <div className="bg-white rounded-[10px] p-[20px] font-sans shadow-[0_1px_3px_rgba(0,0,0,0.08)] mt-[20px] w-full min-w-0">
              <div
                className="flex justify-between items-center mb-[15px]"
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
                closeIcon={<CloseOutlined className="text-[18px]" />}
              >
                {selectedAppointment ? (
                  <div className="font-sans">
                    {/* Header Banner */}
                    <div className="bg-[linear-gradient(135deg,#004C91_0%,#0066C0_100%)] py-[20px] px-[24px] rounded-[12px] text-white flex justify-between items-center mb-[24px] shadow-[0_4px_12px_rgba(0,76,145,0.15)]">
                      <div>
                        <div className="text-[13px] uppercase mb-[4px] opacity-85 tracking-[0.5px]">
                          Appointment Overview
                        </div>
                        <h2 className="text-[#fff] text-[20px] font-semibold m-0 flex items-center gap-[10px]">
                          <MedicineBoxOutlined />
                          {selectedAppointment.appointment_type}
                        </h2>
                      </div>
                      <div className="flex flex-col items-end gap-[6px]">
                        <Tag
                          className={`m-0 py-[4px] px-[12px] rounded-[20px] font-semibold text-[12px] border-none ${selectedAppointment.status === "upcoming" ? "bg-[#E6F0FA] text-[#004C91]" : selectedAppointment.status === "past" ? "bg-[#F3F4F6] text-[#4B5563]" : "bg-[#FEE2E2] text-[#DC2626]"}`}
                        >
                          {selectedAppointment.status.toUpperCase()}
                        </Tag>
                        <div className="text-[13px] flex items-center gap-[6px] opacity-90">
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
                    <div className="grid grid-cols-[1fr_1fr] gap-[20px] mb-[24px]">
                      {/* Patient Card */}
                      <div
                        className="bg-[#F8FAFC] border-[1px] border-solid border-[#E2E8F0] rounded-[10px] py-[16px] px-[20px]"
                      >
                        <div className="flex items-center gap-[8px] pb-[10px] mb-[12px] border-b border-solid border-[#E2E8F0]">
                          <div className="bg-[#E6F0FA] text-[#004C91] w-[28px] h-[28px] rounded-full flex items-center justify-center text-[14px]">
                            <UserOutlined />
                          </div>
                          <b className="text-[15px] text-[#1E293B]">Patient Details</b>
                        </div>
                        <div className="flex flex-col gap-[8px] text-[13px] text-[#475569]">
                          <div><span className="text-[#64748B]">Name:</span> <strong className="text-[#1E293B]">{selectedAppointment.fullData?.patient?.patient_name || selectedAppointment.name || "N/A"}</strong></div>
                          <div><span className="text-[#64748B]">Age:</span> <strong className="text-[#1E293B]">{selectedAppointment.fullData?.patient?.age || "N/A"}</strong></div>
                          <div><span className="text-[#64748B]">Phone:</span> <strong className="text-[#1E293B]">{trimPhoneNumber(selectedAppointment.fullData?.patient?.phone) || "N/A"}</strong></div>
                          <div><span className="text-[#64748B]">Email:</span> <strong className="text-[#1E293B]">{selectedAppointment.fullData?.patient?.email || "N/A"}</strong></div>
                          {selectedAppointment.fullData?.patient?.emer_con_name && (
                            <div className="mt-[4px] p-[8px] bg-[#FFF] rounded-[6px] border-[1px] border-solid border-[#E2E8F0]">
                              <div className="text-[11px] text-[#DC2626] font-semibold uppercase">Emergency Contact</div>
                              <div className="text-[12px] text-[#1E293B] font-medium">{selectedAppointment.fullData?.patient?.emer_con_name} ({selectedAppointment.fullData?.patient?.emer_con_relation || "Relative"})</div>
                              <div className="text-[12px] text-[#64748B]">{trimPhoneNumber(selectedAppointment.fullData?.patient?.emer_con_phone)}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sponsor Card */}
                      <div
                        className="bg-[#F8FAFC] border-[1px] border-solid border-[#E2E8F0] rounded-[10px] py-[16px] px-[20px]"
                      >
                        <div className="flex items-center gap-[8px] pb-[10px] mb-[12px] border-b border-solid border-[#E2E8F0]">
                          <div className="bg-[#E6F0FA] text-[#004C91] w-[28px] h-[28px] rounded-full flex items-center justify-center text-[14px]">
                            <SafetyCertificateOutlined />
                          </div>
                          <b className="text-[15px] text-[#1E293B]">Sponsor Details</b>
                        </div>
                        <div className="flex flex-col gap-[8px] text-[13px] text-[#475569]">
                          <div><span className="text-[#64748B]">Name:</span> <strong className="text-[#1E293B]">{selectedAppointment.fullData?.sponsor?.user?.first_name} {selectedAppointment.fullData?.sponsor?.user?.last_name || "N/A"}</strong></div>
                          <div><span className="text-[#64748B]">Email:</span> <strong className="text-[#1E293B]">{selectedAppointment.fullData?.sponsor?.user?.email || "N/A"}</strong></div>
                          <div><span className="text-[#64748B]">Phone:</span> <strong className="text-[#1E293B]">{trimPhoneNumber(selectedAppointment.fullData?.sponsor?.user?.phone) || "N/A"}</strong></div>
                          <div className="mt-[4px]">
                            <span className="text-[#64748B]">Issue / Reason:</span>
                            <div className="bg-[#FFF] py-[8px] px-[10px] rounded-[6px] border-[1px] border-solid border-[#E2E8F0] mt-[4px] text-[#1E293B] font-medium">
                              {selectedAppointment.issue || "General Consultation"}
                            </div>
                          </div>
                          {selectedAppointment.documents?.length > 0 && (
                            <div className="mt-[4px]">
                              <span className="text-[#64748B] text-[12px]">Attached Documents:</span>
                              <div className="flex flex-wrap gap-[6px] mt-[4px]">
                                {selectedAppointment.documents.map((doc) => (
                                  <a
                                    key={doc.id}
                                    href={doc.view_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#FFF] border-[1px] border-solid border-[#CBD5E1] py-[4px] px-[8px] rounded-[4px] text-[#004C91] text-[12px] flex items-center gap-[4px] no-underline"
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
                      <div className="bg-[#FEF3C7] p-[16px] rounded-[10px] border-[1px] border-solid border-[#F59E0B] mt-[16px]">
                        <div className="flex items-center gap-[8px] mb-[8px]">
                          <MessageOutlined className="text-[#D97706] text-[16px]" />
                          <b className="text-[14px] text-[#92400E]">Sponsor Notes & Special Instructions (Read-Only for Care Team)</b>
                        </div>
                        <div className="text-[13px] text-[#78350F] bg-[#FFFBEB] p-[12px] rounded-[8px] border-[1px] border-solid border-[#FCD34D] whitespace-pre-wrap leading-[1.5]">
                          {selectedAppointment.fullData?.care_taker_notes || selectedAppointment.care_taker_notes}
                        </div>
                      </div>
                    )}

                    {/* Reschedule Section */}
                    <div className="bg-white border border-solid border-[#E2E8F0] rounded-[12px] py-[20px] px-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-[8px] mb-[16px] pb-[12px] border-b border-solid border-[#F1F5F9]">
                        <EditOutlined className="text-[#004C91] text-[16px]" />
                        <h3 className="font-semibold text-[16px] text-[#0F172A] m-0">
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
                        <div className="grid grid-cols-[repeat(3,1fr)] gap-[16px]">
                          <Form.Item
                            name="docId"
                            label={<span className="font-medium text-[#334155]">Assigned Doctor</span>}
                            rules={[{ required: true, message: "Please select a doctor" }]}
                          >
                            <Select placeholder="Select doctor" className="w-full">
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
                            label={<span className="font-medium text-[#334155]">New Date</span>}
                            rules={[{ required: true, message: "Please select a date" }]}
                          >
                            <DatePicker
                              format="YYYY-MM-DD"
                              placeholder="Select date"
                              className="w-full"
                            />
                          </Form.Item>

                          <Form.Item
                            name="appointment_time"
                            label={<span className="font-medium text-[#334155]">New Time</span>}
                            rules={[{ required: true, message: "Please select a time" }]}
                          >
                            <TimePicker
                              format="hh:mm A"
                              placeholder="Select time"
                              className="w-full"
                              use12Hours
                            />
                          </Form.Item>
                        </div>

                        <Form.Item
                          name="care_taker_notes"
                          label={<span className="font-medium text-[#334155]">Internal Care Team Action Log (Separate from Sponsor Notes)</span>}
                        >
                          <Input.TextArea rows={2} placeholder="Add internal care team notes or status updates here without editing sponsor instructions..." className="rounded-[6px]" />
                        </Form.Item>

                        <div className="flex justify-end gap-[12px] mt-[16px]">
                          <Button onClick={handleCloseModal} className="rounded-[6px] py-[0px] px-[20px] font-medium">
                            Cancel
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-[linear-gradient(135deg,#004C91_0%,#0066C0_100%)] border border-solid border-[#004C91] rounded-[6px] px-[24px] font-medium shadow-[0_2px_6px_rgba(0,76,145,0.25)]"
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
            className="p-[20px] flex flex-col"
          >
            <div
              className="bg-white w-[300px] rounded-[10px] border-[1px] border-solid border-[#E5E7EB] p-[20px] flex flex-col gap-[15px] font-sans"
            >
              <div
                className="flex justify-between items-center"
              >
                <p
                  className="text-[16px] font-medium text-[#1B1B1B]"
                >
                  Upcoming Appointments
                </p>
              </div>
              <div className="mb-[8px] border-t border-solid border-[#E5E7EB]" />

              <div
                className="bg-[#E8F0EA] rounded-[6px] py-[6px] px-[10px] text-[14px] flex justify-between items-center"
              >
                <span
                  className="flex items-center gap-[8px]"
                >
                  <button
                    onClick={handlePrevMonth}
                    className="border-none bg-transparent cursor-pointer text-[16px]"
                  >
                    ‹
                  </button>
                  {formatMonthYear(currentMonth)}
                  <button
                    onClick={handleNextMonth}
                    className="border-none bg-transparent cursor-pointer text-[16px]"
                  >
                    ›
                  </button>
                </span>
                <span
                  className="cursor-pointer text-[18px]"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {showCalendar ? (
                    <UpOutlined className="text-[14px]" />
                  ) : (
                    <DownOutlined className="text-[14px]" />
                  )}
                </span>
              </div>

              {showCalendar && (
                <div className="grid grid-cols-[repeat(7,1fr)] gap-[4px] -mt-[15px] text-center text-[12px] p-[10px] rounded-br-[8px] rounded-bl-[8px] bg-[#007F5F14] relative">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="font-semibold">
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
                        className={`py-[4px] px-0 rounded-[6px] text-center ${isAppointment ? "bg-gradient-to-b from-[#B78520] to-[#F0C330] text-white font-semibold" : "bg-transparent text-inherit font-normal"}`}
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
                      className={`flex gap-[10px] items-center rounded-[8px] p-[10px] ${isSelected ? "bg-[#004C91] text-white" : "bg-[#F3F4F6] text-black"}`}
                    >
                      <div
                        className="date-box bg-[#FFFFFF] text-[#000] rounded-[6px] w-[45px] text-center py-[5px] px-[0px]"
                      >
                        {appt.status === "upcoming" ? (
                          appt.date ? (
                            <>
                              <div className="text-[13px]">
                                {appt.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </div>
                              <div
                                className="text-[16px] font-semibold"
                              >
                                {appt.date.getDate()}
                              </div>
                            </>
                          ) : (
                            <div
                              className="bg-[#004C91] text-[#fff] rounded-[6px] w-[45px] h-[45px] flex items-center justify-center"
                            >
                              <CalendarOutlined />
                            </div>
                          )
                        ) : (
                          // For past/cancelled → always show date
                          appt.date && (
                            <>
                              <div className="text-[13px]">
                                {appt.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </div>
                              <div
                                className="text-[16px] font-semibold"
                              >
                                {appt.date.getDate()}
                              </div>
                            </>
                          )
                        )}
                      </div>

                      <div className="grow">
                        <div className="text-[14px] font-medium">
                          {appt.doctor}
                        </div>
                        <div className="text-[13px]">{appt.time}</div>
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
        closeIcon={<CloseOutlined className="text-[20px]" />}
        centered
        title={
          <div>
            <h2
              className="text-[#1B1B1B] text-[18px] font-semibold mb-[15px]"
            >
              Request a New Medical Appointment
            </h2>
            <div
              className="w-auto bg-[#E5E7EB] h-[1px] m-0"
            />
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={bookAppointment}
          className="grid grid-cols-[repeat(3,1fr)] gap-[16px] -mt-[15px]"
        >
          <Form.Item
            name="appointmentType"
            label={
              <span className="font-semibold text-[16px]">
                Request Service
              </span>
            }
            rules={[yupRule(bookingValidationSchema, "appointmentType")]}
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
                className="font-semibold text-[15px] text-[#1B1B1B]"
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
                className="font-semibold text-[15px] text-[#1B1B1B]"
              >
                Patient
              </span>
            }
            rules={[yupRule(bookingValidationSchema, "patientId")]}
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
            name="preferred_dates"
            label={
              <span
                className="font-semibold text-[15px] text-[#1B1B1B]"
              >
                Preferred Date(s)
              </span>
            }
            rules={[yupRule(bookingValidationSchema, "preferred_dates")]}
          >
            <div>
              <DatePicker
                onChange={handleDateSelect}
                status={form.getFieldError("preferred_dates")?.length > 0 ? "error" : ""}
              />
              <div className="mt-[8px]">
                {selectedDates.map((d) => (
                  <Tag
                    key={d}
                    closable
                    onClose={() => {
                      const newDates = selectedDates.filter((date) => date !== d);
                      setSelectedDates(newDates);
                      form.setFieldsValue({ preferred_dates: newDates });
                      form.validateFields(["preferred_dates"]);
                    }}
                  >
                    {d}
                  </Tag>
                ))}
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="preferred_times"
            label={
              <span
                className="font-semibold text-[15px] text-[#1B1B1B]"
              >
                Preferred Time(s)
              </span>
            }
            rules={[yupRule(bookingValidationSchema, "preferred_times")]}
          >
            <Select
              mode="multiple"
              placeholder="Select time(s)"
              className="w-full"
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
                className="font-semibold text-[15px] text-[#1B1B1B]"
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
                className="font-semibold text-[15px] text-[#1B1B1B]"
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
              className="w-full"
            >
              <Button icon={<UploadOutlined />} block className="w-full">
                Upload
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="notes"
            label={
              <span
                className="font-semibold text-[15px] text-[#1B1B1B]"
              >
                Sponsor Notes
              </span>
            }
            className="col-span-3"
          >
            <Input.TextArea placeholder="Enter notes" rows={4} />
          </Form.Item>

          <div className="col-span-3 flex justify-end mt-[16px] gap-[20px]">
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
          <div className="text-center">
            <img
              src={Success}
              alt="Success"
              className="w-[60px] h-[60px] mb-[16px]"
            />
            <h2
              className="text-[#007F5F] text-[20px] font-bold m-0 capitalize leading-[1.5]"
            >
              Your Appointment Request Sent Successfully <br />
            </h2>
          </div>
        }
      >
        <p
          className="text-[16px] font-medium text-[#2E2E2E] text-center"
        >
          Our Practice Manager will review your request and get back to you
          shortly.
        </p>
      </Modal>

      {/* Verimed Multi-Step Secure Stripe Checkout Portal */}
      <StripeCheckoutModal
        open={isCheckoutModalOpen}
        onCancel={() => setIsCheckoutModalOpen(false)}
        onSuccess={handleConfirmCheckout}
        title="Consultation Service"
        summaryTitle="Appointment & Clinical Review"
        itemName={
          pendingBookingValues?.values?.appointmentType
            ? deptList?.find(
                (d) => d.id === pendingBookingValues.values.appointmentType
              )?.dep_name || "Physician Consultation"
            : "In-Home Clinical Visit"
        }
        subItemName={
          pendingBookingValues?.values?.patientId
            ? patients?.find(
                (p) => p.id === pendingBookingValues.values.patientId
              )?.patient_name || "Loved One Patient"
            : "Loved One Patient"
        }
        amount="75,000 CFA ($150.00 USD)"
        buttonText="Complete & Confirm Booking"
        userData={userData}
      />
    </div>
  );
}
