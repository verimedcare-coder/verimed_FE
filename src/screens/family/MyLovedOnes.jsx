/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { myLovedOnesService } from "../../services/myLovedOnesService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import Primarybtn from "../../components/common/PrimaryBtn";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import bloodPressure from "../../assets/icons/blood-pressure.svg";
import heartRate from "../../assets/icons/heart-rate.svg";
import oxygen from "../../assets/icons/oxygen.svg";
import respiratory from "../../assets/icons/respiratory.svg";
import statusIcon from "../../assets/icons/status.svg";
import sugar from "../../assets/icons/sugar.svg";
import weight from "../../assets/icons/weight.svg";
import temperature from "../../assets/icons/temperature.png";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { Table, message, Modal, Form, Input, Upload, Button, Select, DatePicker, AutoComplete } from "antd";
import dayjs from "dayjs";
import { getData } from "country-list";
import { UploadOutlined, EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { base_url, isAdminUser, resolveMediaUrl, stripDialCode } from "../../constants/constants";
import {
  filterSponsorAppointments,
  filterSponsorPatients,
  getStoredSponsorProfileId,
  persistSponsorProfile,
  resolveSponsorProfileFromList,
  toValidId,
} from "../../utils/sponsorIsolation";

import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const enrollSchema = Yup.object().shape({
  name: Yup.string().required("Patient Name is required"),
  phone: Yup.string().required("Phone Number is required"),
  country_code: Yup.string().nullable(),
  patient_dob: Yup.date().nullable(),
  patient_gender: Yup.string().nullable(),
});

const calculateAge = (dob) => {
  if (!dob) return "N/A";
  const diff = Date.now() - new Date(dob).getTime();
  const age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970);
};

const NOT_KNOWN_OPTIONS = [
  { label: "Not Known at time of enrolment", value: "Not Known at time of enrolment" },
];
const BLOOD_GROUP_OPTIONS = [
  { label: "A+", value: "A+" },
  { label: "A−", value: "A−" },
  { label: "B+", value: "B+" },
  { label: "B−", value: "B−" },
  { label: "AB+", value: "AB+" },
  { label: "AB−", value: "AB−" },
  { label: "O+", value: "O+" },
  { label: "O−", value: "O−" },
  { label: "Not Known at time of enrolment", value: "Not Known at time of enrolment" },
];
const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];
const YES_NO_NOT_KNOWN_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Not Known at time of enrolment", value: "Not Known at time of enrolment" },
];

