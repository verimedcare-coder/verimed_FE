// import React, { useState } from "react";
// import VerimedLogo from "../assets/icons/VerimedLogo.png";
// import Profile from "../assets/images/profileBg.jpg";

// export default function Sider() {
//   const [activeItem, setActiveItem] = useState("Overview");

//   const menuItems = [
//     "Overview",
//     "My Loved Ones",
//     "Appointments",
//     "Care Team",
//     "Messages",
//     "Billing & Membership",
//   ];

//   const handleClick = (item) => {
//     setActiveItem(item);
//     console.log(`${item} clicked`);
//   };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         width: "240px",
//         background: "#007F5F1F",
//         padding: "20px 30px",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         alignItems: "center",
//         boxSizing: "border-box",
//       }}
//     >
//       <div>
//         {/* Logo */}
//         <div
//           style={{ width: "100%", display: "flex", justifyContent: "center" }}
//         >
//           <img
//             src={VerimedLogo}
//             alt="Verimed Logo"
//             style={{ width: "80%", objectFit: "contain" }}
//           />
//         </div>

//         {/* Profile Section */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: "6px",
//             marginTop: "10px",
//           }}
//         >
//           <img
//             src={Profile}
//             alt="Profile"
//             style={{ height: 67, width: 67, borderRadius: "50%" }}
//           />
//           <p
//             style={{
//               color: "#2E2E2E",
//               fontSize: 16,
//               fontWeight: 800,
//               margin: 0,
//             }}
//           >
//             Jennifer Johnson
//           </p>
//           <p
//             style={{
//               color: "#2E2E2E",
//               fontSize: 12,
//               fontWeight: 400,
//               margin: 0,
//             }}
//           >
//             jenniferjenni1245@gmail.com
//           </p>
//         </div>

//         {/* Menu Items */}
//         <div style={{ width: "100%", marginTop: "20px" }}>
//           {menuItems.map((item) => (
//             <div
//               key={item}
//               onClick={() => handleClick(item)}
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 alignItems: "flex-start",
//                 background: activeItem === item ? "#FFFFFF" : "transparent",
//                 borderRadius: activeItem === item ? "200px" : "0px",
//                 border:
//                   activeItem === item
//                     ? "1px solid #007F5F"
//                     : "1px solid transparent",
//                 padding: "10px 16px",
//                 width: "90%",
//                 margin: "5px auto",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease-in-out",
//               }}
//             >
//               <p
//                 style={{
//                   fontWeight: 500,
//                   fontSize: 14,
//                   color: "#2E2E2E",
//                   margin: 0,
//                 }}
//               >
//                 {item}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Settings Button */}
//       <div style={{ width: "100%", padding: "10px" }}>
//         <button
//           onClick={() => alert("Settings clicked")}
//           style={{
//             width: "100%",
//             background: "#FFFFFF",
//             border: "1px solid #E0E0E0",
//             borderRadius: "50px",
//             padding: "10px 0",
//             fontSize: 14,
//             cursor: "pointer",
//           }}
//         >
//           Settings
//         </button>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Layout, Menu, Avatar, Button, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined,
  DollarOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import VerimedLogo from "../assets/icons/VerimedLogo.png";
import Profile from "../assets/images/profileBg.jpg";

const { Sider } = Layout;
const { Text } = Typography;

const menuItems = [
  { label: "Overview", icon: <HomeOutlined />, path: "/overview" },
  { label: "My Loved Ones", icon: <UserOutlined />, path: "/my_loved_ones" },
  { label: "Appointments", icon: <CalendarOutlined />, path: "/appointments" },
  { label: "Care Team", icon: <TeamOutlined />, path: "/care_team" },
  { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
  {
    label: "Billing & Membership",
    icon: <DollarOutlined />,
    path: "/billing_and_membership",
  },
];

export default function CustomSider() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current active menu key by matching current pathname with menu paths
  const activeItem =
    menuItems.find((item) => location.pathname.startsWith(item.path))?.path ||
    "/overview";

  return (
    <Sider
      width={240}
      style={{
        height: "100vh",
        background: "#007F5F1F",
        position: "sticky",
        top: 0,
        padding: "20px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={VerimedLogo}
            alt="Verimed Logo"
            style={{ width: "80%", objectFit: "contain" }}
          />
        </div>

        {/* Profile Section */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar src={Profile} size={67} />
          <div style={{ marginTop: 10 }}>
            <Text strong style={{ fontSize: 16, display: "block" }}>
              Jennifer Johnson
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              jenniferjenni1245@gmail.com
            </Text>
          </div>
        </div>

        {/* Menu Section */}
        <Menu
          mode="inline"
          selectedKeys={[activeItem]}
          onClick={({ key }) => {
            navigate(key);
            console.log(`Navigating to ${key}`);
          }}
          style={{
            background: "transparent",
            borderInlineEnd: "none",
          }}
          items={menuItems.map(({ label, icon, path }) => ({
            key: path,
            icon,
            label,
          }))}
        />
      </div>

      {/* Settings Button */}
      <div style={{ textAlign: "center", paddingTop: 10 }}>
        <Button
          icon={<SettingOutlined />}
          block
          shape="round"
          onClick={() => alert("Settings clicked")}
        >
          Settings
        </Button>
      </div>
    </Sider>
  );
}
