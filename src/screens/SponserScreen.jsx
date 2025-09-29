// import React from "react";
// import Header from "../components/Header";
// import Sider from "../components/Sider";
// import Banner from "../components/Banner";
// import bloodPressure from "../assets/icons/blood-pressure.svg";
// import heartRate from "../assets/icons/heart-rate.svg";
// import oxygen from "../assets/icons/oxygen.svg";
// import respiratory from "../assets/icons/respiratory.svg";
// import statusIcon from "../assets/icons/status.svg";
// import sugar from "../assets/icons/sugar.svg";
// import weight from "../assets/icons/weight.svg";
// import temperature from "../assets/icons/temperature.png";
// import Primarybtn from "../components/PrimaryBtn";
// import SecondaryBtn from "../components/SecondaryBtn";
// import patientdetails from "../assets/images/patient-profile.jpg";

// export default function SponserScreen() {
//   const dotStyle = (color) => ({
//     width: "8px",
//     height: "8px",
//     background: color,
//     borderRadius: "50%",
//   });

//   const patientInfo = [
//     { label: "Name", value: "Mr. Samuel N. (VM–976–324)" },
//     { label: "Condition", value: "Hypertension, Diabetes" },
//     { label: "Assigned Doctor", value: "Dr. Paul M." },
//     { label: "Care Taker", value: "Nurse Clarisse A." },
//   ];

//   const vitals = [
//     {
//       icon: bloodPressure,
//       label: "Blood Pressure",
//       value: "100/67 mmHg",
//       color: "#27AE60",
//     },
//     { icon: heartRate, label: "Heart Rate", value: "89 bpm", color: "#EF1E1E" },
//     { icon: sugar, label: "Sugar", value: "180", color: "#27AE60" },
//     { icon: oxygen, label: "Oxygen", value: "96", color: "#27AE60" },
//     {
//       icon: temperature,
//       label: "Temperature",
//       value: "101 °C",
//       color: "#27AE60",
//     },
//     {
//       icon: respiratory,
//       label: "Respiratory Rate",
//       value: "24 rpm",
//       color: "#EF1E1E",
//     },
//     { icon: weight, label: "Weight", value: "100 kg", color: "#27AE60" },
//     { icon: statusIcon, label: "Status", value: "Stable", color: "#27AE60" },
//   ];

//   const careTeam = {
//     name: "Clarisse A.",
//     role: "Geriatric Care",
//     contact: "+966 558441502",
//     nextVisit: "Aug 20, 2025 – 10:00 AM (Home Visit)",
//     frequency: "Every 2 weeks",
//     specialization:
//       "Chronic disease management (hypertension, diabetes), IV therapy, palliative care",
//   };

//   const medicalHistory = [
//     {
//       date: "Aug 15, 2025",
//       time: "10:00 AM",
//       doctor: "Nurse Clarisse A.",
//       diagnostic: "Routine Vitals Check",
//       comments: "BP 128/78, Blood Sugar 110. Stable. No Urgent Concerns.",
//     },
//     {
//       date: "Aug 15, 2025",
//       time: "10:30 AM",
//       doctor: "Dr. Robert M.",
//       diagnostic: "Physical Exam",
//       comments: "General Health Appears Good. Follow-Up in 6 Months.",
//     },
//     {
//       date: "Aug 15, 2025",
//       time: "11:30 AM",
//       doctor: "Dr. Sarah T.",
//       diagnostic: "X-Ray Interpretation",
//       comments: "No Abnormalities Found In Chest X-Ray.",
//     },
//     {
//       date: "Aug 15, 2025",
//       time: "12:00 PM",
//       doctor: "Nurse Leo B.",
//       diagnostic: "Medication Review",
//       comments:
//         "Patient Adheres To Prescribed Regimen, No Side Effects Reported.",
//     },
//   ];

//   return (
//     <div
//       style={{ display: "flex", height: "100vh", backgroundColor: "#F7F9FB" }}
//     >
//       {/* Sidebar */}
//       <div style={{ width: "240px", flexShrink: 0 }}>
//         <Sider />
//       </div>

//       {/* Main Content */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ flexShrink: 0 }}>
//           <Header />
//         </div>

//         {/* Page Content */}
//         <div
//           style={{
//             padding: "30px",
//             overflowY: "auto",
//             gap: 20,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           {/* Banner */}
//           <Banner />

//           {/* Patient Details */}
//           <div style={cardStyle}>
//             <SectionHeader title="Patient Details">
//               <Primarybtn name="View Full Profile" />
//               <SecondaryBtn name="Download" />
//             </SectionHeader>

