// import React from "react";
// import flagIcon from "../assets/icons/flag.svg";
// import logoutIcon from "../assets/icons/logout.svg";
// import notifyIcon from "../assets/icons/notify.svg";
// import searchIcon from "../assets/icons/search.svg";
// import downArrow from "../assets/icons/downArrow.svg";
// import Primarybtn from "./PrimaryBtn";

// export default function Header() {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "15px 20px",
//         backgroundColor: "#FFFFFF",
//         borderBottom: "1px solid #ddd",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       {/* Left Section */}
//       <div style={{ display: "flex", gap: "8px", fontSize: "16px" }}>
//         <span style={{ fontWeight: 700, fontSize: 18, color: "#2E2E2E" }}>
//           Sponsor –
//         </span>
//         <span style={{ fontWeight: 700, fontSize: 18, color: "#2E2E2E" }}>
//           Welcome Back, Jenifer Johnson
//         </span>
//       </div>

//       {/* Right Section */}
//       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//         {/* Dropdown */}
//         <select
//           style={{
//             backgroundColor: "#FFFFFF",
//             border: "1px solid #00000014",
//             borderRadius: "6px",
//             padding: "10px 12px",
//             fontSize: "14px",
//             color: "#2E2E2E",
//           }}
//         >
//           <option>Mr. Samuel N.</option>
//         </select>

//         <Primarybtn name="add a patient" onClick={() => {}} />

//         {/* Search Input */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             backgroundColor: "#F3F5F8",
//             borderRadius: "6px",
//             padding: "10px 12px",
//             border: "1px solid #00000014",
//           }}
//         >
//           <img
//             src={searchIcon}
//             alt="Search"
//             style={{ width: 16, height: 16, marginRight: 8 }}
//           />
//           <input
//             type="text"
//             placeholder="Search"
//             style={{
//               border: "none",
//               background: "transparent",
//               outline: "none",
//               fontSize: "14px",
//               width: "120px",
//             }}
//           />
//         </div>

//         {/* Language Selector */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "4px",
//             padding: "6px 8px",
//             cursor: "pointer",
//           }}
//         >
//           <img src={flagIcon} alt="Flag" style={{ width: 20, height: 20 }} />
//           <span style={{ fontSize: 14 }}>EN</span>
//           <span>
//             <img src={downArrow} alt="Down Arrow" />
//           </span>
//         </div>

//         {/* Notification Icon */}
//         <div
//           style={{
//             backgroundColor: "#F3F5F8",
//             padding: "3px 4px",
//             borderRadius: "8px",
//             cursor: "pointer",
//             border: "1px solid #00000014",
//           }}
//         >
//           <img
//             src={notifyIcon}
//             alt="Notifications"
//             style={{ width: 26, height: 26 }}
//           />
//         </div>

//         {/* Logout Icon */}
//         <div
//           style={{
//             backgroundColor: "#FF45451F",
//             padding: "3px 4px",
//             borderRadius: "8px",
//             cursor: "pointer",
//             border: "1px solid #FF4545",
//           }}
//         >
//           <img
//             src={logoutIcon}
//             alt="Logout"
//             style={{ width: 24, height: 24 }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import {
  Layout,
  Select,
  Input,
  Button,
  Space,
  Tooltip,
  Badge,
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
  const navigate = useNavigate();

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
    navigate("/");
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
        <span style={{ fontSize: 18 }}>Sponsor –</span>
        <span style={{ fontSize: 18, marginLeft: 4 }}>
          Welcome Back, Jenifer Johnson
        </span>
      </div>

      <Space size="middle" align="center">
        <Select
          defaultValue="Mr. Samuel N."
          style={{ width: 160, borderRadius: 6 }}
          dropdownMatchSelectWidth={false}
          bordered
        >
          <Option value="mr-samuel-n">Mr. Samuel N.</Option>
        </Select>

        <Primarybtn name="add a patient" onClick={() => {}} />

        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{
            width: 160,
            borderRadius: 6,
            backgroundColor: "#F3F5F8",
            borderColor: "rgba(0,0,0,0.08)",
          }}
          allowClear
        />

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

        <Tooltip title="Notifications">
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
        </Tooltip>

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
