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

  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;

  const getTitle = () => {
    switch (user?.type) {
      case "admin":
        return "Admin";
      case "sponsor":
        return "Sponsor";
      case "patient":
        return "Patient";
      case "care":
        return "Care Taker";
      case "doctor":
        return "Doctor";
      default:
        return "";
    }
  };

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
        <span style={{ fontSize: 18 }}>{getTitle()} –</span>
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
