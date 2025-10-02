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
  HeartOutlined,
} from "@ant-design/icons";
import VerimedLogo from "../assets/icons/VerimedLogo.png";
import Profile from "../assets/images/profileBg.jpg";

const { Sider } = Layout;
const { Text } = Typography;

const menuConfig = {
  sponsor: [
    { label: "Overview", icon: <HomeOutlined />, path: "/overview" },
    { label: "My Loved Ones", icon: <UserOutlined />, path: "/my_loved_ones" },
    {
      label: "Appointments",
      icon: <CalendarOutlined />,
      path: "/appointments",
    },
    { label: "Care Team", icon: <TeamOutlined />, path: "/care_team" },
    { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
    {
      label: "Billing & Membership",
      icon: <DollarOutlined />,
      path: "/billing_and_membership",
    },
  ],
  patient: [
    { label: "Overview", icon: <HomeOutlined />, path: "/overview" },
    { label: "My Reports", icon: <CalendarOutlined />, path: "/my_reports" },
    { label: "My Care Taker", icon: <TeamOutlined />, path: "/my_care_taker" },
    {
      label: "Appointments",
      icon: <CalendarOutlined />,
      path: "/appointments",
    },
    { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
  ],
  care: [
    { label: "Overview", icon: <HomeOutlined />, path: "/overview" },
    {
      label: "My Patients",
      icon: <UserOutlined />,
      path: "/my_patients",
    },
    {
      label: "Daily Reports",
      icon: <CalendarOutlined />,
      path: "/daily_reports",
    },
    {
      label: "Health Monitoring",
      icon: <HeartOutlined />,
      path: "/health_monitoring",
    },
    { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
  ],
  doctor: [
    { label: "Overview", icon: <HomeOutlined />, path: "/overview" },
    {
      label: "My Appointments",
      icon: <CalendarOutlined />,
      path: "/my_appointments",
    },
    {
      label: "My Patients",
      icon: <UserOutlined />,
      path: "/my_patients",
    },
    {
      label: "Reports To Review",
      icon: <CalendarOutlined />,
      path: "/reports_to_review",
    },
    { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
    { label: "Masters", icon: <SettingOutlined />, path: "/master" },
  ],
};

export default function CustomSider() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;

  const filteredMenuItems = menuConfig[user?.type] || menuConfig["patient"];

  const activeItem =
    filteredMenuItems.find((item) => location.pathname.startsWith(item.path))
      ?.path || filteredMenuItems[0].path;

  return (
    <Sider
      width={240}
      style={{
        height: "100vh",
        background: "#007F5F1F",
        position: "sticky",
        top: 0,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // 👈 keeps top and bottom separate
      }}
    >
      {/* TOP SECTION */}
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
          }}
          style={{
            background: "transparent",
            borderInlineEnd: "none",
          }}
          items={filteredMenuItems.map(({ label, icon, path }) => ({
            key: path,
            icon,
            label,
            style:
              activeItem === path
                ? {
                    background: "#FFFFFF",
                    border: "1px solid #007F5F",
                    borderRadius: "200px",
                    color: "#2E2E2E",
                    fontWeight: 500,
                  }
                : {
                    background: "transparent",
                    border: "1px solid transparent",
                    borderRadius: "200px",
                    color: "#2E2E2E",
                    fontWeight: 500,
                  },
          }))}
        />
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ textAlign: "center", marginTop: "25%" }}>
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
