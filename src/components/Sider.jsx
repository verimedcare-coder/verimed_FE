import {
  Layout,
  Menu,
  Avatar,
  Button,
  Typography,
  Modal,
  notification,
} from "antd";
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
  EditOutlined,
} from "@ant-design/icons";
import VerimedLogo from "../assets/icons/VerimedLogo.png";
import Profile from "../assets/images/profileBg.jpg";
import { useState } from "react";
import { Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Sider } = Layout;
const { Text } = Typography;

const menuConfig = {
  admin: [
    { label: "Overview", icon: <HomeOutlined />, path: "/overview" },
    {
      label: "User Management",
      icon: <UserOutlined />,
      path: "/user_management",
    },
    {
      label: "Appointments",
      icon: <CalendarOutlined />,
      path: "/appointments",
    },
    { label: "Departments", icon: <TeamOutlined />, path: "/departments" },
    {
      label: "Membership Plans",
      icon: <DollarOutlined />,
      path: "/membership_plans",
    },
    // {
    //   label: "Messages / Support",
    //   icon: <MessageOutlined />,
    //   path: "/support",
    // },
  ],
  sponsor: [
    { label: "Overview", icon: <HomeOutlined />, path: "/overview" },
    { label: "My Loved Ones", icon: <UserOutlined />, path: "/my_loved_ones" },
    {
      label: "Appointments",
      icon: <CalendarOutlined />,
      path: "/appointments",
    },
    { label: "Care Team", icon: <TeamOutlined />, path: "/care_team" },
    // { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
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
    // { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
  ],
  care_taker: [
    { label: "Overview", icon: <HomeOutlined />, path: "/overview" },
    {
      label: "Appointments",
      icon: <CalendarOutlined />,
      path: "/appointments",
    },
    {
      label: "My Patients",
      icon: <UserOutlined />,
      path: "/my_patients",
    },
    // {
    //   label: "Daily Reports",
    //   icon: <CalendarOutlined />,
    //   path: "/daily_reports",
    // },
    // {
    //   label: "Health Monitoring",
    //   icon: <HeartOutlined />,
    //   path: "/health_monitoring",
    // },
    // { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
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
    // {
    //   label: "Reports To Review",
    //   icon: <CalendarOutlined />,
    //   path: "/reports_to_review",
    // },
    // { label: "Messages", icon: <MessageOutlined />, path: "/messages" },
  ],
};

export default function CustomSider() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = localStorage.getItem("userData");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sponsorData = JSON.parse(localStorage.getItem("sponsorData"));
  // const user = sponsorData?.user;
  const user = data ? JSON.parse(data) : null;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const filteredMenuItems =
    menuConfig[user?.user_role] || menuConfig["patient"];

  const activeItem =
    filteredMenuItems.find((item) =>
      (location?.pathname || "").startsWith(item.path),
    )?.path || filteredMenuItems[0].path;

  const handleEditClick = () => {
    if (!user) return;

    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone?.split("-")[1] || "",
    });

    if (user.photo_view_url) {
      setFileList([
        {
          uid: "-1",
          name: "profile.png",
          status: "done",
          url: user.photo_view_url,
        },
      ]);
    } else {
      setFileList([]);
    }

    setIsModalOpen(true);
  };

  const base_url = "https://verimedramja.pythonanywhere.com/verimed/";
  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem("token");

      const user_update_data = {
        updateid: user.id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        countrycode: "IN",
        phone: values.phone,
      };

      const formData = new FormData();
      formData.append("user_update_data", JSON.stringify(user_update_data));

      if (fileList[0]?.originFileObj) {
        formData.append("photo", fileList[0].originFileObj);
      }

      await axios.patch(`${base_url}/user_update/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      notification.success({ message: "Profile updated successfully" });
      notification.info({
        message: "Session expired",
        description: "Please log in again to continue",
      });
      // setIsModalOpen(false);
      localStorage.removeItem("token");
      navigate("/", {
        state: {
          message: "Session expired. Please log in again.",
        },
      });
    } catch (err) {
      notification.error({
        message: "Update failed",
        description: err.response?.data || "Something went wrong",
      });
    }
  };

  const getPhotoUrl = (url) => {
    // Guard against null/undefined url
    if (!url) return Profile;
    if (url?.startsWith("http")) return url;

    url = url.replace(/^\/media\/+/i, "/");

    const base = base_url.replace(/\/+$/, "");
    const cleanedUrl = url.replace(/^\/+/, "");

    const finalUrl = `${base}/${cleanedUrl}`;

    return finalUrl;
  };

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
        {/* <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar src={getPhotoUrl(user?.photo_view_url)} size={67} />
          <div style={{ marginTop: 10 }}>
            <Text strong style={{ fontSize: 16, display: "block" }}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Text>
          </div>
        </div> */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {/* Edit Icon */}

          <Avatar src={getPhotoUrl(user?.photo_view_url)} size={67} />

          <div style={{ marginTop: 10 }}>
            <Text strong style={{ fontSize: 16, display: "block" }}>
              {user?.first_name} {user?.last_name}
            </Text>

            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Text>

            <Button
              style={{ marginTop: 10, height: 25 }}
              onClick={handleEditClick}
            >
              Edit Profile
              <EditOutlined />{" "}
            </Button>
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
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="first_name" label="First Name" required>
            <Input />
          </Form.Item>

          <Form.Item name="last_name" label="Last Name" required>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" required>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone" required>
            <Input />
          </Form.Item>

          <Form.Item label="Profile Photo">
            <Upload
              listType="picture-circle"
              fileList={fileList}
              beforeUpload={() => false}
              maxCount={1}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={() => setFileList([])}
            >
              {fileList.length === 0 && <UploadOutlined />}
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Update Profile
          </Button>
        </Form>
      </Modal>
    </Sider>
  );
}
