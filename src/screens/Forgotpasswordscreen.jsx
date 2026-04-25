import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  notification,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import LoginBg from "../assets/images/loginBg.jpg";
import VerimedLogo from "../assets/icons/VerimedLogo.png";
import { base_url } from "../constants/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { username, password } = values;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append(
        "user_update_data",
        JSON.stringify({ username, password }),
      );

      await axios.patch(`${base_url}/user_update_user/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      notification.success({
        message: "Password updated successfully!",
        description: "You can now log in with your new password.",
        placement: "topRight",
        duration: 3,
      });

      setTimeout(() => {
        navigate("/", {
          state: { message: "Password changed. Please log in." },
        });
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to reset password. Please check your username and try again.";
      message.error(detail);
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
      {/* Left Section — identical to LoginScreen */}
      <div style={{ display: "flex", width: "50%", position: "relative" }}>
        <img
          src={LoginBg}
          alt="Doctor and patient"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            padding: 20,
            maxWidth: "80%",
          }}
        >
          <Title
            level={1}
            style={{
              color: "#ffffffff",
              fontSize: 44,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Reset Your Password
          </Title>
          <Text
            style={{
              color: "#f0f0f0",
              fontSize: 18,
              lineHeight: "1.5",
            }}
          >
            Enter your username and choose a new secure password. Your account
            details remain unchanged.
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
          <img src={VerimedLogo} alt="Verimed Logo" style={{ width: 140 }} />
        </div>

        {/* Card */}
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
            {/* Back to login */}
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#6C7688",
                fontSize: 13,
                padding: 0,
                marginBottom: 20,
              }}
            >
              <ArrowLeftOutlined />
              Back to Login
            </button>

            {success ? (
              /* Success state */
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <CheckCircleOutlined
                  style={{ fontSize: 56, color: "#52c41a", marginBottom: 16 }}
                />
                <Title level={4} style={{ color: "#2E2E2E", marginBottom: 8 }}>
                  Password Updated!
                </Title>
                <Text type="secondary">Redirecting you to the login page…</Text>
              </div>
            ) : (
              <>
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
                  Forgot Password
                </Title>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 14,
                    color: "#6C7688",
                    display: "block",
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  Enter your username and set a new password
                </Text>

                <Form
                  name="forgot_password"
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  {/* Username */}
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      { required: true, message: "Please enter your username" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      size="large"
                      placeholder="Enter your username"
                    />
                  </Form.Item>

                  {/* New Password */}
                  <Form.Item
                    label="New Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password",
                      },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      size="large"
                      placeholder="Enter new password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  {/* Confirm Password — validation only, NOT sent to API */}
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your new password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match!"),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      size="large"
                      placeholder="Re-enter new password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item style={{ marginTop: 8 }}>
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
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </Card>
        </div>

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