//             {/* Profile */}
//             <div style={profileBox}>
//               <img
//                 src={patientdetails}
//                 alt="profile"
//                 style={{
//                   width: 64,
//                   height: 64,
//                   borderRadius: "12px",
//                   objectFit: "cover",
//                 }}
//               />
//               <div style={infoGrid}>
//                 {patientInfo.map((item, i) => (
//                   <InfoItem key={i} label={item.label} value={item.value} />
//                 ))}
//               </div>
//             </div>

//             {/* Vitals */}
//             <div style={vitalsGrid}>
//               {vitals.map((item, i) => (
//                 <div key={i} style={vitalCard}>
//                   <img
//                     src={item.icon}
//                     alt={item.label}
//                     style={{ width: 24, height: 24 }}
//                   />
//                   <div style={{ display: "flex", flexDirection: "column" }}>
//                     <p style={vitalLabel}>{item.label}</p>
//                     <div
//                       style={{ display: "flex", alignItems: "center", gap: 5 }}
//                     >
//                       <div style={dotStyle(item.color)}></div>
//                       <span style={vitalValue}>{item.value}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Care Team */}
//           <div style={cardStyle}>
//             <SectionHeader title="Care Team Details">
//               <Primarybtn name="View Reports" />
//             </SectionHeader>
//             <div style={profileBox}>
//               <img
//                 src={patientdetails}
//                 alt="nurse"
//                 style={{
//                   width: 64,
//                   height: 64,
//                   borderRadius: "12px",
//                   objectFit: "cover",
//                 }}
//               />
//               <div style={infoGrid}>
//                 <InfoItem label="Name" value={careTeam.name} />
//                 <InfoItem label="Role" value={careTeam.role} />
//                 <InfoItem label="Contact Number" value={careTeam.contact} />
//                 <InfoItem label="Next Visit" value={careTeam.nextVisit} />
//                 <InfoItem label="Visit Frequency" value={careTeam.frequency} />
//               </div>
//             </div>
//             <p style={{ fontSize: 14, color: "#4B5563", marginTop: 10 }}>
//               {careTeam.specialization}
//             </p>
//           </div>

