/* eslint-disable no-unused-vars */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { careTeamService } from "../../services/careTeamService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { base_url } from "../../constants/constants";

import { Empty, message } from "antd";
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

  const { data: appointments = [] } = useQuery({
    queryKey: ["patientAppointments", profileId],
    queryFn: async () => {
      const res = await careTeamService.getPatientAppointments(profileId);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!profileId && !!token,
  });

  const vitalsData = appointments.length > 0 ? appointments[0] : null;
  const patientData = vitalsData?.patient || null;

  const careTeam = vitalsData
    ? {
        name:
          vitalsData.caretaker?.caretaker_id ||
          `${vitalsData.caretaker?.user || ""}` ||
          "N/A",
        role: "Caretaker",
        contact: vitalsData.caretaker?.contact || "N/A",
        nextVisit: vitalsData.appointment_date || "N/A",
        frequency: "Weekly",
        specialization: vitalsData.caretaker?.skillset || "General Care",
        experience: vitalsData.caretaker?.caretaker_exprience || "N/A",
        languages: vitalsData.caretaker?.languages || "N/A",
      }
    : {};

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
        <div
          className="flex flex-col justify-between w-full bg-[#F9FAFB] rounded-[10px]"
        >
          <div className="bg-transparent border-[1px] border-solid border-[#E5E7EB] rounded-[10px] p-[20px] m-[20px] font-sans">
            {/* Header Row */}
            <div className="flex justify-between items-center mb-[16px]">
              <h3 className="text-[16px] font-medium m-0 text-[#2E2E2E]">
                Care Team Details
              </h3>

              <SecondaryBtn name="view reports" onClick={() => {}} />
            </div>
            <div className="mb-[16px] border-t border-solid border-[#E5E7EB]" />

            {/* Content Row */}
            <div className="flex gap-[16px]">
              {/* Left - Avatar */}
              <img
                src={careTeam?.avatar || patientdetails}
                alt="Profile"
                className="w-[60px] h-[60px] rounded-[12px] shrink-0 object-cover"
              />

              {/* Right - Info Grid */}
              <div className="flex-1 flex flex-col gap-[14px]">
                {/* Row 1 */}
                <div className="grid grid-cols-[repeat(5,1fr)] gap-[10px]">
                  <div>
                    <div className="text-[13px] text-[#6B7280]">
                      Name
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#6B7280]">
                      Role
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.role || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#6B7280]">
                      Experience
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.Experience || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#6B7280]">
                      Languages
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.Languages || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] text-[#6B7280]">
                      Contact Number
                    </div>
                    <div className="text-[14px] font-medium">
                      {careTeam.Contact || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-solid border-[#E5E7EB]" />

                {/* Row 3 */}
                <div>
                  <div className="text-[13px] text-[#6B7280]">
                    Specialization
                  </div>
                  <div className="text-[14px] font-medium">
                    {careTeam.specialization || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-[2fr_1fr] gap-[20px] overflow-y-auto p-[20px] min-w-0">
            {/* LEFT SIDE - Latest Actions by Care Taker (kept same) */}
            <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-[20px] min-w-0 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <SectionHeader title="Latest Actions by Care Taker">
                <p className="text-[14px] font-semibold text-[#007F5F] cursor-pointer">
                  View All
                </p>
              </SectionHeader>

              <div className="relative ml-[20px] flex flex-col gap-[20px]">
                <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-[#2E2E2E] opacity-10"></div>

                {/* {actions.map((action, index) => (
                  <div key={index} style={timelineItem}>
                    <div style={timelineDot}></div>
                    <div style={timelineContent}>
                      <p style={apptDate}>{action.date}</p>
                      <p
                        className="text-[14px] font-semibold text-[#2E2E2E]"
                      >
                        {action.title}
                      </p>
                      <p
                        className="text-[14px] text-[#6B7280] mt-[4px]"
                      >
                        <strong>Care Taker Note:</strong> {action.note}
                      </p>
                    </div>
                  </div>
                ))} */}
                <Empty description="no data" />
              </div>
            </div>

            {/* 
          Right panel */}
            <div className="bg-transparent rounded-[12px] p-[20px] flex flex-col border border-solid border-[#007F5F4D]">
              <SectionHeader title="Health Monitoring Snapshot">
                <p className="text-[14px] font-semibold text-[#B78520] cursor-pointer">
                  View All
                </p>
              </SectionHeader>

              {/* {[
                {
                  date: "Aug 15, 2025 — 10:00 AM",
                  vitals: {
                    "Blood Pressure": "128/78",
                    "Blood Sugar": "110",
                    Temperature: "36.8°C",
                    Oxygen: "95%",
                    "Heart Rate": "78 bpm",
                    Weight: "70 kg",
                  },
                },
                {
                  date: "Aug 14, 2025 — 10:00 AM",
                  vitals: {
                    "Blood Pressure": "130/80",
                    "Blood Sugar": "112",
                    Temperature: "36.7°C",
                    Oxygen: "96%",
                    "Heart Rate": "76 bpm",
                    Weight: "70 kg",
                  },
                },
              ].map((snapshot, idx, arr) => (
                <div
                  key={idx}
                  style={{
                    ...timelineBox,
                    borderBottom:
                      idx === arr.length - 1 ? "none" : "1px solid #007F5F4D",
                  }}
                >
                  <div
                    className="flex flex-col gap-[8px]"
                  >
                    <div style={vitalsGrid}>
                      {Object.entries(snapshot.vitals).map(
                        ([label, value], i) => (
                          <div
                            key={i}
                            className="flex items-center gap-[4px]"
                          >
                            <p
                              className="m-0 text-[14px] text-[#6B7280] font-medium whitespace-nowrap overflow-hidden" style={{ textOverflow: "ellipsis" }}
                            >
                              {label}
                            </p>
                            :{" "}
                            <span
                              className="text-[14px] font-semibold text-[#1B1B1B]"
                            >
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <p style={timelineDateRight}>
                      Last Update: {snapshot.date}
                    </p>
                  </div>
                </div>
              ))} */}
              <Empty description="no data" />
            </div>
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
