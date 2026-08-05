/* eslint-disable no-unused-vars */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { careTeamService } from "../../services/careTeamService";
import { appointmentsService } from "../../services/appointmentsService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { base_url } from "../../constants/constants";

import { Empty, message, Table, Avatar } from "antd";
const actions = [
  {
    date: "Aug 15, 2025 — 10:00 AM",
    title: "Vitals Submitted → BP 128/78, Sugar 110, Temp 36.8",
    note: "Patient stable, no issues. Continue medication as prescribed.",
  },
  {
    date: "Aug 10, 2025 — 4:00 PM",
    title: "Follow-up Recorded → Virtual consult with Dr. Paul completed",
    note: "BP slightly elevated. Physician adjusted dosage.",
  },
  {
    date: "July 25, 2025 — 9:00 PM",
    title: "Emergency Report → High sugar, IV fluids administered",
    note: "Patient stabilized. Physician informed.",
  },
];

export default function CareTeam() {
  const token = localStorage.getItem("token");

  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  if (!user) {
    window.location.href = "/";
  }

  const [selectedPatientId, setSelectedPatientId] = React.useState(() =>
    localStorage.getItem("selectedPatientId")
  );

  React.useEffect(() => {
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

  const [fallbackPatientId, setFallbackPatientId] = React.useState(null);

  React.useEffect(() => {
    if (user?.user_role === "sponsor" && !selectedPatientId) {
      const fetchPatients = async () => {
        try {
          const storedSponsorId = localStorage.getItem("sponsorProfileId");
          if (!storedSponsorId) return;
          const res = await fetch(`${base_url}/sponsorid_patientprofile_list/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ sponsorid: Number(storedSponsorId) }),
          });
          const patients = await res.json();
          if (patients && patients.length > 0) {
            setFallbackPatientId(patients[0].id);
          }
        } catch (error) {
          console.error("Error fetching fallback patient for Care Team:", error);
        }
      };
      fetchPatients();
    }
  }, [user, selectedPatientId, token]);

  const profileId = 
    user?.user_role === "sponsor" 
      ? Number(selectedPatientId || fallbackPatientId) 
      : user?.profile_id;

  const { data: caretakers = [], isLoading } = useQuery({
    queryKey: ["allCaretakers"],
    queryFn: async () => {
      const res = await appointmentsService.getCaretakers();
      return Array.isArray(res) ? res : [];
    },
    enabled: !!token,
  });

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-[10px]">
          <Avatar src={record.caretaker_profile || record.user?.profile_picture || patientdetails} />
          <span className="font-medium text-[#1B1B1B]">
            {record.user?.first_name} {record.user?.last_name}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.user?.email || "N/A",
    },
    {
      title: "Phone",
      key: "phone",
      render: (_, record) => record.user?.phone || record.contact || "N/A",
    },
    {
      title: "Experience",
      dataIndex: "caretaker_exprience",
      key: "experience",
      render: (exp) => exp ? `${exp} Years` : "N/A",
    },
    {
      title: "Specialization",
      dataIndex: "skillset",
      key: "skillset",
      render: (val) => val || "N/A",
    },
  ];

  return (
    <div
      className="flex h-screen bg-[#F7F9FB]"
    >
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        {/* Content Area */}
        <div className="flex flex-col w-full bg-[#F9FAFB] rounded-[10px] p-[20px] overflow-auto">
          <div className="bg-white rounded-[12px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col gap-[16px]">
            <SectionHeader title="Available Care Takers" />
            <Table
              columns={columns}
              dataSource={caretakers}
              rowKey={(record) => record.id || record.user?.id}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              bordered
              className="w-full"
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Section Header */
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

/* 🔹 Info Item (label + value) */
function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[#6B7280] text-[13px] font-medium mb-[4px] whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </p>
      <p className="text-[15px] font-bold text-[#1B1B1B]">
        {value}
      </p>
    </div>
  );
}
