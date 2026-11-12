/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { myAppointmentsService } from "../../services/myAppointmentsService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import Primarybtn from "../../components/common/PrimaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { Button, DatePicker, Table, Spin, message } from "antd";
import { CalendarOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { base_url } from "../../constants/constants";
import apiClient from "../../services/apiClient";


function SectionHeader({ title, children }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-[10px] min-w-0">
      <p className="text-[16px] font-semibold text-[#1B1B1B]">{title}</p>
      <div className="flex gap-[10px] flex-wrap">
        {children}
      </div>
    </div>
  );
}

export default function MyAppointments() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedYear, setSelectedYear] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const data = localStorage.getItem("userData");
  const user =
    data && data !== "undefined" && data !== "null" ? JSON.parse(data) : null;
  if (!user) {
    window.location.href = "/";
  }
  const { appointmentData } = location.state || {};

  const [doctorId, setDoctorId] = useState(() => {
    try {
      const doctorDataRaw = localStorage.getItem("doctorData");
      if (
        doctorDataRaw &&
        doctorDataRaw !== "undefined" &&
        doctorDataRaw !== "null"
      ) {
        return JSON.parse(doctorDataRaw)?.id || null;
      }
    } catch {
      return null;
    }
    return null;
  });

  useEffect(() => {
    if (!token || doctorId || user?.user_role !== "doctor") return;
    let isMounted = true;
    const resolveDoctorProfile = async () => {
      try {
        const res = await apiClient.get("/doctorprofile_list/");
        const list = Array.isArray(res.data) ? res.data : [];
        const matched = list.find((doc) => doc?.user?.id === user?.id);
        if (matched && isMounted) {
          localStorage.setItem("doctorData", JSON.stringify(matched));
          setDoctorId(matched.id || null);
        }
      } catch (err) {
        console.error("Error resolving doctor profile:", err);
      }
    };
    resolveDoctorProfile();
    return () => {
      isMounted = false;
    };
  }, [token, doctorId, user?.id, user?.user_role]);

  const { data: doctorAppointments = [], isLoading: loading } = useQuery({
    queryKey: ["doctorAppointments", doctorId],
    queryFn: async () => {
      const data = await myAppointmentsService.getDoctorAppointments(doctorId);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!doctorId && !!token,
  });

  const filteredAppointments = selectedYear
    ? doctorAppointments.filter(
        (appt) =>
          appt?.appointment_date &&
          dayjs(appt.appointment_date).year() === selectedYear.year(),
      )
    : doctorAppointments;

  const showMore = () =>
    setVisibleCount((prev) => Math.min(prev + 3, filteredAppointments.length));
  const showLess = () => setVisibleCount(3);
  const hasMore = visibleCount < filteredAppointments.length;

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
            className="py-[4px] px-[10px] rounded-[6px] font-medium border border-solid"
            style={{
              color,
              borderColor: color,
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
          className="text-[#D97706] font-semibold cursor-pointer"
          onClick={() =>
            navigate("/view_patient_details", {
              state: { appointmentData: filteredAppointments[record.key] },
            })
          }
        >
          View Details
        </span>
      ),
    },
  ];

  // Map API data for Table
  const dataSource = filteredAppointments.map((appt, index) => {
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
        [appt?.caretaker?.user?.first_name, appt?.caretaker?.user?.last_name]
          .filter(Boolean)
          .join(" ") || "-",
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
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden">
      <div className="w-[240px] shrink-0 bg-white border-r border-[#E5E7EB]">
        <Sider />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="shrink-0 bg-white border-b border-[#E5E7EB]">
          <Header />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-[16px] lg:p-[24px]">
          <div className="w-full flex flex-col gap-[20px] box-border">
            {/* Back Button */}
            <div className="flex items-center">
              <BackButton fallbackPath="/overview" />
            </div>

            {/* Appointment Table Card */}
            <div className="bg-white rounded-[16px] p-[20px] lg:p-[24px] shadow-sm border border-[#E5E7EB]  min-w-0">
              <SectionHeader title="Appointment List">
                <div className="flex items-center justify-center gap-[12px] flex-wrap">
                  <DatePicker
                    picker="year"
                    value={selectedYear}
                    onChange={(val) => setSelectedYear(val)}
                    allowClear
                    placeholder="All Years"
                    suffixIcon={<CalendarOutlined />}
                    className="w-[115px]"
                  />
                  <Primarybtn icon={<FilterOutlined />} name="Filter" />
                  <Primarybtn
                    icon={<PlusOutlined />}
                    name="Request Appointment"
                    onClick={() =>
                      navigate("/appointments", {
                        state: { openBookingModal: true },
                      })
                    }
                  />
                </div>
              </SectionHeader>

              <div className="overflow-x-auto w-full mt-[16px]">
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  bordered={false}
                  className="w-full"
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

