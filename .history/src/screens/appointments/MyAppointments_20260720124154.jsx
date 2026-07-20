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
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { base_url } from "../../constants/constants";
import axios from "axios";

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
  const navigate = useNavigate();
  const location = useLocation();
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

  const { data: doctorAppointments = [], isLoading: loading } = useQuery({
    queryKey: ["doctorAppointments", doctorId],
    queryFn: async () => {
      const data = await myAppointmentsService.getDoctorAppointments(doctorId);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!doctorId && !!token,
  });

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
            <div className="bg-white rounded-[16px] p-[20px] lg:p-[24px] shadow-sm border border-[#E5E7EB] w-full min-w-0">
              <SectionHeader title="Appointment List">
                <div className="flex items-center justify-center gap-[12px]">
                  <DatePicker
                    picker="year"
                    defaultValue={dayjs("2025", "YYYY")}
                    suffixIcon={<CalendarOutlined />}
                    className="w-[100px]"
                  />
                  <Primarybtn icon={<FilterOutlined />} name="Filter" />
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

