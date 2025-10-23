import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import LoginBg from "../assets/images/loginBg.jpg";
import VerimedLogo from "../assets/icons/VerimedLogo.png";
import { base_url } from "../constants/constants";
import axios from "axios";

const { Title, Text } = Typography;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const userToken = localStorage.getItem("token");

  const onFinish = async (values) => {
    const { username, password } = values;
    setLoading(true);

    try {
      const res = await axios.post(`${base_url}/user_login/`, {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const userRes = await axios.get(`${base_url}/user_view/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const userData = userRes.data.find((user) => user.username === username);

      if (!userData) {
        message.error("User not found. Please check credentials.");
        setLoading(false);
        return;
      }

      const userRole = userData.user_role;

      localStorage.setItem("userData", JSON.stringify(userData));

      message.success("Login successful!");

      switch (userRole) {
        case "admin":
          window.location.href = "/overview";
          break;
        case "sponsor":
          window.location.href = "/overview";
          break;
        case "doctor":
          window.location.href = "/overview";
          break;
        case "patient":
          window.location.href = "/overview";
          break;
        case "care_taker":
          window.location.href = "/overview";
          break;
        default:
          message.error("Invalid user role.");
          break;
      }
    } catch (error) {
      console.log("Login error:", error);
      message.error("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Section */}
      <div style={{ display: "flex", width: "50%", position: "relative" }}>
        <img
          src={LoginBg}
          alt="Doctor and patient"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            color: "white",
            maxWidth: "80%",
          }}
        >
          <Title
            level={1}
            style={{
              color: "#fff",
              fontSize: 42,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Welcome to Verimed!
          </Title>
          <Text
            style={{
              color: "#f0f0f0",
              fontSize: 16,
              lineHeight: "1.5",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate
            ut laoreet velit ma.
          </Text>
        </div>
      </div>

      {/* Right Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9f9f9",
          padding: "40px 40px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={VerimedLogo}
            alt="Verimed Logo"
            style={{
              width: 140,
            }}
          />
        </div>

        {/* Centered Card with Form */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 8,
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Title
              level={3}
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#2E2E2E",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Sign In
            </Title>
            <Text
              type="secondary"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#6C7688",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Please enter below details to access the dashboard
            </Text>

            <Form
              name="login"
              layout="vertical"
              style={{ marginTop: 24 }}
              onFinish={onFinish}
            >
              <Form.Item label="User Name" name="username">
                <Input prefix={<MailOutlined />} size="large" />
              </Form.Item>

              <Form.Item label="Password" name="password">
                <Input.Password
                  prefix={<LockOutlined />}
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="#" style={{ color: "#f5222d" }}>
                  Forgot password?
                </a>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  style={{
                    background: "linear-gradient(180deg, #F0C330, #B78520)",
                    border: "none",
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* Footer */}
        <footer
          style={{
            fontSize: 12,
            color: "#888",
            textAlign: "center",
            paddingTop: 20,
          }}
        >
          © 2025 Verimed — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
