// import React, { useEffect, useState } from "react";
// import {
//   Layout,
//   Select,
//   Input,
//   Button,
//   Space,
//   Tooltip,
//   Dropdown,
//   Menu,
// } from "antd";
// import {
//   SearchOutlined,
//   DownOutlined,
//   BellOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";
// import flagIcon from "../assets/icons/flag.svg";
// import Primarybtn from "./PrimaryBtn";
// import { useNavigate } from "react-router-dom";

// const { Header } = Layout;
// const { Option } = Select;

// export default function HeaderComponent() {
//   const [language, setLanguage] = useState("EN");
//   const [patients, setPatients] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const navigate = useNavigate();

//   const data = localStorage.getItem("userData");
//   const user = data ? JSON.parse(data) : null;

//   const handleLanguageChange = (lang) => {
//     setLanguage(lang);
//   };

//   const languageMenu = (
//     <Menu
//       onClick={(e) => handleLanguageChange(e.key)}
//       items={[
//         { key: "EN", label: "English" },
//         { key: "FR", label: "French" },
//         { key: "ES", label: "Spanish" },
//         { key: "DE", label: "German" },
//       ]}
//     />
//   );

//   const unreadCount = 3;

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   useEffect(() => {
//     const storedAppointments = localStorage.getItem("sponsorAppointments");
//     if (storedAppointments) {
//       try {
//         const parsedAppointments = JSON.parse(storedAppointments);

//         const uniquePatientsMap = new Map();
//         parsedAppointments.forEach((item) => {
//           const patientUser = item?.patient?.user;
//           if (patientUser && !uniquePatientsMap.has(patientUser.id)) {
//             uniquePatientsMap.set(patientUser.id, patientUser);
//           }
//         });

//         const patientList = Array.from(uniquePatientsMap.values());
//         setPatients(patientList);

//         if (patientList.length > 0) {
//           setSelectedPatient(patientList[0].id);
//           localStorage.setItem("selectedPatientId", patientList[0].id);
//         }
//       } catch (error) {
//         console.error("Error parsing sponsor appointments:", error);
//       }
//     }
//   }, []);

//   const handlePatientChange = (value) => {
//     setSelectedPatient(value);
//     localStorage.setItem("selectedPatientId", value);

//     const storedAppointments = localStorage.getItem("sponsorAppointments");
//     if (storedAppointments) {
//       try {
//         const parsedAppointments = JSON.parse(storedAppointments);

//         const patientAppointments = parsedAppointments.filter(
//           (item) => item?.patient?.user?.id === value
//         );

//         if (patientAppointments.length > 0) {
//           console.log(patientAppointments[0]?.patient?.user);
//           console.log(
//             "🗓️ All Appointments for this Patient:",
//             patientAppointments
//           );
//         } else {
//           console.warn("No appointments found for this patient ID:", value);
//         }
//       } catch (error) {
//         console.error("Error retrieving appointments:", error);
//       }
//     }
//   };

//   return (
//     <Header
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "0 20px",
//         backgroundColor: "#FFFFFF",
//         borderBottom: "1px solid #ddd",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       {/* Left Section */}
//       <div
//         style={{
//           display: "flex",
//           gap: 8,
//           fontSize: 16,
//           fontWeight: 700,
//           color: "#2E2E2E",
//           flexBasis: "40%",
//           minWidth: 0,
//           overflowWrap: "break-word",
//           lineHeight: 1.3,
//           wordBreak: "break-word",
//           flexWrap: "wrap",
//         }}
//       >
//         <span style={{ fontSize: 18 }}>{user?.username} –</span>
//         <span style={{ fontSize: 18, marginLeft: 4 }}>
//           Welcome Back, {user?.first_name}
//         </span>
//       </div>

//       {/* Right Section */}
//       <Space size="middle" align="center">
//         {/* 🟢 Patient dropdown */}
//         <Select
//           value={selectedPatient}
//           onChange={handlePatientChange}
//           style={{ width: 200, borderRadius: 6 }}
//           placeholder="Select Patient"
//           dropdownMatchSelectWidth={false}
//           bordered
//         >
//           {patients.map((p) => (
//             <Option key={p.id} value={p.id}>
//               {`${p.first_name} ${p.last_name}`}
//             </Option>
//           ))}
//         </Select>

//         <Primarybtn name="Enroll Loved One" onClick={() => {}} />

//         {/* <Input
//           placeholder="Search"
//           prefix={<SearchOutlined />}
//           style={{
//             width: 160,
//             borderRadius: 6,
//             backgroundColor: "#F3F5F8",
//             borderColor: "rgba(0,0,0,0.08)",
//           }}
//           allowClear
//         /> */}

//         <Dropdown
//           overlay={languageMenu}
//           placement="bottomRight"
//           trigger={["click"]}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 4,
//               padding: "6px 8px",
//               cursor: "pointer",
//               userSelect: "none",
//             }}
//           >
//             <img src={flagIcon} alt="Flag" style={{ width: 20, height: 20 }} />
//             <span style={{ fontSize: 14, color: "#2E2E2E" }}>{language}</span>
//             <DownOutlined style={{ fontSize: 12, color: "#2E2E2E" }} />
//           </div>
//         </Dropdown>

//         {/* <Tooltip title="Notifications">
//           <Badge dot={unreadCount > 0} offset={[-2, 2]}>
//             <Button
//               shape="circle"
//               icon={<BellOutlined style={{ fontSize: 18 }} />}
//               style={{
//                 backgroundColor: "#F3F5F8",
//                 borderColor: "rgba(0,0,0,0.08)",
//                 borderRadius: 8,
//               }}
//             />
//           </Badge>
//         </Tooltip> */}

//         <Tooltip title="Logout">
//           <Button
//             shape="circle"
//             icon={<LogoutOutlined style={{ color: "#FF4545", fontSize: 18 }} />}
//             style={{
//               backgroundColor: "#FF45451F",
//               borderColor: "#FF4545",
//               borderRadius: 8,
//             }}
//             onClick={handleLogout}
//           />
//         </Tooltip>
//       </Space>
//     </Header>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  Layout,
  Select,
  Input,
  Button,
  Space,
  Tooltip,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import flagIcon from "../assets/icons/flag.svg";
import Primarybtn from "./PrimaryBtn";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Option } = Select;

export default function HeaderComponent() {
  const [language, setLanguage] = useState("EN");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const languageMenu = (
    <Menu
      onClick={(e) => handleLanguageChange(e.key)}
      items={[
        { key: "EN", label: "English" },
        { key: "FR", label: "French" },
        { key: "ES", label: "Spanish" },
        { key: "DE", label: "German" },
      ]}
    />
  );

  const unreadCount = 3;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🟢 Load patients from sponsorAppointments and auto-select first one
  useEffect(() => {
    const storedAppointments = localStorage.getItem("sponsorAppointments");
    if (storedAppointments) {
      try {
        const parsedAppointments = JSON.parse(storedAppointments);

        // Extract unique patients from appointment data
        const uniquePatientsMap = new Map();
        parsedAppointments.forEach((item) => {
          const patientUser = item?.patient?.user;
          if (patientUser && !uniquePatientsMap.has(patientUser.id)) {
            uniquePatientsMap.set(patientUser.id, patientUser);
          }
        });

        const patientList = Array.from(uniquePatientsMap.values());
        setPatients(patientList);

        // ✅ Auto-select logic for single or multiple patients
        if (patientList.length > 0) {
          const defaultPatient = patientList[0];
          setSelectedPatient(defaultPatient.id);
          localStorage.setItem("selectedPatientId", defaultPatient.id);

          // 🟢 Also show that patient's full details immediately
          showPatientDetails(defaultPatient.id);
        }
      } catch (error) {
        console.error("Error parsing sponsor appointments:", error);
      }
    }
  }, []);

  const showPatientDetails = (patientId) => {
    const storedAppointments = localStorage.getItem("sponsorAppointments");
    if (storedAppointments) {
      try {
        const parsedAppointments = JSON.parse(storedAppointments);
        const patientAppointments = parsedAppointments.filter(
          (item) => item?.patient?.user?.id === patientId
        );

        if (patientAppointments.length > 0) {
          const patientDetails = patientAppointments[0]?.patient?.user;

          console.log("🟢 Selected Patient Details:", patientDetails);
          console.log(
            "🗓️ All Appointments for this Patient:",
            patientAppointments
          );

          // 🟡 Store in localStorage
          localStorage.setItem(
            "selectedPatientDetails",
            JSON.stringify(patientDetails)
          );
          localStorage.setItem(
            "selectedPatientAppointments",
            JSON.stringify(patientAppointments)
          );
        } else {
          console.warn("No appointments found for this patient ID:", patientId);
          // optional: clear previous data
          localStorage.removeItem("selectedPatientDetails");
          localStorage.removeItem("selectedPatientAppointments");
        }
      } catch (error) {
        console.error("Error retrieving patient details:", error);
      }
    }
  };

  const handlePatientChange = (value) => {
    setSelectedPatient(value);
    localStorage.setItem("selectedPatientId", value);
    showPatientDetails(value);
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #ddd",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Section */}
      <div
        style={{
          display: "flex",
          gap: 8,
          fontSize: 16,
          fontWeight: 700,
          color: "#2E2E2E",
          flexBasis: "40%",
          minWidth: 0,
          overflowWrap: "break-word",
          lineHeight: 1.3,
          wordBreak: "break-word",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 18 }}>{user?.username} –</span>
        <span style={{ fontSize: 18, marginLeft: 4 }}>
          Welcome Back, {user?.first_name}
        </span>
      </div>

      {/* Right Section */}
      <Space size="middle" align="center">
        {/* 🟢 Patient dropdown */}
        <Select
          value={selectedPatient}
          onChange={handlePatientChange}
          style={{ width: 200, borderRadius: 6 }}
          placeholder="Select Patient"
          dropdownMatchSelectWidth={false}
          bordered
        >
          {patients.map((p) => (
            <Option key={p.id} value={p.id}>
              {`${p.first_name} ${p.last_name}`}
            </Option>
          ))}
        </Select>

        <Primarybtn name="Enroll Loved One" onClick={() => {}} />

        {/* <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{
            width: 160,
            borderRadius: 6,
            backgroundColor: "#F3F5F8",
            borderColor: "rgba(0,0,0,0.08)",
          }}
          allowClear
        /> */}

        <Dropdown
          overlay={languageMenu}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 8px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <img src={flagIcon} alt="Flag" style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 14, color: "#2E2E2E" }}>{language}</span>
            <DownOutlined style={{ fontSize: 12, color: "#2E2E2E" }} />
          </div>
        </Dropdown>

        {/* <Tooltip title="Notifications">
          <Badge dot={unreadCount > 0} offset={[-2, 2]}>
            <Button
              shape="circle"
              icon={<BellOutlined style={{ fontSize: 18 }} />}
              style={{
                backgroundColor: "#F3F5F8",
                borderColor: "rgba(0,0,0,0.08)",
                borderRadius: 8,
              }}
            />
          </Badge>
        </Tooltip> */}

        <Tooltip title="Logout">
          <Button
            shape="circle"
            icon={<LogoutOutlined style={{ color: "#FF4545", fontSize: 18 }} />}
            style={{
              backgroundColor: "#FF45451F",
              borderColor: "#FF4545",
              borderRadius: 8,
            }}
            onClick={handleLogout}
          />
        </Tooltip>
      </Space>
    </Header>
  );
}