//           {/* Medical History */}
//           <div style={cardStyle}>
//             <SectionHeader title="Medical History">
//               <Primarybtn name="Get Appointment" />
//             </SectionHeader>
//             <table style={tableStyle}>
//               <thead>
//                 <tr>
//                   {[
//                     "Date",
//                     "Time",
//                     "Doctor/Nurse",
//                     "Diagnostic",
//                     "Comments",
//                   ].map((h) => (
//                     <th key={h} style={thStyle}>
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {medicalHistory.map((row, i) => (
//                   <tr key={i}>
//                     <td style={tdStyle}>{row.date}</td>
//                     <td style={tdStyle}>{row.time}</td>
//                     <td style={tdStyle}>{row.doctor}</td>
//                     <td style={tdStyle}>{row.diagnostic}</td>
//                     <td style={tdStyle}>{row.comments}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* 🔹 Reusable Section Header */
// function SectionHeader({ title, children }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//       }}
//     >
//       <p style={{ fontSize: 16, fontWeight: 600, color: "#1B1B1B" }}>{title}</p>
//       <div style={{ display: "flex", gap: 10 }}>{children}</div>
//     </div>
//   );
// }

// /* 🔹 Info Item (label + value) */
// function InfoItem({ label, value }) {
//   return (
//     <div>
//       <p
//         style={{
//           color: "#6B7280",
//           fontSize: 14,
//           fontWeight: 500,
//           marginBottom: 3,
//         }}
//       >
//         {label}
//       </p>
//       <p style={{ fontSize: 16, fontWeight: 600, color: "#2E2E2E" }}>{value}</p>
//     </div>
//   );
// }

// /* 🔹 Styles */
// const cardStyle = {
//   background: "#fff",
//   borderRadius: "12px",
//   padding: "20px",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//   width: "100%",
//   display: "flex",
//   flexDirection: "column",
//   gap: 20,
// };

// const profileBox = {
//   display: "flex",
//   alignItems: "center",
//   gap: 20,
//   border: "1px solid #E6E8EB",
//   borderRadius: "10px",
//   padding: "15px",
// };

// const infoGrid = {
//   display: "grid",
//   gridTemplateColumns: "repeat(4, 1fr)",
//   gap: "10px 40px",
// };

// const vitalsGrid = {
//   display: "grid",
//   gridTemplateColumns: "repeat(4, 1fr)",
//   gap: 15,
// };

// const vitalCard = {
//   display: "flex",
//   alignItems: "center",
//   gap: 10,
//   border: "1px solid #E6E8EB",
//   borderRadius: "10px",
//   padding: "10px",
//   minHeight: "80px",
// };

// const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
// const vitalValue = { fontSize: 14, color: "#2E2E2E" };

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
// };

// const thStyle = {
//   textAlign: "left",
//   padding: "12px",
//   fontSize: 14,
//   fontWeight: 600,
//   color: "#1B1B1B",
//   borderBottom: "1px solid #E6E8EB",
// };

// const tdStyle = {
//   padding: "12px",
//   fontSize: 14,
//   color: "#374151",
//   borderBottom: "1px solid #F0F2F5",
// };
import React from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import Banner from "../components/Banner";
import bloodPressure from "../assets/icons/blood-pressure.svg";
import heartRate from "../assets/icons/heart-rate.svg";
import oxygen from "../assets/icons/oxygen.svg";
import respiratory from "../assets/icons/respiratory.svg";
import statusIcon from "../assets/icons/status.svg";
import sugar from "../assets/icons/sugar.svg";
import weight from "../assets/icons/weight.svg";
import temperature from "../assets/icons/temperature.png";
import Primarybtn from "../components/PrimaryBtn";
import SecondaryBtn from "../components/SecondaryBtn";
import patientdetails from "../assets/images/patient-profile.jpg";

export default function SponserScreen() {
  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });

  const patientInfo = [
    { label: "Name", value: "Mr. Samuel N. (VM–976–324)" },
    { label: "Condition", value: "Hypertension, Diabetes" },
    { label: "Assigned Doctor", value: "Dr. Paul M." },
    { label: "Care Taker", value: "Nurse Clarisse A." },
  ];

  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: "100/67 mmHg",
      color: "#27AE60",
    },
    { icon: heartRate, label: "Heart Rate", value: "89 bpm", color: "#EF1E1E" },
    { icon: sugar, label: "Sugar", value: "180", color: "#27AE60" },
    { icon: oxygen, label: "Oxygen", value: "96", color: "#27AE60" },
    {
      icon: temperature,
      label: "Temperature",
      value: "101 °C",
      color: "#27AE60",
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: "24 rpm",
      color: "#EF1E1E",
    },
    { icon: weight, label: "Weight", value: "100 kg", color: "#27AE60" },
    { icon: statusIcon, label: "Status", value: "Stable", color: "#27AE60" },
  ];

  const careTeam = {
    name: "Clarisse A.",
    role: "Geriatric Care",
    contact: "+966 558441502",
    nextVisit: "Aug 20, 2025 – 10:00 AM (Home Visit)",
    frequency: "Every 2 weeks",
    specialization:
      "Chronic disease management (hypertension, diabetes), IV therapy, palliative care",
  };

  const medicalHistory = [
    {
      date: "Aug 15, 2025",
      time: "10:00 AM",
      doctor: "Nurse Clarisse A.",
      diagnostic: "Routine Vitals Check",
      comments: "BP 128/78, Blood Sugar 110. Stable. No Urgent Concerns.",
    },
    {
      date: "Aug 15, 2025",
      time: "10:30 AM",
      doctor: "Dr. Robert M.",
      diagnostic: "Physical Exam",
      comments: "General Health Appears Good. Follow-Up in 6 Months.",
    },
    {
      date: "Aug 15, 2025",
      time: "11:30 AM",
      doctor: "Dr. Sarah T.",
      diagnostic: "X-Ray Interpretation",
      comments: "No Abnormalities Found In Chest X-Ray.",
    },
    {
      date: "Aug 15, 2025",
      time: "12:00 PM",
      doctor: "Nurse Leo B.",
      diagnostic: "Medication Review",
      comments:
        "Patient Adheres To Prescribed Regimen, No Side Effects Reported.",
    },
  ];

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#F7F9FB" }}
    >
      {/* Sidebar */}
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

        {/* Page Content */}
        <div
          style={{
            padding: "30px",
            overflowY: "auto",
            overflowX: "hidden", // 🚀 fix scroll
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Banner */}
          <Banner />

          {/* Patient Details */}
          <div style={cardStyle}>
            <SectionHeader title="Patient Details">
              <Primarybtn name="View Full Profile" />
              <SecondaryBtn name="Download" />
            </SectionHeader>

            {/* Profile */}
            <div style={profileBox}>
              <img
                src={patientdetails}
                alt="profile"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "12px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={infoGrid}>
                {patientInfo.map((item, i) => (
                  <InfoItem key={i} label={item.label} value={item.value} />
                ))}
              </div>
            </div>

            {/* Vitals */}
            <div style={vitalsGrid}>
              {vitals.map((item, i) => (
                <div key={i} style={vitalCard}>
                  <img
                    src={item.icon}
                    alt={item.label}
                    style={{ width: 24, height: 24, flexShrink: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <p style={vitalLabel}>{item.label}</p>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <div style={dotStyle(item.color)}></div>
                      <span style={vitalValue}>{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Care Team */}
          {/* <div style={cardStyle}>
            <SectionHeader title="Care Team Details">
              <Primarybtn name="View Reports" />
            </SectionHeader>
            <div style={profileBox}>
              <img
                src={patientdetails}
                alt="nurse"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "12px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={infoGrid}>
                <InfoItem label="Name" value={careTeam.name} />
                <InfoItem label="Role" value={careTeam.role} />
                <InfoItem label="Contact Number" value={careTeam.contact} />
                <InfoItem label="Next Visit" value={careTeam.nextVisit} />
                <InfoItem label="Visit Frequency" value={careTeam.frequency} />
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#4B5563", marginTop: 10 }}>
              {careTeam.specialization}
            </p>
          </div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              width: "100%",
              background: "#F9FAFB",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            {/* Left - Care Team Details */}
            <div
              style={{
                background: "#fff",
                flex: 1,
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#1B1B1B",
                  }}
                >
                  Care Team Details
                </p>
                <button
                  style={{
                    background: "#F5D565",
                    border: "1px solid #D4B543",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  View Reports
                </button>
              </div>

              {/* Profile Row */}
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                  borderTop: "1px solid #E5E7EB",
                  paddingTop: "15px",
                }}
              >
                <img
                  src={patientdetails}
                  alt="Profile"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px 20px",
                    flex: 1,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Name
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.name}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Role
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.role}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Contact Number
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.contact}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Next Visit
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.nextVisit}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Visit Frequency
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.frequency}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      Specialization
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {careTeam.specialization}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Upcoming Appointments */}
            <div
              style={{
                background: "#fff",
                width: "300px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#1B1B1B",
                  }}
                >
                  Upcoming Appointments
                </p>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#B38C1D",
                    cursor: "pointer",
                  }}
                >
                  View All
                </span>
              </div>

              {/* Month */}
              <div
                style={{
                  background: "#E8F0EA",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Aug 2025</span>
                <span style={{ display: "flex", gap: "8px" }}>
                  <span>{"<"}</span>
                  <span>{">"}</span>
                </span>
              </div>

              {/* Appointment 1 */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  background: "#004C91",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    background: "#00396E",
                    borderRadius: "6px",
                    width: "45px",
                    textAlign: "center",
                    padding: "5px 0",
                  }}
                >
                  <div style={{ fontSize: "13px" }}>Fri</div>
                  <div style={{ fontSize: "16px", fontWeight: 600 }}>14</div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    Dr. Ashton Cleve
                  </div>
                  <div style={{ fontSize: "13px" }}>10:00am - 10:30am</div>
                </div>
              </div>

              {/* Appointment 2 */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  background: "#F3F4F6",
                  borderRadius: "8px",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    background: "#E5E7EB",
                    borderRadius: "6px",
                    width: "45px",
                    textAlign: "center",
                    padding: "5px 0",
                  }}
                >
                  <div style={{ fontSize: "13px" }}>Sat</div>
                  <div style={{ fontSize: "16px", fontWeight: 600 }}>15</div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>
                    Dr. Ashton Cleve
                  </div>
                  <div style={{ fontSize: "13px" }}>10:00am - 10:30am</div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div style={cardStyle}>
            <SectionHeader title="Medical History">
              <Primarybtn name="Get Appointment" />
            </SectionHeader>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {[
                    "Date",
                    "Time",
                    "Doctor/Nurse",
                    "Diagnostic",
                    "Comments",
                  ].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {medicalHistory.map((row, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{row.date}</td>
                    <td style={tdStyle}>{row.time}</td>
                    <td style={tdStyle}>{row.doctor}</td>
                    <td style={tdStyle}>{row.diagnostic}</td>
                    <td style={tdStyle}>{row.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Reusable Section Header */
function SectionHeader({ title, children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        minWidth: 0,
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 600, color: "#1B1B1B" }}>{title}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

/* 🔹 Info Item (label + value) */
function InfoItem({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>
      <p
        style={{
          color: "#6B7280",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 3,
          wordBreak: "break-word",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#2E2E2E",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* 🔹 Styles */
const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  minWidth: 0,
};

const profileBox = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  border: "1px solid #E6E8EB",
  borderRadius: "10px",
  padding: "15px",
  minWidth: 0,
  flexWrap: "wrap",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // 🚀 responsive grid
  gap: "10px 20px",
  minWidth: 0,
  flex: 1,
};

const vitalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", // 🚀 responsive
  gap: 15,
  minWidth: 0,
  width: "100%",
};

const vitalCard = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #E6E8EB",
  borderRadius: "10px",
  padding: "10px",
  minHeight: "80px",
  minWidth: 0,
};

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed", // 🚀 keeps inside container
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontSize: 14,
  fontWeight: 600,
  color: "#1B1B1B",
  borderBottom: "1px solid #E6E8EB",
  wordBreak: "break-word",
};

const tdStyle = {
  padding: "12px",
  fontSize: 14,
  color: "#374151",
  borderBottom: "1px solid #F0F2F5",
  wordBreak: "break-word", // 🚀 wrap text
};
