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
    <div
      className="flex h-screen bg-[#F7F9FB]"
    >
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-[20px] overflow-y-auto gap-[20px] flex flex-col items-center overflow-x-hidden">
          {/* Appointment Cards */}
          <div className="w-full">
            {/* <div
              className="flex items-center justify-between"
            >
            {doctorAppointments.length > 3 && !loading && (
              <div className="text-center mt-[16px]">
                {hasMore ? (
                  <button
                    onClick={showMore}
                    className="bg-transparent text-[#004E89] border-[1px] border-solid border-[#004E89] py-[8px] px-[16px] rounded-[8px] cursor-pointer"
                  >
                    Show More
                  </button>
                ) : (
                  <button
                    onClick={showLess}
                    className="bg-transparent text-[#004E89] border-[1px] border-solid border-[#004E89] py-[8px] px-[16px] rounded-[8px] cursor-pointer"
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="w-full">
            {/* Appointment Table */}
            <div className="bg-white rounded-[12px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] w-full min-w-0">
              <SectionHeader title="Appointment List">
                <div
                  className="flex items-center justify-center gap-[12px]"
                >
                  <DatePicker
                    picker="year"
                    defaultValue={dayjs("2025", "YYYY")}
                    suffixIcon={<CalendarOutlined />}
                    className="w-[100px]"
                  />
                  <Primarybtn icon={<FilterOutlined />} name="Filter" />
                </div>
              </SectionHeader>

              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered={false}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