export default function MyLovedOnes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [vitalsData, setVitalsData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState(null);
  const [imageHash, setImageHash] = useState(Date.now());

  const countryOptions = useMemo(() => {
    return getData().map((country) => ({
      label: country.name,
      value: country.code,
    }));
  }, []);



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

  if (!user) {
    window.location.href = "/";
  }

  const isAdmin = isAdminUser(user);
  const isSponsor = user?.user_role === "sponsor" && !isAdmin;

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

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

  const cleanedPatientId = toValidId(selectedPatientId);

  const storedSponsorId = isSponsor
    ? getStoredSponsorProfileId()
    : toValidId(localStorage.getItem("sponsorProfileId"));

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
        : storedSponsorId,
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
      const data =
        await myLovedOnesService.getSponsorPatients(resolvedSponsorId);
      const filtered = filterSponsorPatients(
        Array.isArray(data) ? data : [],
        resolvedSponsorId,
        true,
      );
      localStorage.setItem("sponsorPatientData", JSON.stringify(filtered));
      return filtered;
    },
    enabled: !!resolvedSponsorId && !!token,
  });

  const ownedPatientIds = useMemo(
    () =>
      (Array.isArray(sponsorPatients) ? sponsorPatients : [])
        .map((p) => toValidId(p?.id))
        .filter(Boolean),
    [sponsorPatients],
  );

  const isSelectedPatientOwned = useMemo(() => {
    if (!cleanedPatientId) return false;
    if (!isSponsor) return true;
    return ownedPatientIds.includes(cleanedPatientId);
  }, [cleanedPatientId, isSponsor, ownedPatientIds]);

  const { data: medicalReports = [] } = useQuery({
    queryKey: [
      "lovedOnesMedicalHistory",
      cleanedPatientId,
      isSponsor ? resolvedSponsorId : "all",
    ],
    queryFn: async () => {
      const data = await myLovedOnesService.getPatientAppointments(cleanedPatientId);
      const scoped = isSponsor
        ? filterSponsorAppointments(
            Array.isArray(data) ? data : [],
            resolvedSponsorId,
            ownedPatientIds,
          )
        : Array.isArray(data)
          ? data
          : [];
      return scoped.map((item, index) => ({
        key: index,
        appointment_date: item.appointment_date,
        appointment_time: item.appointment_time,
        doctor: item.doc?.user
          ? `${item.doc.user.first_name} ${item.doc.user.last_name}`
          : "—",
        appointment_type: item.appointment_type,
        care_taker_notes: [item.care_taker_notes, item.doctor_notes].filter(Boolean).join("\n") || "",
        treatment_performed: item.treatment_performed,
        documents: item.documents || [],
      }));
    },
    enabled:
      !!cleanedPatientId &&
      !!token &&
      (!isSponsor || (isSponsorPatientsLoaded && isSelectedPatientOwned)),
  });

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
      title: "Diagnostic",
      dataIndex: "treatment_performed",
      key: "treatment_performed",
      width: 200,
    },
    {
      title: "Comments",
      dataIndex: "care_taker_notes",
      key: "care_taker_notes",
      ellipsis: true,
    },
    {
      title: "Uploaded Files",
      key: "documents",
      width: 150,
      render: (_, record) => {
        if (!record.documents || record.documents.length === 0) {
          return <span className="text-gray-400">No files</span>;
        }
        return (
          <div className="flex flex-col gap-2">
            {record.documents.map((doc, i) => (
              <a
                key={i}
                href={resolveMediaUrl(doc.view_link || doc.download_link || doc.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004C91] underline text-[13px] flex items-center gap-[4px]"
              >
                View File
              </a>
            ))}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          className="bg-gradient-to-r from-[#007F5F] to-teal-500 hover:from-[#006b4f] hover:to-teal-600 border-none rounded-full px-5 shadow-sm transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center justify-center font-medium"
          onClick={() => {
            setSelectedHistoryRecord(record);
            setIsHistoryModalOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];


  const sponsorId = resolvedSponsorId;

  const getPhotoUrl = (url) => {
    if (!url || typeof url !== "string" || url === "null" || url === "undefined") {
      return patientdetails;
    }
    const resolved = resolveMediaUrl(url, patientdetails);
    if (!resolved || resolved === patientdetails) return patientdetails;
    const hasQuery = resolved.includes("?");
    return `${resolved}${hasQuery ? "&" : "?"}t=${imageHash}`;
  };

  const patientData = useMemo(() => {
    return (
      sponsorPatients.find((p) => toValidId(p.id) === cleanedPatientId) || null
    );
  }, [sponsorPatients, cleanedPatientId]);

  const handleEditOpen = () => {
    if (!patientData) return;
    editForm.setFieldsValue({
      name: patientData.patient_name || "",
      phone: stripDialCode(patientData.phone || ""),
      email: patientData.email || "",
      age: patientData.age || "",
      patient_dob: patientData.patient_dob ? dayjs(patientData.patient_dob) : null,
      patient_gender: patientData.patient_gender || "",
      blood_group: patientData.blood_group || "",
      height: patientData.height || "",
      weight: patientData.weight || "",
      blood_pressure: patientData.blood_pressure || patientData.bp || "",
      heart_rate: patientData.heart_rate || patientData.heartRate || "",
      blood_sugar: patientData.blood_sugar || patientData.sugar || "",
      oxygen: patientData.oxygen || "",
      temperature: patientData.temperature || "",
      respiratory_rate: patientData.respiratory_rate || patientData.respiratoryRate || "",
      country_code: patientData.country_code || "",
      patient_home_address: patientData.patient_home_address || "",
      primary_language: patientData.primary_language || "",
      religion: patientData.religion || "",
      emer_con_name: patientData.emer_con_name || "",
      emer_con_relation: patientData.emer_con_relation || "",
      emer_con_country_code:
        patientData.emer_con_country_code || patientData.emer_country_code || "",
      emer_con_phone: stripDialCode(patientData.emer_con_phone || ""),
      local_con_name: patientData.local_con_name || "",
      local_con_relation: patientData.local_con_relation || "",
      local_con_country_code: patientData.local_con_country_code || "",
      local_con_phone: stripDialCode(patientData.local_con_phone || ""),
      condition: patientData.medical_his_diagnosis || "",
      medical_his_cancer: patientData.medical_his_cancer || "",
      medical_his_major_surgeries: patientData.medical_his_major_surgeries || "",
      medical_his_curr_symp: patientData.medical_his_curr_symp || "",
      last_doctor_visit: patientData.last_doctor_visit || null,
      has_regular_doctor: patientData.has_regular_doctor || "",
      regular_doctor_name: patientData.regular_doctor_name || "",
      allergies_drug: patientData.allergies_drug || "",
      allergies_food: patientData.allergies_food || "",
      photo: undefined,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await enrollSchema.validate(values, { abortEarly: false });
    } catch (error) {
      if (error.name === "ValidationError") {
        error.inner.forEach((err) => {
          toast.error(err.message, { position: "top-right", autoClose: 3000 });
        });
        return;
      }
    }
    
    setEditLoading(true);
    try {
      const targetSponsorId =
        (isSponsor ? resolvedSponsorId || getStoredSponsorProfileId() : null) ||
        toValidId(patientData?.sponsorid) ||
        toValidId(patientData?.sponsor) ||
        0;
      const formattedDOB =
        values.patient_dob && dayjs.isDayjs(values.patient_dob)
          ? values.patient_dob.format("YYYY-MM-DD")
          : values.patient_dob || null;
      const parsedAge =
        values.age !== undefined &&
        values.age !== null &&
        String(values.age).trim() !== "" &&
        !Number.isNaN(Number(values.age))
          ? parseInt(values.age, 10)
          : null;
      const cleanPhone = stripDialCode(values.phone || "");
      const cleanEmerPhone = stripDialCode(values.emer_con_phone || "");
      const cleanLocalPhone = stripDialCode(values.local_con_phone || "");
      const emerCountryCode = values.emer_con_country_code || "";

      const patientprofile_update_data = {
        patient_profile_updateid: Number(patientData.id),
        sponsorid: Number(targetSponsorId),
        caretakerid: patientData.caretakerid || patientData.caretaker || null,
        patient_name: values.name || patientData.patient_name || "",
        phone: cleanPhone,
        email: values.email ?? patientData.email ?? "",
        country_code: values.country_code ?? patientData.country_code ?? "",
        age: parsedAge,
        height: values.height ?? "",
        weight: values.weight ?? "",
        blood_pressure: values.blood_pressure ?? "",
        heart_rate: values.heart_rate ?? "",
        blood_sugar: values.blood_sugar ?? "",
        oxygen: values.oxygen ?? "",
        temperature: values.temperature ?? "",
        respiratory_rate: values.respiratory_rate ?? "",
        patient_dob: formattedDOB,
        patient_gender: values.patient_gender || "",
        blood_group: values.blood_group || "",
        patient_home_address: values.patient_home_address || "",
        primary_language: values.primary_language || "",
        religion: values.religion || "",
        escalate_to_physician: values.escalate_to_physician || "Yes",

        emer_con_name: values.emer_con_name || "",
        emer_con_relation: values.emer_con_relation || "",
        emer_con_coun_of_residen: values.emer_con_coun_of_residen || "",
        emer_con_country_code: emerCountryCode,
        emer_con_phone: cleanEmerPhone,
        emer_con_email: values.emer_con_email || "",

        local_con_name: values.local_con_name || "",
        local_con_relation: values.local_con_relation || "",
        local_con_country_code: values.local_con_country_code || "",
        local_con_phone: cleanLocalPhone,

        reason_enrollment: values.reason_enrollment || patientData.reason_enrollment || patientData.reason || "",
        reason_other: values.reason_other || null,

        medical_his_diagnosis: values.condition || values.medical_his_diagnosis || "",
        medical_his_cancer: values.medical_his_cancer || null,
        medical_his_other: values.medical_his_other || "",
        medical_his_provided_medi_care: values.medical_his_provided_medi_care || "",
        medical_his_major_surgeries: values.medical_his_major_surgeries || "",
        medical_his_curr_symp: values.medical_his_curr_symp || "",
        last_doctor_visit: values.last_doctor_visit || null,
        has_regular_doctor: values.has_regular_doctor || "",
        regular_doctor_name: values.regular_doctor_name || "",

        medication_name: values.medication_name || "",
        medication_dose: values.medication_dose || "",
        medication_frequency: values.medication_frequency || "",
        medication_reason: values.medication_reason || "",
        medication_issues: values.medication_issues || false,
        medication_issues_explain: values.medication_issues_explain || null,

        allergies_issues: values.allergies_issues || false,
        allergies_drug: values.allergies_drug || "",
        allergies_food: values.allergies_food || "",

        functional_bathe: values.functional_bathe || "",
        functional_dress: values.functional_dress || "",
        functional_eat: values.functional_eat || "",
        functional_walk: values.functional_walk || "",
        functional_use_bathroom: values.functional_use_bathroom || "",
        functional_daily_activity: values.functional_daily_activity || "",
        functional_manage_finance: values.functional_manage_finance || "",
        functional_any_falls: values.functional_any_falls || false,
        functional_how_many: values.functional_how_many || null,
        functional_memory_pbms: values.functional_memory_pbms || false,

        lifestyle_daily_routine: values.lifestyle_daily_routine || "",
        lifestyle_dietary_habits: values.lifestyle_dietary_habits || "",
        lifestyle_sleep_quality: values.lifestyle_sleep_quality || "",
        lifestyle_physical_activity: values.lifestyle_physical_activity || "",
        lifestyle_alcohol_use: values.lifestyle_alcohol_use || "",
        lifestyle_pain_complaints: values.lifestyle_pain_complaints || "",
        lifestyle_pain_where: values.lifestyle_pain_where || "",

        social_emotion_health: values.social_emotion_health || "",
        social_spiritual_needs: values.social_spiritual_needs || "",
        social_trusted_person: values.social_trusted_person || false,
        social_name: values.social_name || "",

        goals_family_hope: values.goals_family_hope || "",
        goals_special_instructions: values.goals_special_instructions || "",
        goals_term_membership: values.goals_term_membership || "",
      };

      const formData = new FormData();
      formData.append("patientprofile_update_data", JSON.stringify(patientprofile_update_data));
      if (values.photo && values.photo.length > 0) {
        const fileObj = values.photo[0].originFileObj || values.photo[0];
        formData.append("photo", fileObj);
        formData.append("patient_photo", fileObj);
      }
      await myLovedOnesService.patchPatientProfile(formData);
      toast.success("Loved one profile updated successfully!", { position: "top-right", autoClose: 3000 });
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sponsorPatients"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["lovedOnesMedicalHistory"] });
      setImageHash(Date.now());
    } catch (error) {
      console.error("Error updating loved one:", error);
      const backendError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to update loved one profile.";
      toast.error(backendError, { position: "top-right", autoClose: 3000 });
    } finally {
      setEditLoading(false);
    }
  };

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

  const appointmentDetailsDynamic = (medicalReports || []).map((report) => ({
    date: report.appointment_date
      ? new Date(report.appointment_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) + (report.appointment_time ? ` – ${report.appointment_time.slice(0, 5)}` : "")
      : "N/A",
    type: report.appointment_type || "N/A",
    provider: report.doctor || "N/A",
    status: "Completed",
    comments: report.care_taker_notes || "",
  }));

  const timelineDataDynamic = (medicalReports || []).map((report) => ({
    title: report.appointment_type || "Appointment Details",
    details: [
      report.treatment_performed || "Checkup",
      report.care_taker_notes || "No additional comments"
    ],
    date: report.appointment_date
      ? new Date(report.appointment_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A",
  }));

  return (
    <div
      className="flex h-screen bg-[#F7F9FB]"
    >
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col font-['Inter',sans-serif]">
        <div className="shrink-0">
          <Header />
        </div>
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-[30px] overflow-y-auto gap-[24px] flex flex-col items-center overflow-x-hidden">
          {/* Content area */}

          {/* patient details */}
          <div className="bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-solid border-gray-100 p-[24px] w-full flex flex-col gap-[20px] min-w-0">
            <SectionHeader title="Patient Details">
              <div className="flex items-center gap-[12px]">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  className="bg-gradient-to-r from-[#007F5F] to-teal-500 hover:from-[#006b4f] hover:to-teal-600 border-none rounded-full font-medium px-5 shadow-sm transition-all duration-300 transform hover:scale-105"
                  onClick={handleEditOpen}
                >
                  Edit Profile & Photo
                </Button>
                <p
                  className="text-[14px] font-medium text-[#2E2E2E] m-0 italic"
                >
                  Renewal Due Aug 25, 2025
                </p>
              </div>
            </SectionHeader>

            {/* Profile */}
            <div className="flex items-center gap-[24px] border border-solid border-gray-100 bg-gray-50/50 rounded-[16px] p-[20px] min-w-0 flex-wrap transition-colors duration-300 hover:bg-gray-50">
              <img
                src={getPhotoUrl(
                  patientData?.photo_view_url || patientData?.photo
                )}
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = patientdetails;
                }}
                className="w-[64px] h-[64px] rounded-[12px] shrink-0 object-cover"
              />

              <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[10px_20px] min-w-0 flex-1">
                {patientData ? (
                  <>
                    <InfoItem
                      label="Name"
                      value={`${patientData?.patient_name} (${patientData?.id})`}
                    />
                    <InfoItem
                      label="Age/Gender"
                      value={`${
                        patientData?.age ||
                        calculateAge(patientData?.patient_dob || patientData?.date_of_birth)
                      } Years / ${patientData?.patient_gender || patientData?.gender || "N/A"}`}
                    />
                    <InfoItem
                      label="Relationship"
                      value={patientData?.reason_enrollment || patientData?.relation || "Loved One"}
                    />
                    <InfoItem
                      label="Primary Diagnosis"
                      value={(() => {
                        const diag = patientData?.medical_his_diagnosis || patientData?.diagnosis;
                        if (!diag) return "N/A";
                        if (Array.isArray(diag)) return diag.map((d) => d.name || JSON.stringify(d)).join(", ");
                        if (typeof diag === "object") return diag.name || JSON.stringify(diag);
                        return diag;
                      })()}
                    />
                    <InfoItem
                      label="Primary Doctor"
                      value={patientData?.regular_doctor_name || patientData?.primary_doctor || "N/A"}
                    />
                    <InfoItem
                      label="Allergies"
                      value={(() => {
                        const combined = [patientData?.allergies_drug, patientData?.allergies_food]
                          .filter(Boolean)
                          .join(", ");
                        if (combined) return combined;
                        const allergies = patientData?.allergies;
                        if (!allergies) return "N/A";
                        if (Array.isArray(allergies)) return allergies.map((a) => a.name || JSON.stringify(a)).join(", ");
                        if (typeof allergies === "object") return allergies.name || JSON.stringify(allergies);
                        return allergies;
                      })()}
                    />
                    <InfoItem
                      label="Current Medication"
                      value={(() => {
                        let med = patientData?.medication;
                        if (!med) return "N/A";
                        if (typeof med === "string") {
                          try {
                            const parsed = JSON.parse(med);
                            if (Array.isArray(parsed)) med = parsed;
                          } catch {
                            return med || "N/A";
                          }
                        }
                        if (Array.isArray(med)) {
                          const names = med.map((m) => m?.name || m?.medication_name).filter(Boolean);
                          return names.length > 0 ? names.join(", ") : "N/A";
                        }
                        if (typeof med === "object") return med.name || JSON.stringify(med);
                        return String(med);
                      })()}
                    />
                    <InfoItem
                      label="Insurance Provider"
                      value={patientData?.insurance || "N/A"}
                    />
                  </>
                ) : (
                  <p className="text-[#999]">Loading patient details...</p>
                )}
              </div>
            </div>
            {/* Vitals */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[16px] min-w-0 w-full mt-2">
              {vitals.map((item, i) => (
                <div key={i} className="flex items-center gap-[12px] bg-white border border-solid border-gray-100 shadow-sm rounded-[16px] p-[16px] min-h-[85px] min-w-0 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer group">
                  <div className="w-[40px] h-[40px] rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors duration-300 shrink-0">
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-[20px] h-[20px]"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-gray-500 font-medium mb-[4px]">{item.label}</p>
                    <div className="flex items-center gap-[5px]">
                      <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: item.color }}></div>
                      <span className="text-[14px] text-[#2E2E2E] break-words">{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-solid border-gray-100 p-[24px] w-full flex flex-col gap-[24px] min-w-0 mt-2">
            <SectionHeader title="Medical History">
              <Button
                type="primary"
                onClick={() =>
                  navigate("/appointments", {
                    state: { openBookingModal: true },
                  })
                }
                className="bg-gradient-to-r from-[#007F5F] to-teal-500 hover:from-[#006b4f] hover:to-teal-600 border-none rounded-full font-medium px-5 shadow-sm transition-all duration-300 transform hover:scale-105"
              >
                Request Appointment
              </Button>
            </SectionHeader>

            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
              <Table
                columns={columns}
                dataSource={medicalReports}
                pagination={{ pageSize: 5 }}
                className="w-full custom-modern-table"
              />
            </div>
          </div>

          {/* Appointment Details + Timeline */}
          <div className="grid grid-cols-[2fr_1fr] gap-[20px] w-full">
            {/* LEFT: Appointment Details Timeline */}
            {/* <div style={appointmentWrapper}>
              <SectionHeader title="Appointment Details" />
              <div style={timelineWrapper}>
                <div style={timelineLine}></div>
                {appointmentDetails.map((item, index) => (
                  <div key={index} style={timelineItem}>
                    <div style={timelineDot}></div>
                    <div style={timelineContent}>
                      <div
                        className="flex justify-between items-center mb-[-10]"
                      >
                        <p style={apptDate}>{item.date} </p>
                        <p>
                          {item.badge && (
                            <span style={badge}>{item.badge}</span>
                          )}
                        </p>
                      </div>
                      {item.type && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Type:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.type}
                          </span>
                        </p>
                      )}
                      {item.provider && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Assigned Provider:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.provider}
                          </span>
                        </p>
                      )}
                      {item.status && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Status:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.status}
                          </span>
                        </p>
                      )}
                      {item.checkin && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Check-in Status:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.checkin}
                          </span>
                        </p>
                      )}
                      {item.vitals && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Vitals Recorded:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.vitals}
                          </span>
                        </p>
                      )}
                      {item.comments && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Comments:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.comments}
                          </span>
                        </p>
                      )}
                      {item.next && (
                        <p
                          className="text-[14px] font-medium text-[#2E2E2E]"
                        >
                          Next Appointment:{" "}
                          <span
                            className="text-[14px] font-medium text-[#06152B99]"
                          >
                            {item.next}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

           
            <div style={timelineCard}>
              <SectionHeader title="Timeline" />
              {timelineData.map((item, index) => (
                <div key={index} style={timelineBox}>
                  <p
                    className="text-[14px] font-normal text-[#2E2E2E]"
                  >
                    {item.title}
                  </p>
                  {Array.isArray(item.details) ? (
                    item.title === "Vitals Recorded" ? (
                      <ul>
                        {item.details.map((d, i) => (
                          <li
                            className="text-[14px] font-normal text-[#06152BB2]"
                            key={i}
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      item.details.map((d, i) => (
                        <p
                          className="text-[14px] font-normal text-[#06152BB2]"
                          key={i}
                        >
                          {d}
                        </p>
                      ))
                    )
                  ) : (
                    <p
                      className="text-[14px] font-normal text-[#06152BB2]"
                    >
                      {item.details}
                    </p>
                  )}
                  <p style={timelineDate}>{item.date}</p>
                </div>
              ))}
            </div> */}
            {/* LEFT: Appointment Details Timeline */}
            <div className="bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-solid border-gray-100 p-[24px] flex flex-col gap-[20px]">
              <SectionHeader title="Appointment Details" />
              <div className="relative ml-[12px] flex flex-col gap-[24px] mt-2">
                <div className="absolute left-[7px] top-2 bottom-0 w-[2px] bg-teal-100 rounded-full"></div>
                {appointmentDetailsDynamic.length > 0 ? (
                  appointmentDetailsDynamic.map((item, index) => (
                    <div key={index} className="flex items-start gap-[20px] relative group">
                      <div className="w-[16px] h-[16px] rounded-full bg-teal-500 mt-[6px] shrink-0 z-10 border-4 border-white shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                      <div className="bg-white border border-solid border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-[16px] p-[16px] flex-1 flex flex-col gap-[8px]">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                          <p className="text-[14px] font-bold text-gray-800">{item.date}</p>
                          {item.status && (
                            <span className="bg-teal-50 text-teal-700 text-[12px] font-semibold px-3 py-1 rounded-full">
                              {item.status}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {item.type && (
                            <div>
                              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Type</p>
                              <p className="text-[14px] font-medium text-gray-700">{item.type}</p>
                            </div>
                          )}
                          {item.provider && (
                            <div>
                              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Provider</p>
                              <p className="text-[14px] font-medium text-gray-700">{item.provider}</p>
                            </div>
                          )}
                        </div>
                        {item.comments && (
                          <div className="mt-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Comments</p>
                            <p className="text-[14px] text-gray-600 leading-relaxed">{item.comments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 italic py-4">No appointment details available.</div>
                )}
              </div>
            </div>

            {/* RIGHT: Timeline */}
            <div className="bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-solid border-gray-100 p-[24px] flex flex-col gap-[16px]">
              <SectionHeader title="Timeline" />
              <div className="flex flex-col mt-2">
                {timelineDataDynamic.length > 0 ? (
                  timelineDataDynamic.map((item, index) => (
                    <div key={index} className="relative border-l-2 border-teal-100 pl-[20px] pb-[24px] last:pb-0">
                      <div className="absolute left-[-5px] top-[4px] w-[8px] h-[8px] rounded-full bg-teal-500 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[15px] font-bold text-gray-800 tracking-tight">
                          {item.title}
                        </p>
                        <p className="text-[12px] font-medium bg-gray-50 text-gray-500 px-2 py-1 rounded-md">
                          {item.date}
                        </p>
                      </div>
                      
                      {Array.isArray(item.details) && item.details.length > 0 ? (
                        <ul className="flex flex-col gap-1 mt-2">
                          {item.details.map((d, i) => (
                            <li
                              key={i}
                              className="text-[14px] text-gray-600 flex items-start gap-2"
                            >
                              <span className="text-teal-500 mt-[4px] text-[10px]">●</span>
                              <span className="leading-relaxed">{d}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[13px] italic text-gray-400 mt-1">
                          No details available
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 italic py-4">No timeline events available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Loved One Modal (#B) */}
      <Modal
        title="Edit Profile & Photo"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={720}
        centered
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-[16px]"
        >
          <div className="max-h-[68vh] overflow-y-auto pr-[8px]">
            <h3>1. Personal Information</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input placeholder="Enter patient name" />
              </Form.Item>
              <Form.Item label="Upload New Photo" name="photo" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList}>
                <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                  <Button icon={<UploadOutlined />}>Select Photo</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Age" name="age">
                <Input placeholder="Age" />
              </Form.Item>
              <Form.Item label="Date of Birth" name="patient_dob">
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item label="Gender" name="patient_gender">
                <Select
                  className="w-full"
                  placeholder="Select Gender"
                  options={GENDER_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Blood Group" name="blood_group">
                <Select
                  className="w-full"
                  placeholder="Select Blood Group"
                  options={BLOOD_GROUP_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Height" name="height">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 175 cm or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Weight" name="weight">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 70 kg or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Blood Pressure" name="blood_pressure">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Blood Pressure or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Heart Rate" name="heart_rate">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Heart Rate or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Blood Sugar" name="blood_sugar">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Blood Sugar or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Oxygen" name="oxygen">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Oxygen or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Temperature" name="temperature">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Temperature or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Respiratory Rate" name="respiratory_rate">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter Respiratory Rate or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Phone Number" name="phone">
                <Input placeholder="Enter phone number" />
              </Form.Item>
              <Form.Item label="Email Address" name="email">
                <Input placeholder="Enter email address" />
              </Form.Item>
              <Form.Item label="Country" name="country_code">
                <Select showSearch options={countryOptions} placeholder="Select Country" />
              </Form.Item>
              <Form.Item label="Home Address" name="patient_home_address">
                <Input placeholder="Enter address" />
              </Form.Item>
              <Form.Item label="Primary Language" name="primary_language">
                <Input placeholder="e.g. English" />
              </Form.Item>
              <Form.Item label="Religion" name="religion">
                <Input placeholder="Enter religion" />
              </Form.Item>
            </div>

            <h3>2. Emergency Contact</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item label="Full Name" name="emer_con_name">
                <Input placeholder="Enter emergency contact name" />
              </Form.Item>
              <Form.Item label="Relationship" name="emer_con_relation">
                <Input placeholder="e.g. Spouse, Brother" />
              </Form.Item>
              <Form.Item label="Country" name="emer_con_country_code">
                <Select showSearch options={countryOptions} placeholder="Select Country" />
              </Form.Item>
              <Form.Item label="Phone Number" name="emer_con_phone">
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </div>

            <h3>3. Local Contact (if different)</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item label="Full Name" name="local_con_name">
                <Input placeholder="Enter local contact name" />
              </Form.Item>
              <Form.Item label="Relationship" name="local_con_relation">
                <Input placeholder="e.g. Friend" />
              </Form.Item>
              <Form.Item label="Country" name="local_con_country_code">
                <Select showSearch options={countryOptions} placeholder="Select Country" />
              </Form.Item>
              <Form.Item label="Phone Number" name="local_con_phone">
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </div>

            <h3>4. Medical History & Allergies</h3>
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
              <Form.Item label="Primary Medical Condition / Diagnosis" name="condition">
                <Input.TextArea placeholder="e.g. Hypertension, Diabetes" />
              </Form.Item>
              <Form.Item label="Cancer History" name="medical_his_cancer">
                <Select
                  className="w-full"
                  placeholder="Select cancer history"
                  options={YES_NO_NOT_KNOWN_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Major Surgeries" name="medical_his_major_surgeries">
                <Input placeholder="Enter major surgeries" />
              </Form.Item>
              <Form.Item label="Current Symptoms" name="medical_his_curr_symp">
                <Input.TextArea placeholder="Enter current symptoms" />
              </Form.Item>
              <Form.Item label="Last Doctor / Hospital Visit" name="last_doctor_visit">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="e.g. 2 months ago, June 2024, or select Not Known"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Do you have a doctor you see regularly?" name="has_regular_doctor">
                <Select
                  className="w-full"
                  placeholder="Select Yes, No, or Not Known"
                  options={YES_NO_NOT_KNOWN_OPTIONS}
                />
              </Form.Item>
              <Form.Item label="Regular Doctor's Name & Contact Info" name="regular_doctor_name">
                <AutoComplete
                  className="w-full"
                  options={NOT_KNOWN_OPTIONS}
                  placeholder="Enter doctor's name, clinic, or contact details"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="Drug Allergies" name="allergies_drug">
                <Input placeholder="Enter drug allergies" />
              </Form.Item>
              <Form.Item label="Food Allergies" name="allergies_food">
                <Input placeholder="Enter food allergies" />
              </Form.Item>
            </div>
          </div>

          <div
            className="flex justify-end gap-[10px] mt-[24px]"
          >
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={editLoading}
              className="bg-[#007F5F] border border-solid border-[#007F5F]"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* History Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
              <EditOutlined className="text-teal-600 text-lg" />
            </div>
            <span className="text-[20px] font-bold text-gray-800 tracking-tight">Medical History Details</span>
          </div>
        }
        open={isHistoryModalOpen}
        onCancel={() => setIsHistoryModalOpen(false)}
        footer={
          <div className="flex justify-end pt-4">
             <Button type="primary" onClick={() => setIsHistoryModalOpen(false)} className="bg-[#007F5F] border-none rounded-full px-6 shadow-sm hover:scale-105 transition-transform duration-300">
                Close
             </Button>
          </div>
        }
        width={750}
        className="modern-modal"
        styles={{
          mask: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
          content: { borderRadius: '20px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
        }}
      >
        {selectedHistoryRecord && (
          <div className="flex flex-col gap-[24px] mt-2 font-['Inter',sans-serif]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <InfoItem label="Date" value={selectedHistoryRecord.appointment_date || "N/A"} />
              <InfoItem label="Time" value={selectedHistoryRecord.appointment_time || "N/A"} />
              <InfoItem label="Doctor/Nurse" value={selectedHistoryRecord.doctor || "N/A"} />
              <InfoItem label="Diagnostic" value={selectedHistoryRecord.treatment_performed || "N/A"} />
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-[14px] font-semibold tracking-wide uppercase">Comments & Notes</p>
              <div className="bg-white p-5 rounded-2xl border-l-4 border-l-teal-500 border border-gray-100 shadow-sm min-h-[80px] whitespace-pre-wrap text-gray-700 leading-relaxed text-[15px]">
                {selectedHistoryRecord.care_taker_notes || <span className="text-gray-400 italic">No comments available.</span>}
              </div>
            </div>

            {selectedHistoryRecord.documents && selectedHistoryRecord.documents.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-gray-500 text-[14px] font-semibold tracking-wide uppercase">Uploaded Files</p>
                <div className="flex flex-wrap gap-3">
                  {selectedHistoryRecord.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={resolveMediaUrl(doc.view_link || doc.download_link || doc.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 text-teal-600 hover:bg-teal-50 hover:border-teal-200 transition-all duration-300"
                    >
                      <UploadOutlined className="text-lg" />
                      <span className="font-medium text-[14px]">View Document {i + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

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
      <p className="text-gray-500 text-[13px] font-semibold uppercase tracking-wider mb-[4px] break-words">
        {label}
      </p>
      <p className="text-[15px] font-medium text-gray-800 break-words leading-snug">
        {value}
      </p>
    </div>
  );
}


