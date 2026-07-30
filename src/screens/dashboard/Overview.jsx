/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { overviewService } from "../../services/overviewService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import Banner from "../../components/illustrations/Banner";
import bloodPressure from "../../assets/icons/blood-pressure.svg";
import heartRate from "../../assets/icons/heart-rate.svg";
import oxygen from "../../assets/icons/oxygen.svg";
import respiratory from "../../assets/icons/respiratory.svg";
import statusIcon from "../../assets/icons/status.svg";
import sugar from "../../assets/icons/sugar.svg";
import weight from "../../assets/icons/weight.svg";
import temperature from "../../assets/icons/temperature.png";
import Primarybtn from "../../components/common/PrimaryBtn";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { Button, Empty, Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Popconfirm, message } from "antd";
import { Pie, Column } from "@ant-design/plots";
import { base_url, isAdminUser } from "../../constants/constants";
import axios from "axios";

export default function Overview() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [patientData, setPatientData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
  const [selectedPatientRow, setSelectedPatientRow] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(() =>
    localStorage.getItem("selectedPatientId"),
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

  const token = localStorage.getItem("token");

  const deleteAppointment = async (id) => {
    try {
      const endpoint = `${base_url}/verimed_bookappoinment_create_update/`;

      await axios.delete(endpoint, {
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          appoinmentdeleteids: [id],
        },
      });

      message.success("Appointment deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (error) {
      console.error(error);
      message.error("Failed to delete appointment");
    } finally {
      // Completed delete appointment
    }
  };

  const showPatientDetails = (record) => {
    navigate("/view_patient_details", {
      state: { appointmentData: record.fullData || record },
    });
  };

  const handlePatientModalClose = () => {
    setIsPatientModalVisible(false);
    setSelectedPatientRow(null);
  };

  const { data: appointmentList = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const data = await overviewService.getAllAppointments();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });

  const [user] = useState(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });

  const isAdmin = isAdminUser(user);

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
  }, [user]);

  const sponsorId = localStorage.getItem("sponsorProfileId");

  const { data: patientsList = [], refetch: refetchPatients } = useQuery({
    queryKey: ["sponsorPatients", sponsorId],
    queryFn: async () => {
      if (
        !sponsorId ||
        sponsorId === "null" ||
        sponsorId === "undefined" ||
        sponsorId === "0"
      )
        return [];
      const res = await overviewService.getSponsorPatients(sponsorId);
      return Array.isArray(res) ? res : [];
    },
    enabled:
      !!sponsorId &&
      (user?.user_role === "sponsor" || user?.user_role === "patient"),
  });

  useEffect(() => {
    if (patientsList.length > 0) {
      const currentSelectedId = Number(
        selectedPatientId || localStorage.getItem("selectedPatientId"),
      );
      const selectedPatient =
        patientsList.find((p) => p.id === currentSelectedId) ||
        patientsList[0] ||
        null;
      setPatientData(selectedPatient);
    } else {
      setPatientData(null);
    }
  }, [patientsList, selectedPatientId]);

  useEffect(() => {
    const fetchLoggedInDoctor = async () => {
      try {
        const endpoint = `${base_url}/doctorprofile_list/`;
        const headers = {
          Authorization: `Token ${token}`,
        };
        const res = await axios.get(endpoint, { headers });
        const loggedInDoctor = res.data.find(
          (doc) => doc?.user?.id === user?.id,
        );
        localStorage.setItem("doctorData", JSON.stringify(loggedInDoctor));
      } catch (error) {
        console.log("Error fetching logged in doctor:", error);
        message.error("Failed to load doctor profile");
      } finally {
        // Completed fetching doctor profile
      }
    };
    fetchLoggedInDoctor();
  }, [user, token]);

  // useEffect(() => {
  //   const doctorDataRaw = localStorage.getItem("doctorData");
  //   if (doctorDataRaw && doctorDataRaw !== "undefined") {
  //     try {
  //       const doctorData = JSON.parse(doctorDataRaw);
  //       setDoctorId(doctorData?.id || null);
  //     } catch (error) {
  //       console.error("Error parsing doctorData:", error);
  //       setDoctorId(null);
  //     }
  //   }
  // }, []);

  const doctorDataRaw = localStorage.getItem("doctorData");
  let doctorId = 0;
  if (doctorDataRaw && doctorDataRaw !== "undefined") {
    const doctorData = JSON.parse(doctorDataRaw);
    doctorId = doctorData?.id || null;
  }

  const { data: doctorAppointments = [] } = useQuery({
    queryKey: ["doctorAppointments", doctorId],
    queryFn: async () => {
      const data = await overviewService.getDoctorAppointments(doctorId);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!doctorId && !!token,
  });

  const { data: caretakerAppoinments = [] } = useQuery({
    queryKey: ["caretakerAppointments"],
    queryFn: async () => {
      const data = await overviewService.getAllAppointments();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token && user?.user_role === "care_taker",
  });

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

  const getVitalColor = (label, value) => {
    if (!value) return "#BDBDBD";
    switch (label) {
      case "Blood Pressure": {
        const match = value.match(/(\d+)\/(\d+)/);
        if (!match) return "#BDBDBD";
        const [sys, dia] = match.slice(1).map(Number);
        if (sys > 130 || dia > 85) return "#EF1E1E";
        return "#27AE60";
      }
      case "Blood Sugar": {
        const num = parseInt(value);
        return num > 110 ? "#EF1E1E" : "#27AE60";
      }
      case "Heart Rate": {
        const num = parseInt(value);
        return num > 100 || num < 60 ? "#EF1E1E" : "#27AE60";
      }
      case "Oxygen": {
        const num = parseInt(value);
        return num < 95 ? "#EF1E1E" : "#27AE60";
      }
      case "Temperature": {
        const num = parseFloat(value);
        return num > 100.4 ? "#EF1E1E" : "#27AE60";
      }
      case "Respiratory Rate": {
        const num = parseInt(value);
        return num > 20 ? "#EF1E1E" : "#27AE60";
      }
      case "Weight": {
        const num = parseInt(value);
        return num > 90 ? "#F39C12" : "#27AE60";
      }
      case "Status":
        return value === "Stable" ? "#27AE60" : "#EF1E1E";
      default:
        return "#27AE60";
    }
  };

  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: patientData?.blood_pressure || "N/A",
      color: getVitalColor("Blood Pressure", patientData?.blood_pressure),
    },
    {
      icon: heartRate,
      label: "Heart Rate",
      value: patientData?.heart_rate || "N/A",
      color: getVitalColor("Heart Rate", patientData?.heart_rate),
    },
    {
      icon: sugar,
      label: "Blood Sugar",
      value: patientData?.blood_sugar || "N/A",
      color: getVitalColor("Blood Sugar", patientData?.blood_sugar),
    },
    {
      icon: oxygen,
      label: "Oxygen",
      value: patientData?.oxygen || "N/A",
      color: getVitalColor("Oxygen", patientData?.oxygen),
    },
    {
      icon: temperature,
      label: "Temperature",
      value: patientData?.temperature || "N/A",
      color: getVitalColor("Temperature", patientData?.temperature),
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: patientData?.respiratory_rate || "N/A",
      color: getVitalColor("Respiratory Rate", patientData?.respiratory_rate),
    },
    {
      icon: weight,
      label: "Weight",
      value: patientData?.weight || "N/A",
      color: getVitalColor("Weight", patientData?.weight),
    },
    {
      icon: statusIcon,
      label: "Status",
      value: patientData?.status || "N/A",
      color: getVitalColor("Status", patientData?.status),
    },
  ];

  const careTeam = patientData
    ? {
        name: patientData.caretaker || "N/A",
        role: "Caretaker",
        contact: patientData.emer_con_phone || "N/A",
        frequency: "Weekly",
      }
    : {};

  // const appointments = vitalsData
  //   ? [
  //       {
  //         id: vitalsData.id,
  //         doctor: vitalsData.doc?.user
  //           ? `${vitalsData.doc.user.first_name} ${vitalsData.doc.user.last_name}`
  //           : "N/A",
  //         date: vitalsData.appointment_date
  //           ? new Date(vitalsData.appointment_date)
  //           : null,
  //         time: vitalsData.appointment_time || "N/A",
  //         type: vitalsData.appointment_type || "N/A",
  //       },
  //     ]
  //   : [];

  // const appointmentDetailsDynamic = vitalsData
  //   ? [
  //       {
  //         date: vitalsData.appointment_date
  //           ? new Date(vitalsData.appointment_date).toLocaleDateString(
  //               "en-US",
  //               {
  //                 month: "short",
  //                 day: "numeric",
  //                 year: "numeric",
  //               }
  //             ) + ` – ${vitalsData.appointment_time?.slice(0, 5)}`
  //           : "N/A",
  //         type: vitalsData.appointment_type || "N/A",
  //         provider: vitalsData.doc?.doctor_id || "N/A",
  //         status: vitalsData.appointment_status || "N/A",
  //         comments: vitalsData.care_taker_notes || "",
  //       },
  //     ]
  //   : [];

  const columns = [
    {
      title: "Date",
      dataIndex: "appointment_date",
      key: "appointment_date",
      width: 120,
    },
    {
      title: "Time",
      dataIndex: "appointment_time",
      key: "appointment_time",
      width: 120,
    },
    {
      title: "Doctor/Nurse",
      dataIndex: "doctor",
      key: "doctor",
      width: 180,
    },
    {
      title: "Service Taken",
      dataIndex: "appointment_type",
      key: "appointment_type",
      width: 200,
    },
    {
      title: "Care Taker Notes",
      dataIndex: "care_taker_notes",
      key: "care_taker_notes",
      ellipsis: true,
    },
  ];

  const docStats = [
    {
      id: 1,
      name: "Total Appointments",
      count: appointmentList.length,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 2,
      name: "Total Appointments",
      count: appointmentList.length,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 3,
      name: "Completed",
      count: 20,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 4,
      name: "Pending",
      count: 24,
      diff: "+25%",
      duration: "in last 7 Days",
    },
    {
      id: 5,
      name: "Cancelled",
      count: 6,
      diff: "+15%",
      duration: "in last 7 Days",
    },
  ];

  const doctorPatientDetailsColumns = [
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patientName",
      render: (text, record) => (
        <div>
          {text}
          <br />
          <span className="text-[#888] text-[12px]">{record.patientId}</span>
        </div>
      ),
      width: 240,
    },
    {
      title: "Sponsor",
      dataIndex: "sponsor",
      key: "sponsor",
      width: 180,
    },
    {
      title: "Care Taker",
      dataIndex: "caretaker",
      key: "caretaker",
      width: 180,
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      width: 220,
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
      width: 220,
    },
    {
      title: "Appointment Type",
      dataIndex: "type",
      key: "type",
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          className="bg-[#3CC994] rounded-[6px] border-solid border-[#3CC994]"
          onClick={(e) => {
            e.stopPropagation();
            showPatientDetails(record);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const doctorPatientDetailsData = doctorAppointments.length
    ? doctorAppointments.map((appt, index) => ({
        ...appt,
        key: appt.id || `${appt.patient?.id}-${appt.doc?.id}-${index}`,
        patientName: appt.patient?.patient_name || "N/A",
        patientId: appt.patient?.id ? `ID: ${appt.patient.id}` : "",
        sponsor:
          appt.sponsor?.user?.username || appt.sponsor?.sponsor_id || "N/A",
        caretaker:
          appt.caretaker?.caretaker_id || appt.patient?.caretaker || "N/A",
        doctor: appt.doc?.user
          ? `${appt.doc.user.first_name} ${appt.doc.user.last_name}`
          : appt.doc?.doctor_id || "N/A",
        condition:
          appt.patient?.medical_his_diagnosis ||
          appt.patient?.medical_his_other ||
          appt.appointment_reason ||
          "N/A",
        type: appt.appointment_type || "N/A",
        fullData: appt,
      }))
    : patientData
      ? [
          {
            ...patientData,
            key: patientData.id || "patient-details",
            patientName: patientData.patient_name || "N/A",
            patientId: patientData.id ? `ID: ${patientData.id}` : "",
            sponsor: String(patientData.sponsor || "N/A"),
            caretaker: patientData.caretaker || "N/A",
            doctor: "N/A",
            condition: patientData.medical_his_diagnosis || "N/A",
            type: "N/A",
            fullData: patientData,
          },
        ]
      : [];

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

  const revenuePieConfig = {
    data: [
      { type: "Total Revenue", value: 100000 },
      { type: "Total Transactions", value: 968 },
      { type: "Average Transaction", value: 8000 },
      { type: "Refunds / Failures", value: 12 },
    ],
    angleField: "value",
    colorField: "type",
    color: ["#1E90FF", "#36AC00", "#FFB020", "#EF2412"],
    radius: 0.8,
    label: {
      text: "value",
      style: { fontWeight: "bold" },
    },
    legend: { position: "bottom" },
    interactions: [{ type: "element-active" }],
  };

  const statusBarConfig = {
    data: [
      { month: "01", Completed: 100, Ongoing: 50, Pending: 30 },
      { month: "02", Completed: 120, Ongoing: 70, Pending: 40 },
      { month: "03", Completed: 150, Ongoing: 80, Pending: 50 },
      { month: "04", Completed: 180, Ongoing: 60, Pending: 30 },
      { month: "05", Completed: 240, Ongoing: 80, Pending: 50 },
      { month: "06", Completed: 100, Ongoing: 40, Pending: 20 },
      { month: "07", Completed: 130, Ongoing: 60, Pending: 30 },
      { month: "08", Completed: 220, Ongoing: 80, Pending: 40 },
      { month: "09", Completed: 250, Ongoing: 90, Pending: 60 },
      { month: "10", Completed: 200, Ongoing: 70, Pending: 40 },
      { month: "11", Completed: 180, Ongoing: 60, Pending: 30 },
      { month: "12", Completed: 140, Ongoing: 50, Pending: 20 },
    ],
    isStack: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
  };

  const transformedData = [];
  statusBarConfig.data.forEach((item) => {
    transformedData.push(
      { month: item.month, type: "Completed", value: item.Completed },
      { month: item.month, type: "Ongoing", value: item.Ongoing },
      { month: item.month, type: "Pending", value: item.Pending },
    );
  });

  const stackedBarConfig = {
    data: transformedData,
    isStack: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
    color: ["#00C49F", "#0088FE", "#FFBB28"],
    legend: { position: "bottom" },
  };

  const appointmentListData = appointmentList.map((item, idx) => ({
    id: item.id,
    key: item.id,
    date: item.appointment_date
      ? new Date(item.appointment_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    sponsor: item?.sponsor?.user?.username,
    patient: item.patient?.patient_name || "Unknown",
    type: item.appointment_type || "-",
    caretaker: item.caretaker?.caretaker_id || "Unknown",
    time: item.appointment_time
      ? `${new Date(`1970-01-01T${item.appointment_time}`).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        )}`
      : "-",
    status: item.appointment_status || "Pending",
  }));

  const appointmentListColumns = [
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <span>
          {record.date}
          <br />
          <span className="text-[#888] text-[13px]">{record.time}</span>
        </span>
      ),
      width: 150,
    },
    {
      title: "Patient Name",
      dataIndex: "patient",
      key: "patient",
      width: 140,
    },
    {
      title: "Sponsor Name",
      dataIndex: "sponsor",
      key: "sponsor",
      width: 140,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
    },
    {
      title: "Care Taker",
      dataIndex: "caretaker",
      key: "caretaker",
      width: 140,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 120,
      responsive: ["md"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = "#888";
        if (status === "Ongoing") color = "#27AE60";
        else if (status === "Pending") color = "#F2994A";
        else if (status === "Completed") color = "#007F5F";
        else if (status === "Cancelled") color = "#EF1E1E";
        else if (status === "Rescheduled") color = "#B78520";
        const colorClass =
          status === "Confirmed"
            ? "text-[#2F80ED]"
            : status === "Pending"
              ? "text-[#F2994A]"
              : status === "Completed"
                ? "text-[#007F5F]"
                : status === "Cancelled"
                  ? "text-[#EF1E1E]"
                  : status === "Rescheduled"
                    ? "text-[#B78520]"
                    : "text-gray-700";
        return <span className={`font-semibold ${colorClass}`}>{status}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div className="flex justify-between items-center">
          {/* Edit */}
          <Button
            type="link"
            className="text-[#B78520] font-medium p-0"
            onClick={() => {
              navigate("/appointments", {
                state: { openAppointmentId: record.id },
              });
            }}
          >
            <EditOutlined />
          </Button>

          {/* Delete with confirmation */}
          <Popconfirm
            title="Delete Appointment"
            description="Are you sure you want to delete this appointment?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteAppointment(record.id)}
          >
            <Button type="link" className="text-[#EF1E1E] font-medium p-0">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const hasMore = visibleCount < todaysAppointment.length;

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() + 1),
    );
  };

  const handleCardClick = (appointment) => {
    setSelectedAppointmentId(appointment.id);
    navigate(`/appointments`, {
      state: { selectedAppointmentId: appointment.id },
    });
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
    currentMonth?.getFullYear(),
    currentMonth?.getMonth(),
  );

  const appointmentDates = appointmentList.map((a) => a.date?.toDateString());

  const userToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint = `${base_url}/user_view/`;
        const headers = {
          Authorization: `Token ${userToken}`,
        };
        await axios.get(endpoint, { headers });
      } catch (error) {
        console.log(error);
        message.error("Failed to load users");
      } finally {
        // Completed fetching users
      }
    };
    fetchUsers();
  }, []);

  const base_url1 = process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL.replace(/\/verimed\/?$/i, "")
    : "";

  const getPhotoUrl = (url) => {
    if (!url) return patientdetails;
    if (url?.startsWith("http")) return url;

    url = url?.replace(/^\/media\/+/i, "/");

    const base = base_url1?.replace(/\/+$/, "");
    const cleanedUrl = url?.replace(/^\/+/, "");

    const finalUrl = `${base}/${cleanedUrl}`;

    return finalUrl;
  };

  const handleDownloadExcel = () => {
    if (!patientData) {
      alert("Patient data not available yet.");
      return;
    }

    // Prepare CSV header and rows
    let csvContent = "Patient Details\n";
    csvContent += `Name,Patient ID,Condition,Assigned Doctor,Care Taker\n`;
    csvContent += `"${patientData && patientData?.patient_name}","${
      patientData && patientData?.id
    }","${patientData && patientData?.medical_his_diagnosis}","${
      patientData && patientData?.caretaker
    }"\n\n`;

    csvContent += "Vitals\n";
    csvContent += "Parameter,Value\n";
    vitals.forEach((v) => {
      csvContent += `"${v.label}","${v.value}"\n`;
    });

    // Create a Blob for download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Patient_Details.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const patientId = localStorage.getItem("sponsorPatientIds");

  const cleanedPatientId = Number(patientId?.replace(/[\[\]]/g, ""));

  const { data: medicalReports = [] } = useQuery({
    queryKey: ["medicalHistory", cleanedPatientId],
    queryFn: async () => {
      const data =
        await overviewService.getPatientAppointments(cleanedPatientId);
      const reports = (Array.isArray(data) ? data : []).map((item, index) => ({
        key: index,
        appointment_date: item.appointment_date,
        appointment_time: item.appointment_time,
        doctor: item.doc?.user
          ? `${item.doc.user.first_name} ${item.doc.user.last_name}`
          : "—",
        appointment_type: item.appointment_type,
        care_taker_notes: item.care_taker_notes,
      }));
      return reports;
    },
    enabled: !!cleanedPatientId && !isNaN(cleanedPatientId) && !!token,
  });

  const CaretakerAppointmentCard = ({ appointment }) => {
    return (
      <div className="bg-white rounded-[16px] p-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-[1px] border-solid border-[#F0F2F5] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col gap-[16px]">
        <div className="flex items-center gap-[16px] border-b-[1px] border-solid border-[#F0F2F5] pb-[16px]">
          <img
            src={appointment?.patient?.photo_view_url || patientdetails}
            alt={appointment?.patient?.patient_name || "Unknown"}
            className="w-[60px] h-[60px] rounded-[100px] object-cover border-[2px] border-solid border-[#007F5F]"
          />
          <div>
            <h3 className="text-[18px] font-bold text-[#1E293B] m-0 leading-tight">
              {appointment?.patient?.patient_name || "Unknown Patient"}
            </h3>
            <span className="inline-block bg-[#E6F4EA] text-[#007F5F] text-[12px] font-semibold px-[8px] py-[2px] rounded-[4px] mt-[4px]">
              {appointment?.dep?.dep_name || "General"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <div className="flex justify-between items-start">
            <span className="text-[13px] font-medium text-[#64748B]">
              Appointment Type:
            </span>
            <span className="text-[14px] font-semibold text-[#334155] text-right">
              {appointment?.appointment_type || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-[13px] font-medium text-[#64748B]">
              Preferred Date:
            </span>
            <span className="text-[14px] font-semibold text-[#334155] text-right">
              {Array.isArray(appointment?.preferred_dates)
                ? appointment.preferred_dates.join(", ")
                : "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-[13px] font-medium text-[#64748B]">
              Preferred Time:
            </span>
            <span className="text-[14px] font-semibold text-[#334155] text-right">
              {Array.isArray(appointment?.preferred_times)
                ? appointment.preferred_times.join(", ")
                : "N/A"}
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-[12px] rounded-[8px] border-[1px] border-solid border-[#E2E8F0]">
            <span className="text-[12px] font-bold text-[#475569] uppercase tracking-wider mb-[4px] block">
              Caretaker Notes
            </span>
            <p className="text-[13px] text-[#334155] m-0 line-clamp-2">
              {appointment?.care_taker_notes || "No notes available."}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-[8px]">
          <Primarybtn
            name="View Patient Details"
            onClick={() =>
              navigate("/view_patient_details", {
                state: { appointmentData: appointment },
              })
            }
          />
        </div>
      </div>
    );
  };

  const userDataRaw = localStorage.getItem("userData");
  const userData =
    userDataRaw && userDataRaw !== "undefined" ? JSON.parse(userDataRaw) : null;

  useEffect(() => {
    const fetchCareTakerPatients = async () => {
      try {
        const endpoint = `${base_url}/caretakerprofile_list/`;
        const res = await axios.get(endpoint);
        const loggedInCaretaker = res.data.find(
          (ct) => ct?.user?.id === userData?.id,
        );
        localStorage.setItem(
          "careTakerData",
          JSON.stringify(loggedInCaretaker),
        );
      } catch (error) {
        console.log("Error fetching care taker patients:", error);
        message.error("Failed to load caretaker profile");
      } finally {
        // Completed fetching caretaker profile
      }
    };
    fetchCareTakerPatients();
  }, [userData]);

  const careTakerDataRaw = localStorage.getItem("careTakerData");
  const careTakerData =
    careTakerDataRaw && careTakerDataRaw !== "undefined"
      ? JSON.parse(careTakerDataRaw)
      : null;
  useEffect(() => {
    const fetchCareTakerPatients = async () => {
      try {
        const endpoint = `${base_url}/verimed_bookappoinment_create_update/`;
        const headers = { Authorization: `Token ${token}` };
        const res = await axios.get(endpoint, { headers });
        const data = res.data;
        const patients = Array.isArray(data)
          ? data.filter((appt) => appt?.caretaker?.id === careTakerData?.id)
          : [];

        localStorage.setItem("careTakerPatients", JSON.stringify(patients));
      } catch (error) {
        console.log("Error fetching care taker patients:", error);
        message.error("Failed to load caretaker patients");
      } finally {
        // Completed fetching caretaker patients
      }
    };
    fetchCareTakerPatients();
  }, [careTakerData, token]);

  const patientTableColumns = [
    {
      title: "Profile",
      key: "photo",
      render: (_, record) => (
        <img
          src={getPhotoUrl(record?.photo_view_url)}
          alt="profile"
          className="w-[40px] h-[40px] rounded-[8px] object-cover"
        />
      ),
      width: 80,
    },
    {
      title: "Name & ID",
      key: "name",
      render: (_, record) => (
        <div>
          <div className="font-semibold text-[#1B1B1B]">
            {record.patient_name || "Unknown"}
          </div>
          <div className="text-[12px] text-[#6B7280]">ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: "Condition / Diagnosis",
      dataIndex: "medical_his_diagnosis",
      key: "condition",
      render: (text) => text || "N/A",
    },
    {
      title: "Care Taker",
      key: "caretaker",
      render: (_, record) => {
        if (typeof record.caretaker === "object" && record.caretaker !== null) {
          return record.caretaker.first_name || record.caretaker_name || "N/A";
        }
        return record.caretaker || record.caretaker_name || "N/A";
      },
    },
    {
      title: "Role",
      dataIndex: "reason_enrollment",
      key: "role",
      render: (text) => {
        if (text === "Self")
          return (
            <span className="text-[#007F5F] font-medium">Patient (Self)</span>
          );
        if (text === "Loved One")
          return <span className="text-[#2F80ED] font-medium">Loved One</span>;
        return (
          <span className="text-gray-500 font-medium">{text || "Patient"}</span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() =>
            navigate("/view_patient_details", {
              state: { appointmentData: record },
            })
          }
          style={{ background: "#007F5F", borderColor: "#007F5F" }}
        >
          View
        </Button>
      ),
      width: 100,
    },
  ];

  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0">
          <Header />
        </div>

        {/* Page Content */}
        <div className="p-[20px] overflow-y-auto gap-[20px] flex flex-col items-center overflow-x-hidden">
          {/* Banner */}
          {user?.user_role === "sponsor" && <Banner />}

          {/* Patient Details */}
          {user?.user_role !== "doctor" &&
            (user?.user_role === "sponsor" ||
              user?.user_role === "patient") && (
              <div className="rounded-[12px] p-[20px] w-full flex flex-col gap-[20px] min-w-0">
                <SectionHeader title="Patient Details">
                  <Primarybtn
                    name="View Full Profile"
                    onClick={() => navigate("/my_loved_ones")}
                  />
                  <SecondaryBtn name="Download" onClick={handleDownloadExcel} />
                </SectionHeader>

                <div className="w-full overflow-x-auto mt-4">
                  <Table
                    dataSource={patientsList}
                    columns={patientTableColumns}
                    pagination={{ pageSize: 5 }}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    className="min-w-full"
                  />
                </div>
              </div>
            )}

          {user?.user_role === "care_taker" && (
            <>
              {/* cards */}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[15px] min-w-0 w-full">
                {vitals.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-[10px] border-[1px] border-solid border-[#1B1B1B1A] rounded-[10px] p-[10px] min-h-[80px] min-w-0"
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-[24px] h-[24px] shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <p className="text-[14px] font-semibold mb-[2px]">
                        {item.label}
                      </p>
                      <div className="flex items-center gap-[5px]">
                        <div
                          className="w-[8px] h-[8px] rounded-full shrink-0"
                          style={{ background: item.color }}
                        ></div>
                        <span className="text-[14px] text-[#2E2E2E] break-words">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Doctor overview stats */}
          {(user?.user_role === "doctor" || isAdmin) && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[16px] w-full">
              {docStats.map((stat, idx) => (
                <div
                  key={stat.id}
                  className="bg-white rounded-[12px] p-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border-[1px] border-solid border-[#F1F5F9] flex flex-col gap-[16px]"
                >
                  <div className="flex items-center justify-start gap-[12px]">
                    <div className="h-[36px] w-[36px] rounded-[8px] flex items-center justify-center bg-[#E6F4EA]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_484_11034)">
                          <path
                            d="M11.5 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V11"
                            stroke="#007F5F"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 3V7"
                            stroke="#007F5F"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 3V7"
                            stroke="#007F5F"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4 11H20"
                            stroke="#007F5F"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.0001 22.0001L21.3501 18.7161C21.5556 18.5168 21.719 18.2783 21.8307 18.0147C21.9425 17.7512 22.0003 17.4679 22.0007 17.1817C22.0012 16.8954 21.9443 16.612 21.8334 16.3481C21.7225 16.0841 21.5599 15.8451 21.3551 15.6451C20.9373 15.2365 20.3763 15.0071 19.7918 15.006C19.2074 15.0049 18.6455 15.2321 18.2261 15.6391L18.0021 15.8591L17.7791 15.6391C17.3613 15.2307 16.8006 15.0016 16.2163 15.0005C15.6321 14.9994 15.0705 15.2264 14.6511 15.6331C14.4456 15.8324 14.2821 16.0708 14.1703 16.3343C14.0585 16.5978 14.0006 16.8811 14 17.1673C13.9994 17.4536 14.0562 17.7371 14.167 18.001C14.2778 18.265 14.4404 18.504 14.6451 18.7041L18.0001 22.0001Z"
                            stroke="#007F5F"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_484_11034">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <p className="text-[#475569] text-[14px] font-semibold m-0 leading-tight">
                      {stat.name}
                    </p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-[#0F172A] text-[28px] font-bold m-0 leading-none">
                      {stat.count}
                    </p>
                    <div className="flex flex-col items-end">
                      <div className="bg-[#ECFDF5] px-[8px] py-[4px] rounded-[6px] mb-[4px]">
                        <p className="text-[#059669] text-[12px] font-bold m-0 leading-none flex items-center gap-[2px]">
                          <UpOutlined className="text-[10px]" /> {stat.diff}
                        </p>
                      </div>
                      <p className="text-[#94A3B8] text-[11px] font-medium m-0 leading-none">
                        {stat.duration}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Charts section */}
          {/* {user?.user_role === "admin" && (
            <div
              className="flex items-center justify-between w-full gap-[20px]"
            >
              <div
                className="w-[50%] bg-white h-[437px] rounded-[8px] p-[24px] flex flex-col"
              >
                <div
                  className="flex justify-between items-center mb-[16px]"
                >
                  <p
                    className="font-semibold text-[18px] text-[#1B1B1B]"
                  >
                    Revenue Overview
                  </p>
                  <span
                    onClick={() => {}}
                    className="bg-white rounded-[6px] py-[6px] px-[14px] text-[14px] font-medium text-[#1F2329] cursor-pointer border-[1px] border-solid border-[#0000001F]"
                  >
                    Aug 2025 <CalendarOutlined />
                  </span>
                </div>
                <Pie
                  {...revenuePieConfig}
                  className="h-[320px] w-full"
                />
              </div>

              <div
                className="w-[50%] bg-white h-[437px] rounded-[8px] p-[24px] flex flex-col"
              >
                <div
                  className="flex justify-between items-center mb-[16px]"
                >
                  <p
                    className="font-semibold text-[18px] text-[#1B1B1B]"
                  >
                    Appointment Statistics
                  </p>
                  <span
                    onClick={() => {}}
                    className="bg-white rounded-[6px] py-[6px] px-[14px] text-[14px] font-medium text-[#1F2329] cursor-pointer border-[1px] border-solid border-[#0000001F]"
                  >
                    Aug 2025 <CalendarOutlined />
                  </span>
                </div>

                <div
                  className="flex justify-between mb-[20px]"
                >
                  {[
                    { label: "All Appointments", value: 6314 },
                    { label: "Completed", value: 4578 },
                    { label: "Pending", value: 745 },
                    { label: "Cancelled", value: 456 },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`flex-1 text-center border-[1px] border-solid border-[#E7E8EB] rounded-[8px] p-[10px_5px] bg-[#FAFAFA] ${i !== 3 ? "mr-[10px]" : "mr-0"}`}
                    >
                      <p className="text-[12px] text-[#666]">
                        {stat.label}
                      </p>
                      <p
                        className="text-[16px] font-bold text-[#1B1B1B] m-0"
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <Column {...stackedBarConfig} className="h-[260px]" />
              </div>
            </div>
          )} */}
          {/* Appointment List */}
          {isAdmin && (
            <div className="bg-white rounded-[16px] p-[24px] w-full shadow-[0_2px_8px_rgba(0,0,0,0.05)] m-[20px]">
              {/* Header */}
              <div className="flex justify-between items-center mb-[18px] flex-wrap gap-[10px]">
                <p className="text-[18px] font-semibold text-[#1B1B1B]">
                  Appointment List
                </p>
                <div className="flex gap-[10px]">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/appointments")}
                    className="bg-white rounded-[8px] font-medium border-[1px] border-solid border-[#F0C330] text-[#B78520]"
                  >
                    New Appointment
                  </Button>
                  <Button
                    icon={<CalendarOutlined />}
                    className="bg-white rounded-[8px] font-medium border-[1px] border-solid border-[#0000001F] text-[#1F2329]"
                  >
                    Aug 2025
                  </Button>
                  <Button
                    icon={<FilterOutlined />}
                    className="bg-white rounded-[8px] font-medium border-[1px] border-solid border-[#F0C330] text-[#B78520]"
                  ></Button>
                </div>
              </div>
              {/* Table */}
              <Table
                columns={appointmentListColumns}
                dataSource={appointmentListData}
                pagination={{ pageSize: 10 }}
                // scroll={{ x: true }}
                bordered
                // className="w-full"
              />
            </div>
          )}

          {/* Doctor patient details table */}
          {(user?.user_role === "doctor" || isAdmin) &&
            doctorPatientDetailsData.length > 0 && (
              <div className="w-full bg-white rounded-[16px] p-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] mt-[20px]">
                <SectionHeader title="Patient Details" />
                <Table
                  columns={doctorPatientDetailsColumns}
                  dataSource={doctorPatientDetailsData}
                  pagination={{ pageSize: 5 }}
                  bordered
                  rowKey="key"
                  onRow={(record) => ({
                    onClick: () => showPatientDetails(record),
                    style: { cursor: "pointer" },
                  })}
                />
                <Modal
                  title="Patient Details"
                  open={isPatientModalVisible}
                  onCancel={handlePatientModalClose}
                  footer={[
                    <Button
                      key="close"
                      type="primary"
                      onClick={handlePatientModalClose}
                    >
                      Close
                    </Button>,
                  ]}
                  width={680}
                >
                  {selectedPatientRow ? (
                    <div className="grid gap-[14px]">
                      <div className="grid grid-cols-[1fr_1fr] gap-[14px]">
                        <div>
                          <strong>Patient Name</strong>
                          <div>{selectedPatientRow.patientName}</div>
                        </div>
                        <div>
                          <strong>Patient ID</strong>
                          <div>{selectedPatientRow.patientId || "N/A"}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr] gap-[14px]">
                        <div>
                          <strong>Sponsor</strong>
                          <div>{selectedPatientRow.sponsor || "N/A"}</div>
                        </div>
                        <div>
                          <strong>Care Taker</strong>
                          <div>{selectedPatientRow.caretaker || "N/A"}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr] gap-[14px]">
                        <div>
                          <strong>Doctor</strong>
                          <div>{selectedPatientRow.doctor || "N/A"}</div>
                        </div>
                        <div>
                          <strong>Appointment Type</strong>
                          <div>{selectedPatientRow.type || "N/A"}</div>
                        </div>
                      </div>
                      <div>
                        <strong>Condition</strong>
                        <div>{selectedPatientRow.condition || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr] gap-[14px]">
                        <div>
                          <strong>Phone</strong>
                          <div>
                            {selectedPatientRow.appointment?.patient?.phone ||
                              "N/A"}
                          </div>
                        </div>
                        <div>
                          <strong>Email</strong>
                          <div>
                            {selectedPatientRow.appointment?.patient?.email ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr] gap-[14px]">
                        <div>
                          <strong>Preferred Dates</strong>
                          <div>
                            {Array.isArray(
                              selectedPatientRow.appointment?.preferred_dates,
                            )
                              ? selectedPatientRow.appointment.preferred_dates.join(
                                  ", ",
                                )
                              : "N/A"}
                          </div>
                        </div>
                        <div>
                          <strong>Preferred Times</strong>
                          <div>
                            {Array.isArray(
                              selectedPatientRow.appointment?.preferred_times,
                            )
                              ? selectedPatientRow.appointment.preferred_times.join(
                                  ", ",
                                )
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>No patient details available.</div>
                  )}
                </Modal>
              </div>
            )}

          {/* Today's Schedule */}
          {user?.user_role === "care_taker" && (
            <div className="w-full">
              <div className="flex items-center justify-between">
                <p className="text-[#1B1B1B] font-semibold text-[20px]">
                  Today's Schedule
                </p>
                <button
                  onClick={() => navigate("/my_appointments")}
                  className="bg-[#004E89] text-[#fff] py-[8px] px-[16px] rounded-[8px] cursor-pointer border-none"
                >
                  View All Appointments
                </button>
              </div>

              {/* Card Container */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(372px,1fr))] gap-[16px] mt-[16px]">
                {caretakerAppoinments
                  .slice(0, visibleCount)
                  .map((appointment) => (
                    <CaretakerAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
              </div>

              {/* Show More / Show Less Button */}
              {caretakerAppoinments.length > 3 && (
                <div className="text-center mt-[16px]">
                  {visibleCount < caretakerAppoinments.length ? (
                    <button
                      onClick={() =>
                        setVisibleCount((prev) =>
                          Math.min(prev + 3, caretakerAppoinments.length),
                        )
                      }
                      className="bg-transparent text-[#004E89] border-[1px] border-solid border-[#004E89] py-[8px] px-[16px] rounded-[8px] cursor-pointer flex items-center justify-center gap-[8px] mx-auto"
                    >
                      Show More <DownOutlined />
                    </button>
                  ) : (
                    <button
                      onClick={() => setVisibleCount(3)}
                      className="bg-transparent text-[#004E89] border-[1px] border-solid border-[#004E89] py-[8px] px-[16px] rounded-[8px] cursor-pointer flex items-center justify-center gap-[8px] mx-auto"
                    >
                      Show Less <UpOutlined />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Today's Schedule Doctor */}
          {user?.user_role === "doctor" && (
            <div className="w-full">
              <div className="flex items-center justify-between">
                <p className="text-[#1B1B1B] font-semibold text-[20px]">
                  Today's Schedule
                </p>
                <button
                  onClick={() => navigate("/my_appointments")}
                  className="bg-[#004E89] text-[#fff] py-[8px] px-[16px] rounded-[8px] cursor-pointer border-none"
                >
                  View All Appointments
                </button>
              </div>

              {/* Card Container */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(372px,1fr))] gap-[16px] mt-[16px]">
                {doctorAppointments.slice(0, visibleCount).map((appt) => {
                  const isApiItem = !!appt.appointment_date || !!appt.patient;
                  const name = appt?.patient?.patient_name;
                  const disease = appt?.dep?.dep_name;
                  const place = appt?.patient?.patient_home_address;

                  let displayDate = appt?.appointment_date || "";
                  let displayTime = appt?.appointment_time || "";
                  if (isApiItem && appt.appointment_date) {
                    const dt = new Date(
                      `${appt.appointment_date}T${
                        appt.appointment_time || "00:00:00"
                      }`,
                    );
                    displayDate = dt.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                    displayTime = dt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }

                  return (
                    <div
                      key={isApiItem ? `api-${appt.id}` : appt.id}
                      className="bg-white rounded-[16px] p-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-[1px] border-solid border-[#F0F2F5] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between min-h-[256px] gap-[16px]"
                    >
                      <div className="flex items-center gap-[16px] border-b-[1px] border-solid border-[#F0F2F5] pb-[16px]">
                        <img
                          alt={name}
                          src={
                            appt
                              ? appt?.patient?.photo_view_url
                              : patientdetails
                          }
                          className="w-[60px] h-[60px] rounded-[100px] object-cover border-[2px] border-solid border-[#007F5F]"
                        />
                        <div>
                          <h3 className="text-[18px] font-bold text-[#1E293B] m-0 leading-tight">
                            {name || "Unknown Patient"}
                          </h3>
                          <p className="text-[#64748B] text-[13px] font-medium m-0 mb-[4px]">
                            {disease || "General"}
                          </p>
                          <div className="inline-flex items-center justify-center bg-[#E6F4EA] text-[#007F5F] px-[8px] py-[2px] rounded-[4px]">
                            <p
                              className="text-[12px] font-semibold m-0 truncate max-w-[120px]"
                              title={place}
                            >
                              {place || "No Address"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-[#F8FAFC] p-[12px] rounded-[8px] border-[1px] border-solid border-[#E2E8F0]">
                        <div className="flex items-center gap-[12px]">
                          <div className="bg-white p-[8px] rounded-[8px] shadow-sm">
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
                          </div>
                          <div>
                            <p className="text-[#334155] text-[14px] font-bold m-0 leading-tight">
                              {displayDate || "N/A"}
                            </p>
                            <p className="text-[#64748B] text-[12px] font-medium m-0 mt-[2px]">
                              {displayTime || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="h-[36px] w-[1px] bg-[#E2E8F0] mx-[12px]" />

                        <div className="flex items-center gap-[12px]">
                          <div className="bg-white p-[8px] rounded-[8px] shadow-sm">
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
                          </div>
                          <div>
                            <p className="text-[#334155] text-[14px] font-bold m-0 leading-tight">
                              {isApiItem ? appt?.amount || "—" : appt?.amount}
                            </p>
                            <p className="text-[#64748B] text-[12px] font-medium m-0 mt-[2px]">
                              {isApiItem
                                ? appt?.subscription_plan ||
                                  appt?.subscription ||
                                  "—"
                                : appt?.subscription}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-[12px] mt-auto pt-[8px]">
                        <SecondaryBtn
                          name="Patient Profile"
                          onClick={() =>
                            navigate("/my_patients", {
                              state: { appointmentData: appt },
                            })
                          }
                        />
                        <Primarybtn
                          name="View Details"
                          onClick={() =>
                            navigate("/view_patient_details", {
                              state: { appointmentData: appt },
                            })
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More / Show Less Button */}
              {doctorAppointments.length > 3 && (
                <div className="text-center mt-[16px]">
                  {visibleCount < doctorAppointments.length ? (
                    <button
                      onClick={() =>
                        setVisibleCount((prev) =>
                          Math.min(prev + 3, doctorAppointments.length),
                        )
                      }
                      className="bg-transparent text-[#004E89] border-[1px] border-solid border-[#004E89] py-[8px] px-[16px] rounded-[8px] cursor-pointer flex items-center justify-center gap-[8px] mx-auto"
                    >
                      Show More <DownOutlined />
                    </button>
                  ) : (
                    <button
                      onClick={() => setVisibleCount(3)}
                      className="bg-transparent text-[#004E89] border-[1px] border-solid border-[#004E89] py-[8px] px-[16px] rounded-[8px] cursor-pointer flex items-center justify-center gap-[8px] mx-auto"
                    >
                      Show Less <UpOutlined />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Medical Reports & Daily Reports */}
          {user?.user_role === "doctor" && (
            <div className="flex items-start justify-between w-full gap-[12px]">
              <div className="p-[20px] rounded-[16px] w-[60%] bg-[#004E890A] border-[1px] border-solid border-[#004E89]">
                <div className="flex items-center justify-between">
                  <p className="text-[#2E2E2E] text-[16px] font-medium">
                    Medical Reports (Doctor Reports)
                  </p>
                  <Primarybtn
                    name="View Full Reports"
                    onClick={() => navigate("/my_reports")}
                  />
                </div>
                <div>
                  {/* {[
                    {
                      note: "Patient stable, continue medication, BP to be checked daily.",
                      subNote:
                        "- Diabetes under control, advised diet adjustment.",
                      author: "Dr. Paul",
                      date: "Aug 15, 2025",
                    },
                    {
                      note: "- BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable",
                      subNote:
                        "- BP: 150/92 | Status: ⚠ Escalated to Physician",
                      author: "Nurse Clarisse",
                      date: "Aug 16, 2025",
                    },
                  ].map((entry, index) => (
                    <div key={index}>
                      <div
                        className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
                      />
                      <div>
                        <p
                          className="text-[#2E2E2E] font-medium"
                        >
                          {entry.note}
                        </p>
                        <div
                          className="flex flex-row items-center justify-between"
                        >
                          <p
                            className="text-[#2E2E2E] font-medium"
                          >
                            {entry.subNote}
                          </p>
                          <p
                            className="text-[#2E2E2E] italic"
                          >
                            {entry.date} – {entry.author}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))} */}
                  <Empty description="No Data" />
                </div>
              </div>
              <div className="w-[40%] bg-white p-[20px] rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <p className="text-[#007F5F] text-[16px] font-medium">
                  Urgent Alerts
                </p>
                <div className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10" />

                {/* {[
                  {
                    id: 1,
                    title: "Alerts Requiring Attention",
                    description:
                      "Patient: Samuel N. – High BP 150/92 (Reported Aug 14 by Nurse Clarisse)",
                    timestamp: "Aug 15, 2025 – Dr. Paul",
                  },
                  {
                    id: 2,
                    title: "Alerts Requiring Attention",
                    description:
                      "Patient: Samuel N. – High BP 150/92 (Reported Aug 14 by Nurse Clarisse)",
                    timestamp: "Aug 15, 2025 – Dr. Paul",
                  },
                ].map((alert) => (
                  <div key={alert.id} className="mb-[16px]">
                    <p
                      className="text-[#2E2E2E] font-medium"
                    >
                      {alert.title}
                    </p>
                    <p
                      className="text-[#2E2E2E]"
                    >
                      {alert.description}
                    </p>
                    <div
                      className="flex flex-row items-center justify-between"
                    >
                      <p className="text-[#2E2E2E]">{alert.description}</p>
                      <p className="text-[#2E2E2E] italic">
                        {alert.timestamp}
                      </p>
                    </div>
                    <div
                      className="flex items-center justify-between mt-[8px]"
                    >
                      <SecondaryBtn name="Review" onClick={() => {}} />
                      <Primarybtn name="Adjust Medication" onClick={() => {}} />
                    </div>
                    <div
                      className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
                    />
                  </div>
                ))} */}
                <Empty description="No Data" />
              </div>
            </div>
          )}

          {/* Care Team & Medical History */}
          {user?.user_role === "sponsor" && (
            <>
              {/* Main Container */}
              <div className="flex justify-between gap-[20px] w-full bg-[#F9FAFB] p-[20px] rounded-[10px]">
                {/* Left - Care Team Details */}
                <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-[20px] p-[24px] flex-1 font-['Inter',sans-serif] flex flex-col gap-[20px]">
                  {/* Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                    <h3 className="text-[18px] font-bold m-0 text-gray-800 tracking-tight">
                      Care Team Details
                    </h3>
                    <SecondaryBtn name="view reports" onClick={() => {}} />
                  </div>

                  {/* Info Row */}
                  <div className="flex gap-[24px] items-start">
                    <img
                      src={careTeam.avatar || patientdetails}
                      alt="Profile"
                      className="w-[80px] h-[80px] rounded-[20px] shrink-0 object-cover border border-gray-100 shadow-sm"
                    />

                    <div className="flex-1 flex flex-col gap-[16px]">
                      {/* Row 1 */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
                        <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</div>
                          <div className="text-[14px] font-bold text-gray-700">
                            {careTeam.name}
                          </div>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Role</div>
                          <div className="text-[14px] font-bold text-gray-700">
                            {careTeam.role}
                          </div>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Contact Number
                          </div>
                          <div className="text-[14px] font-bold text-gray-700">
                            {careTeam.contact}
                          </div>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                        <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Next Visit
                          </div>
                          <div className="text-[14px] font-bold text-gray-700">
                            {careTeam.nextVisit}
                          </div>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Visit Frequency
                          </div>
                          <div className="text-[14px] font-bold text-gray-700">
                            {careTeam.frequency}
                          </div>
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          Specialization
                        </div>
                        <div className="text-[14px] font-bold text-gray-700">
                          {careTeam.specialization}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Upcoming Appointments */}

                <div className="bg-white w-[350px] rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-[24px] flex flex-col gap-[20px] font-['Inter',sans-serif]">
                  {/* Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                    <p className="text-[18px] font-bold text-gray-800 tracking-tight m-0">
                      Upcoming Appointments
                    </p>
                    <span className="text-[13px] font-semibold text-teal-600 hover:text-teal-700 cursor-pointer transition-colors">
                      View All
                    </span>
                  </div>

                  {/* Calendar Row */}
                  <div className="bg-teal-50 text-teal-800 rounded-[12px] py-[10px] px-[16px] text-[14px] font-semibold flex justify-between items-center shadow-sm">
                    <span className="flex items-center gap-[12px]">
                      <button
                        onClick={handlePrevMonth}
                        className="border-none bg-transparent cursor-pointer text-[18px] hover:scale-110 transition-transform"
                      >
                        ‹
                      </button>
                      {formatMonthYear(currentMonth)}
                      <button
                        onClick={handleNextMonth}
                        className="border-none bg-transparent cursor-pointer text-[18px] hover:scale-110 transition-transform"
                      >
                        ›
                      </button>
                    </span>

                    <span
                      className="cursor-pointer text-[16px] hover:scale-110 transition-transform"
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      {showCalendar ? (
                        <UpOutlined className="text-[14px]" />
                      ) : (
                        <DownOutlined className="text-[14px]" />
                      )}
                    </span>
                  </div>

                  {/* Calendar Grid */}
                  <div className={`transition-all duration-300 overflow-hidden ${showCalendar ? "max-h-[300px] opacity-100 mt-[-10px]" : "max-h-0 opacity-0 m-0"}`}>
                    <div className="grid grid-cols-7 gap-y-[10px] gap-x-[4px] text-center text-[12px] p-[16px] rounded-b-[16px] bg-white border border-t-0 border-gray-100 shadow-sm mx-1">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                        <div key={d} className="font-bold text-gray-400">
                          {d}
                        </div>
                      ))}
                      {monthDays.map((day) => {
                        const isAppointment = appointmentDates.includes(
                          day?.toDateString(),
                        );
                        return (
                          <div
                            key={day.toISOString()}
                            className={`w-[32px] h-[32px] flex items-center justify-center mx-auto rounded-full text-center relative transition-colors cursor-pointer ${isAppointment ? "bg-teal-500 text-white font-bold shadow-md" : "bg-transparent text-gray-600 font-medium hover:bg-gray-100"}`}
                          >
                            {day.getDate()}
                            {isAppointment && (
                              <div className="w-[4px] h-[4px] bg-white rounded-full absolute bottom-[4px] left-1/2 -translate-x-1/2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Appointment Cards */}
                  <div className="flex flex-col gap-3">
                  {appointmentList &&
                    appointmentList
                      .filter(
                        (a) =>
                          a.date?.getMonth() === currentMonth?.getMonth() &&
                          a.date?.getFullYear() === currentMonth?.getFullYear(),
                      )
                      .map((appt, index) => {
                        const isSelected =
                          selectedAppointmentId === appt.id ||
                          (selectedAppointmentId === null && index === 0);

                        return (
                          <div
                            key={appt.id}
                            onClick={() => handleCardClick(appt)}
                            className={`flex gap-[16px] items-center rounded-[16px] p-[16px] cursor-pointer transition-all duration-300 border ${isSelected ? "bg-gradient-to-r from-[#007F5F] to-teal-500 text-white border-teal-500 shadow-md scale-[1.02]" : "bg-white text-gray-800 border-gray-100 hover:border-teal-200 hover:shadow-sm"}`}
                          >
                            {/* Date Box */}
                            <div className={`rounded-[12px] w-[50px] text-center py-[8px] px-[4px] flex flex-col justify-center items-center shadow-sm ${isSelected ? "bg-white/20 text-white" : "bg-teal-50 text-teal-700"}`}>
                              <div className="text-[12px] font-bold uppercase tracking-wider opacity-90">
                                {appt.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </div>
                              <div className="text-[20px] font-black leading-tight mt-[-2px]">
                                {appt.date.getDate()}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="grow">
                              <div className={`text-[15px] font-bold tracking-tight ${isSelected ? "text-white" : "text-gray-800"}`}>
                                {appt.doctor}
                              </div>
                              <div className={`text-[13px] font-medium mt-[2px] ${isSelected ? "text-teal-50" : "text-gray-500"}`}>
                                {appt.time}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

            </>
          )}

          {/* Care Taker Details */}
          {user?.user_role === "patient" && (
            <>
              <div className="w-full">
                <div className="w-full flex flex-row items-center justify-between">
                  <p className="text-left capitalize text-[#2E2E2E] text-[16px] font-medium">
                    Care Taker Details
                  </p>
                  <SecondaryBtn name="Send Message" onClick={() => {}} />
                </div>
                <div className="p-[20px] rounded-[16px] m-[20px] border-[1px] border-solid border-[#1B1B1B1A]">
                  <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center justify-center gap-[20px]">
                      <img
                        src={patientdetails}
                        alt="profile"
                        className="w-[64px] h-[64px] rounded-[12px] shrink-0 object-cover"
                      />
                      <div>
                        <p className="text-[#2E2E2E] font-medium opacity-60">
                          Name
                        </p>
                        <p className="text-[#2E2E2E] text-[18px] font-bold">
                          {careTeam.name || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#2E2E2E] font-medium opacity-60">
                        Role
                      </p>
                      <p className="text-[#2E2E2E] text-[18px] font-bold">
                        {careTeam.role || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#2E2E2E] font-medium opacity-60">
                        Contact Number
                      </p>
                      <p className="text-[#2E2E2E] text-[18px] font-bold">
                        {careTeam.contact || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#2E2E2E] font-medium opacity-60">
                        Assigned Since
                      </p>
                      <p className="text-[#2E2E2E] text-[18px] font-bold">
                        {/* {careTeam.contact || "N/A"} */}-
                      </p>
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10" />
                  <div>
                    <p className="text-[#2E2E2E] font-medium opacity-60">
                      Role
                    </p>
                    <p className="text-[#2E2E2E] text-[18px] font-bold">
                      {careTeam.specialization || "N/A"}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* My Reports - Patient */}
          {user?.user_role === "patient" && (
            <div className="w-full">
              <div className="p-[20px] rounded-[16px] bg-[#004E890A] border-[1px] border-solid border-[#004E89]">
                <div className="flex items-center justify-between">
                  <p className="text-[#2E2E2E] text-[16px] font-medium">
                    My Reports
                  </p>
                  <Primarybtn name="View Full Reports" onClick={() => {}} />
                </div>

                <div className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10" />

                {/* <div>
                            <p className="text-[#2E2E2E] text-[16px] font-semibold">
                              Medical Reports (Doctor Reports)
                            </p>
                            {[
                              {
                                text: "Patient stable, continue medication, BP to be checked daily.",
                                date: "Aug 15, 2025",
                                author: "Dr. Paul",
                              },
                              {
                                text: "Diabetes under control, advised diet adjustment.",
                                date: "Aug 15, 2025",
                                author: "Dr. Paul",
                              },
                            ].map((report, index) => (
                              <div
                                key={`med-${index}`}
                                className="flex flex-row items-center justify-between"
                              >
                                <p
                                  className="text-[#2E2E2E] text-[16px] font-medium"
                                >
                                  - {report.text}
                                </p>
                                <p
                                  className="text-[#2E2E2E] text-[16px] italic"
                                >
                                  {report.date} – {report.author}
                                </p>
                              </div>
                            ))}
                          </div>
              
                          <div
                            className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10"
                          />
              
                          <div>
                            <p className="text-[#2E2E2E] text-[16px] font-semibold">
                              Daily Reports (Submitted by Care Taker)
                            </p>
                            {[
                              {
                                text: "BP: 126/80 | Sugar: 112 | Temp: 36.7 | Status: ✅ Stable",
                                date: "Aug 16, 2025",
                                author: "Nurse Clarisse",
                              },
                              {
                                text: "BP: 150/92 | Status: ⚠ Escalated to Physician",
                                date: "Aug 16, 2025",
                                author: "Nurse Clarisse",
                              },
                            ].map((report, index) => (
                              <div
                                key={`daily-${index}`}
                                className="flex flex-row items-center justify-between"
                              >
                                <p
                                  className="text-[#2E2E2E] text-[16px] font-medium"
                                >
                                  - {report.text}
                                </p>
                                <p
                                  className="text-[#2E2E2E] text-[16px] italic"
                                >
                                  {report.date} – {report.author}
                                </p>
                              </div>
                            ))}
                          </div> */}
                <Empty description="no data" />
              </div>
            </div>
          )}

          {/* Appointment Details */}
          {user?.user_role === "patient" && (
            <div className="flex justify-center gap-[20px] w-full bg-[#F9FAFB] p-[20px] rounded-[10px]">
              {/* Left Section */}
              <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-[20px] w-[60%]">
                <SectionHeader title="Appointment Details" />
                <div className="relative ml-[20px] flex flex-col gap-[20px]">
                  <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-[#2E2E2E] opacity-10"></div>{" "}
                  {/* vertical line */}
                  {appointmentList.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-[15px] relative"
                    >
                      <div className="w-[12px] h-[12px] rounded-full bg-[#004E89] mt-[5px] shrink-0 z-[1]"></div>
                      <div className="bg-[#004E890A] border-[1px] border-solid border-[#E6E8EB] rounded-[10px] p-[15px] flex-1 gap-[16px]">
                        <div className="flex justify-between items-center mb-[-10]">
                          <p className="text-[12px] font-semibold mb-[8px] text-[#2E2E2E]">
                            {item.date}{" "}
                          </p>
                          <p>
                            {item.badge && (
                              <span className="bg-white text-[#2E2E2E] text-[12px] font-medium py-[2px] px-[8px] rounded-[6px] border-[1px] border-solid border-[#1B1B1B33] ml-[10px]">
                                {item.badge}
                              </span>
                            )}
                          </p>
                        </div>
                        {item.type && (
                          <p className="text-[14px] font-medium text-[#2E2E2E]">
                            Type:{" "}
                            <span className="text-[14px] font-medium text-[#06152B99]">
                              {item.type}
                            </span>
                          </p>
                        )}
                        {item.provider && (
                          <p className="text-[14px] font-medium text-[#2E2E2E]">
                            Assigned Provider:{" "}
                            <span className="text-[14px] font-medium text-[#06152B99]">
                              {item.provider}
                            </span>
                          </p>
                        )}
                        {item.status && (
                          <p className="text-[14px] font-medium text-[#2E2E2E]">
                            Status:{" "}
                            <span className="text-[14px] font-medium text-[#06152B99]">
                              {item.status}
                            </span>
                          </p>
                        )}
                        {item.checkin && (
                          <p className="text-[14px] font-medium text-[#2E2E2E]">
                            Check-in Status:{" "}
                            <span className="text-[14px] font-medium text-[#06152B99]">
                              {item.checkin}
                            </span>
                          </p>
                        )}
                        {item.vitals && (
                          <p className="text-[14px] font-medium text-[#2E2E2E]">
                            Vitals Recorded:{" "}
                            <span className="text-[14px] font-medium text-[#06152B99]">
                              {item.vitals}
                            </span>
                          </p>
                        )}
                        {item.comments && (
                          <p className="text-[14px] font-medium text-[#2E2E2E]">
                            Comments:{" "}
                            <span className="text-[14px] font-medium text-[#06152B99]">
                              {item.comments}
                            </span>
                          </p>
                        )}
                        {item.next && (
                          <p className="text-[14px] font-medium text-[#2E2E2E]">
                            Next Appointment:{" "}
                            <span className="text-[14px] font-medium text-[#06152B99]">
                              {item.next}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Section */}
              <div className="bg-white w-[300px] rounded-[10px] border-[1px] border-solid border-[#E5E7EB] p-[20px] flex flex-col gap-[15px] font-['Inter',sans-serif]">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <p className="text-[16px] font-medium text-[#1B1B1B]">
                    Upcoming Appointments
                  </p>
                  <span className="text-[14px] text-[#B38C1D] cursor-pointer">
                    View All
                  </span>
                </div>

                <div className="mb-[8px] border-t-[1px] border-solid border-[#E5E7EB]" />

                {/* Month Row */}
                <div className="bg-[#E8F0EA] rounded-[6px] py-[6px] px-[10px] text-[14px] flex justify-between items-center">
                  <span className="flex items-center gap-[8px]">
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

                {/* Calendar */}
                {showCalendar && (
                  <div className="grid grid-cols-7 gap-[4px] mt-[5px] text-center text-[12px]">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                      <div key={d} className="font-semibold">
                        {d}
                      </div>
                    ))}
                    {monthDays.map((day) => {
                      const isAppointment = appointmentDates.includes(
                        day?.toDateString(),
                      );
                      return (
                        <div
                          key={day.toISOString()}
                          className={`py-[4px] px-0 rounded-[4px] relative ${isAppointment ? "bg-[#FFF8E1]" : "bg-transparent"}`}
                        >
                          {day.getDate()}
                          {isAppointment && (
                            <div className="w-[5px] h-[5px] bg-[#B38C1D] rounded-full absolute bottom-[2px] left-1/2 -translate-x-1/2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {appointmentList &&
                  appointmentList
                    .filter(
                      (a) =>
                        a.date?.getMonth() === currentMonth?.getMonth() &&
                        a.date?.getFullYear() === currentMonth?.getFullYear(),
                    )
                    .map((appt, index) => {
                      const isSelected =
                        selectedAppointmentId === appt.id ||
                        (selectedAppointmentId === null && index === 0);

                      return (
                        <div
                          key={appt.id}
                          onClick={() => handleCardClick(appt)}
                          className={`group flex gap-[10px] items-center rounded-[8px] p-[10px] cursor-pointer transition-all duration-200 ${isSelected ? "bg-[#004C91] text-white" : "bg-[#F3F4F6] text-black hover:bg-[#004E89] hover:text-white"}`}
                        >
                          {/* Date Box */}
                          <div
                            className={`date-box rounded-[6px] w-[45px] text-center py-[5px] px-0 transition-colors duration-200 ${isSelected ? "bg-white text-black" : "bg-white text-black group-hover:bg-white group-hover:text-[#00396E]"}`}
                          >
                            <div className="text-[13px]">
                              {appt.date.toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </div>
                            <div className="text-[16px] font-semibold">
                              {appt.date.getDate()}
                            </div>
                          </div>

                          {/* Appointment Info */}
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
          )}

          {/* Medical History */}
          {user?.user_role === "care_taker" && (
            <div className="bg-white rounded-[12px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] w-full flex flex-col gap-[20px] min-w-0">
              <SectionHeader title="Medical History">
                <Primarybtn
                  name="Request Appointment"
                  onClick={() =>
                    navigate("/appointments", {
                      state: { openBookingModal: true },
                    })
                  }
                />
                <SecondaryBtn name="update membership" />
              </SectionHeader>

              <Table
                columns={columns}
                dataSource={medicalReports}
                pagination={{ pageSize: 5 }}
                // scroll={{ x: true }}
                bordered
                className="w-full"
              />
            </div>
          )}

          {/* Upcoming Appoinment */}
          {user?.user_role === "care_taker" && (
            <div className="grid grid-cols-[2fr_1fr] gap-[8px] w-full">
              <div className="bg-[#004E890A] w-auto border-[1px] border-solid border-[#004E89] rounded-[12px] p-[20px] h-full">
                <SectionHeader title="Recent Reports">
                  <Primarybtn
                    name="View Full History"
                    onClick={() => navigate("/my_reports")}
                  />
                </SectionHeader>

                <div>
                  <p className="m-0 py-[8px] px-0 border-b-[1px] border-solid border-[#D0D5DD]">
                    Aug 15, 2025: Vitals stable. Patient doing well.
                  </p>
                  <p className="m-0 py-[8px] px-0 border-b-[1px] border-solid border-[#D0D5DD]">
                    Aug 14, 2025: High BP noted. Escalated to physician.
                  </p>
                  <p className="m-0 py-[8px] px-[0px]">
                    Aug 10, 2025: Virtual consult with Dr. Paul completed.
                  </p>
                </div>
              </div>

              {/* right */}
              <div className="p-[20px] flex flex-col">
                <div className="bg-white w-[300px] rounded-[10px] border-[1px] border-solid border-[#E5E7EB] p-[20px] flex flex-col gap-[15px] font-['Inter',sans-serif]">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <p className="text-[16px] font-medium text-[#1B1B1B]">
                      Upcoming Appointments
                    </p>
                    <span className="text-[14px] text-[#B38C1D] cursor-pointer">
                      View All
                    </span>
                  </div>

                  <div className="mb-[8px] border-t-[1px] border-solid border-[#E5E7EB]" />

                  {/* Month Row */}
                  <div className="bg-[#E8F0EA] rounded-[6px] py-[6px] px-[10px] text-[14px] flex justify-between items-center">
                    <span className="flex items-center gap-[8px]">
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

                  {/* Calendar */}
                  {showCalendar && (
                    <div className="grid grid-cols-7 gap-[4px] mt-[-15px] text-center text-[12px] p-[10px] rounded-br-[8px] rounded-bl-[8px] bg-[#007F5F14]">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                        <div key={d} className="font-semibold">
                          {d}
                        </div>
                      ))}
                      {monthDays.map((day) => {
                        const isAppointment = appointmentDates.includes(
                          day?.toDateString(),
                        );
                        return (
                          <div
                            key={day.toISOString()}
                            className={`py-[4px] px-0 rounded-[6px] text-center transition-colors duration-300 relative ${isAppointment ? "bg-gradient-to-b from-[#B78520] to-[#F0C330] text-white font-semibold" : "bg-transparent text-inherit font-normal"}`}
                          >
                            {day.getDate()}
                            {isAppointment && (
                              <div className="w-[5px] h-[5px] bg-[#B38C1D] rounded-full absolute bottom-[2px] left-1/2 -translate-x-1/2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Appointment Cards */}
                  {appointmentList &&
                    appointmentList
                      .filter(
                        (a) =>
                          a.date?.getMonth() === currentMonth?.getMonth() &&
                          a.date?.getFullYear() === currentMonth?.getFullYear(),
                      )
                      .map((appt, index) => {
                        const isSelected =
                          selectedAppointmentId === appt.id ||
                          (selectedAppointmentId === null && index === 0);

                        return (
                          <div
                            key={appt.id}
                            onClick={() => handleCardClick(appt)}
                            className={`group flex gap-[10px] items-center rounded-[8px] p-[10px] cursor-pointer transition-all duration-200 ${isSelected ? "bg-[#004C91] text-white" : "bg-[#F3F4F6] text-black hover:bg-[#004E89] hover:text-white"}`}
                          >
                            {/* Date Box */}
                            <div
                              className={`date-box rounded-[6px] w-[45px] text-center py-[5px] px-0 transition-colors duration-200 ${isSelected ? "bg-white text-black" : "bg-white text-black group-hover:bg-white group-hover:text-[#00396E]"}`}
                            >
                              <div className="text-[13px]">
                                {appt.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </div>
                              <div className="text-[16px] font-semibold">
                                {appt.date.getDate()}
                              </div>
                            </div>

                            {/* Appointment Info */}
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
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, children }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-[10px] min-w-0">
      <p className="text-[16px] font-semibold text-[#1B1B1B]">{title}</p>
      <div className="flex gap-[10px] flex-wrap">{children}</div>
    </div>
  );
}

/* 🔹 Info Item (label + value) */
function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[#6B7280] text-[14px] font-medium mb-[3px] break-words">
        {label}
      </p>
      <p className="text-[16px] font-semibold text-[#2E2E2E] break-words">
        {value}
      </p>
    </div>
  );
}

/* 🔹 Styles */
