import React, { useState, useEffect, useMemo } from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import { Button, Table, Spin, Empty, Tag, Card, Divider, DatePicker } from "antd";
import { DownloadOutlined, FilePdfOutlined, CalendarOutlined, FileImageOutlined, FileTextOutlined, AudioOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { myLovedOnesService } from "../../services/myLovedOnesService";
import { base_url, isAdminUser } from "../../constants/constants";
import {
  filterSponsorAppointments,
  filterSponsorPatients,
  getStoredSponsorProfileId,
  persistSponsorProfile,
  resolveSponsorProfileFromList,
  toValidId,
} from "../../utils/sponsorIsolation";
import dayjs from "dayjs";

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

const getFileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrlStripped = base_url.replace(/\/+$/, "");
  const relativeUrlStripped = url.replace(/^\/+/, "");
  return `${baseUrlStripped}/${relativeUrlStripped}`;
};

export default function MyReports() {
  const [selectedPatientId, setSelectedPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [filterDate, setFilterDate] = useState(null);

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

  const cleanedPatientId = toValidId(selectedPatientId);
  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw && raw !== "undefined" && raw !== "null"
        ? JSON.parse(raw)
        : null;
    } catch {
      return null;
    }
  }, []);
  const isAdmin = isAdminUser(user);
  const isSponsor = user?.user_role === "sponsor" && !isAdmin;

  const storedSponsorId = isSponsor ? getStoredSponsorProfileId() : null;

  const { data: sponsorProfilesList = [] } = useQuery({
    queryKey: ["sponsorProfiles", user?.id],
    queryFn: async () => {
      const res = await myLovedOnesService.getSponsorProfiles();
      return Array.isArray(res) ? res : [];
    },
    enabled: !!token && isSponsor && !storedSponsorId,
  });

  const matchedSponsorProfile = useMemo(
    () =>
      isSponsor ? resolveSponsorProfileFromList(sponsorProfilesList, user) : null,
    [isSponsor, sponsorProfilesList, user],
  );

  const resolvedSponsorId = useMemo(
    () =>
      isSponsor
        ? storedSponsorId || toValidId(matchedSponsorProfile?.id)
        : null,
    [isSponsor, storedSponsorId, matchedSponsorProfile],
  );

  useEffect(() => {
    if (isSponsor && matchedSponsorProfile) {
      persistSponsorProfile(matchedSponsorProfile);
    }
  }, [isSponsor, matchedSponsorProfile]);

  const {
    data: sponsorPatients = [],
    isSuccess: isSponsorPatientsLoaded,
  } = useQuery({
    queryKey: ["sponsorPatients", resolvedSponsorId],
    queryFn: async () => {
      const res = await myLovedOnesService.getSponsorPatients(resolvedSponsorId);
      return filterSponsorPatients(
        Array.isArray(res) ? res : [],
        resolvedSponsorId,
        true,
      );
    },
    enabled: !!token && isSponsor && !!resolvedSponsorId,
  });

  const ownedPatientIds = useMemo(
    () =>
      (Array.isArray(sponsorPatients) ? sponsorPatients : [])
        .map((p) => toValidId(p?.id))
        .filter(Boolean),
    [sponsorPatients],
  );

  const isPatientAuthorized = !isSponsor
    ? true
    : Boolean(cleanedPatientId && ownedPatientIds.includes(cleanedPatientId));

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: [
      "lovedOnesMedicalHistory",
      cleanedPatientId,
      isSponsor ? resolvedSponsorId : "all",
    ],
    queryFn: async () => {
      const data = await myLovedOnesService.getPatientAppointments(cleanedPatientId);
      const list = Array.isArray(data) ? data : [];
      return isSponsor
        ? filterSponsorAppointments(list, resolvedSponsorId, ownedPatientIds)
        : list;
    },
    enabled:
      !!cleanedPatientId &&
      !!token &&
      (!isSponsor || (isSponsorPatientsLoaded && isPatientAuthorized)),
  });

  // Filter appointments that have files or notes
  let reportsWithFiles = appointments.filter((item) => {
    return (
      item.doc_reports ||
      item.results_records ||
      item.diagnostic_images ||
      item.voice_notes ||
      item.doctor_notes
    );
  });

  // Apply date filter
  if (filterDate) {
    reportsWithFiles = reportsWithFiles.filter((item) => {
      if (!item.appointment_date) return false;
      return dayjs(item.appointment_date).isSame(filterDate, "day");
    });
  }

  const renderFileLink = (url, label, icon) => {
    if (!url) return null;
    return (
      <a 
        href={getFileUrl(url)} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#004E89] hover:text-[#003B6B] bg-[#F0F7FF] px-3 py-2 rounded-lg font-medium transition-colors w-fit border border-[#004E8933]"
      >
        {icon} {label}
      </a>
    );
  };

  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0">
          <Header />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-[20px] lg:p-[30px] flex flex-col gap-[24px]">
          
          <div className="bg-white rounded-[16px] p-[24px] shadow-sm border border-[#E5E7EB]">
            <SectionHeader title="Medical Reports & Files">
              <div className="flex items-center gap-2">
                <DatePicker 
                  onChange={(date) => setFilterDate(date)} 
                  value={filterDate}
                  placeholder="Filter by Date"
                  className="h-[38px] rounded-[10px] border-[#CBD5E1]"
                />
                {filterDate && (
                  <Button 
                    onClick={() => setFilterDate(null)}
                    className="h-[38px] rounded-[10px] border-[#CBD5E1] text-[#004E89]"
                  >
                    View All
                  </Button>
                )}
              </div>
            </SectionHeader>
            <Divider className="my-[16px]" />

            {isLoading ? (
              <div className="flex justify-center p-12">
                <Spin size="large" />
              </div>
            ) : reportsWithFiles.length === 0 ? (
              <div className="p-12">
                <Empty description="No doctor reports or files available for this patient." />
              </div>
            ) : (
              <div className="flex flex-col gap-[20px]">
                {reportsWithFiles.map((appt, i) => (
                  <Card 
                    key={i} 
                    className="border border-[#E5E7EB] shadow-sm rounded-[16px] overflow-hidden hover:shadow-md transition-shadow"
                    bodyStyle={{ padding: "0" }}
                  >
                    {/* Header: Doctor & Date */}
                    <div className="bg-[#004E890A] px-[24px] py-[16px] border-b border-[#004E891A] flex justify-between items-center">
                      <div className="flex items-center gap-[12px]">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#004E89] flex items-center justify-center text-white font-bold text-[16px]">
                          {appt.doc?.user?.first_name?.charAt(0) || "D"}
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-[#1F2937] m-0 leading-tight">
                            Dr. {appt.doc?.user?.first_name} {appt.doc?.user?.last_name}
                          </p>
                          <p className="text-[13px] text-[#6B7280] m-0">
                            {appt.appointment_type || "General Consultation"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-semibold text-[#374151] m-0">
                          {appt.appointment_date}
                        </p>
                        <p className="text-[13px] text-[#6B7280] m-0">
                          {appt.appointment_time}
                        </p>
                      </div>
                    </div>

                    {/* Content: Notes and Files */}
                    <div className="p-[24px]">
                      {appt.doctor_notes && (
                        <div className="mb-[20px]">
                          <p className="text-[14px] font-semibold text-[#4B5563] mb-[8px] flex items-center gap-2">
                            <FileTextOutlined /> Doctor's Notes
                          </p>
                          <div className="bg-[#F9FAFB] p-[16px] rounded-[10px] border border-[#F3F4F6] text-[#374151] text-[15px] leading-relaxed whitespace-pre-wrap">
                            {appt.doctor_notes}
                          </div>
                        </div>
                      )}

                      {/* Attached Files Section */}
                      {(appt.doc_reports || appt.results_records || appt.diagnostic_images || appt.voice_notes) && (
                        <div>
                          <p className="text-[14px] font-semibold text-[#4B5563] mb-[12px]">Attached Files</p>
                          <div className="flex flex-wrap gap-[12px]">
                            {renderFileLink(appt.doc_reports, "Medical Report", <FilePdfOutlined />)}
                            {renderFileLink(appt.results_records, "Lab Results", <FilePdfOutlined />)}
                            {renderFileLink(appt.diagnostic_images, "Diagnostic Image", <FileImageOutlined />)}
                            {renderFileLink(appt.voice_notes, "Voice Note", <AudioOutlined />)}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

