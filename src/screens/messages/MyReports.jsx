import React, { useState, useEffect, useMemo } from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import { Button, Table, Spin, Empty, Tag, Card, Divider, DatePicker } from "antd";
import { DownloadOutlined, FilePdfOutlined, CalendarOutlined, FileImageOutlined, FileTextOutlined, AudioOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { myLovedOnesService } from "../../services/myLovedOnesService";
import { doctorFormService } from "../../services/doctorFormService";
import { isAdminUser, resolveMediaUrl } from "../../constants/constants";
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

const getFileUrl = (url) => resolveMediaUrl(url, null);

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

  const { data: appointments = [], isLoading: isAppointmentsLoading } = useQuery({
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

  const { data: doctorReports = [], isLoading: isDoctorReportsLoading } = useQuery({
    queryKey: [
      "doctorReports",
      cleanedPatientId,
      isSponsor ? resolvedSponsorId : "all",
    ],
    queryFn: async () => {
      const data = await doctorFormService.getDoctorReports();
      return Array.isArray(data) ? data : [];
    },
    enabled:
      !!cleanedPatientId &&
      !!token &&
      (!isSponsor || (isSponsorPatientsLoaded && isPatientAuthorized)),
  });

  const isLoading = isAppointmentsLoading || isDoctorReportsLoading;

  const combinedReports = useMemo(() => {
    const apptReports = (Array.isArray(appointments) ? appointments : [])
      .filter(
        (item) =>
          item.doc_reports ||
          item.results_records ||
          item.diagnostic_images ||
          item.voice_notes ||
          item.doctor_notes ||
          (Array.isArray(item.documents) && item.documents.length > 0),
      )
      .map((item) => ({
        ...item,
        _cardKey: `appt-${item.id}`,
      }));

    const submittedDoctorReports = (Array.isArray(doctorReports) ? doctorReports : [])
      .filter((r) => toValidId(r?.patient) === cleanedPatientId)
      .map((r) => {
        const vitalsSummary = [
          r.bp && r.bp !== "N/A" ? `BP: ${r.bp}` : null,
          r.heart_rate && r.heart_rate !== "N/A" ? `HR: ${r.heart_rate}` : null,
          r.sugar && r.sugar !== "N/A" ? `Sugar: ${r.sugar}` : null,
          r.oxygen && r.oxygen !== "N/A" ? `O2: ${r.oxygen}` : null,
          r.temperature && r.temperature !== "N/A" ? `Temp: ${r.temperature}` : null,
          r.respiratory_rate && r.respiratory_rate !== "N/A"
            ? `RR: ${r.respiratory_rate}`
            : null,
          r.weight && r.weight !== "N/A" ? `Weight: ${r.weight}` : null,
        ]
          .filter(Boolean)
          .join(" | ");
        const combinedNotes = [
          r.doctor_notes,
          vitalsSummary ? `Vitals Recorded: ${vitalsSummary}` : null,
        ]
          .filter(Boolean)
          .join("\n\n");
        const visitDate =
          (r.initial_visit && dayjs(r.initial_visit).isValid()
            ? dayjs(r.initial_visit).format("YYYY-MM-DD")
            : null) ||
          (r.uploaded_at && dayjs(r.uploaded_at).isValid()
            ? dayjs(r.uploaded_at).format("YYYY-MM-DD")
            : "");
        const visitTime =
          r.uploaded_at && dayjs(r.uploaded_at).isValid()
            ? dayjs(r.uploaded_at).format("hh:mm A")
            : "";
        return {
          ...r,
          _cardKey: `doc-report-${r.id}`,
          doctor_display_name: r.doctor_name || "VeriMED Physician",
          appointment_type: "Doctor Visit Report",
          appointment_date: visitDate || r.initial_visit || "",
          appointment_time: visitTime,
          doctor_notes: combinedNotes || r.doctor_notes || "",
          documents: Array.isArray(r.documents) ? r.documents : [],
        };
      });

    return [...submittedDoctorReports, ...apptReports];
  }, [appointments, doctorReports, cleanedPatientId]);

  let reportsWithFiles = combinedReports;

  // Apply date filter
  if (filterDate) {
    reportsWithFiles = reportsWithFiles.filter((item) => {
      if (!item.appointment_date || !dayjs(item.appointment_date).isValid()) {
        return false;
      }
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
                {reportsWithFiles.map((appt, i) => {
                  const rawDocName =
                    appt.doctor_display_name ||
                    [appt.doc?.user?.first_name, appt.doc?.user?.last_name]
                      .filter(Boolean)
                      .join(" ");
                  const formattedDoctorTitle = rawDocName
                    ? /^dr\.?\s/i.test(rawDocName) || rawDocName === "VeriMED Physician"
                      ? rawDocName
                      : `Dr. ${rawDocName}`
                    : "VeriMED Physician";
                  return (
                  <Card 
                    key={appt._cardKey || i} 
                    className="border border-[#E5E7EB] shadow-sm rounded-[16px] overflow-hidden hover:shadow-md transition-shadow"
                    bodyStyle={{ padding: "0" }}
                  >
                    {/* Header: Doctor & Date */}
                    <div className="bg-[#004E890A] px-[24px] py-[16px] border-b border-[#004E891A] flex justify-between items-center">
                      <div className="flex items-center gap-[12px]">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#004E89] flex items-center justify-center text-white font-bold text-[16px]">
                          {(rawDocName || "D").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-[#1F2937] m-0 leading-tight">
                            {formattedDoctorTitle}
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
                      {(appt.doc_reports ||
                        appt.results_records ||
                        appt.diagnostic_images ||
                        appt.voice_notes ||
                        (Array.isArray(appt.documents) &&
                          appt.documents.length > 0)) && (
                        <div>
                          <p className="text-[14px] font-semibold text-[#4B5563] mb-[12px]">Attached Files</p>
                          <div className="flex flex-wrap gap-[12px]">
                            {renderFileLink(appt.doc_reports, "Medical Report", <FilePdfOutlined />)}
                            {renderFileLink(appt.results_records, "Lab Results", <FilePdfOutlined />)}
                            {renderFileLink(appt.diagnostic_images, "Diagnostic Image", <FileImageOutlined />)}
                            {renderFileLink(appt.voice_notes, "Voice Note", <AudioOutlined />)}
                            {Array.isArray(appt.documents) &&
                              appt.documents.map((doc, idx) =>
                                renderFileLink(
                                  doc.view_link || doc.download_link || doc.file,
                                  doc.filename?.split("/").pop() ||
                                    doc.name ||
                                    `Report Document ${idx + 1}`,
                                  <FilePdfOutlined />,
                                ),
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

