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
import LoginBg from "../../assets/images/loginBg.jpg";
import VerimedLogo from "../../assets/icons/VerimedLogo.png";
import { base_url } from "../../constants/constants";
import apiClient from "../../services/apiClient";
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

      await apiClient.patch('/user_update_user/', formData, {
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
    <div className="flex min-h-screen overflow-hidden font-sans">
      {/* Left Section — identical to LoginScreen */}
      <div className="flex w-[50%] relative">
        <img
          src={LoginBg}
          alt="Doctor and patient"
          className="w-full h-full object-cover brightness-[0.3]"
        />
        <div className="absolute p-[20px] max-w-[80%] bottom-[40px] left-[40px]">
          <Title
            level={1}
            className="text-[#ffffffff] text-[44px] font-bold mb-[10px]"
          >
            Reset Your Password
          </Title>
          <Text className="text-[#f0f0f0] text-[18px] leading-[1.5]">
            Enter your username and choose a new secure password. Your account
            details remain unchanged.
          </Text>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="flex-1 flex flex-col bg-[#f9f9f9] py-[40px] px-[40px]"
      >
        {/* Logo */}
        <div className="text-center mb-[20px]">
          <img src={VerimedLogo} alt="Verimed Logo" className="w-[140px]" />
        </div>

        {/* Card */}
        <div
          className="flex-1 flex items-center justify-center"
        >
          <Card className="w-full max-w-[400px] rounded-[8px] shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
            {/* Back to login */}
            <button
              onClick={() => navigate("/")}
              className="border-none cursor-pointer flex items-center gap-[6px] text-[#6C7688] text-[13px] p-0 mb-[20px] bg-transparent"
            >
              <ArrowLeftOutlined />
              Back to Login
            </button>

            {success ? (
              /* Success state */
              <div className="text-center py-[20px] px-[0px]">
                <CheckCircleOutlined
                  className="text-[56px] text-[#52c41a] mb-[16px]"
                />
                <Title level={4} className="text-[#2E2E2E] mb-[8px]">
                  Password Updated!
                </Title>
                <Text type="secondary">Redirecting you to the login page…</Text>
              </div>
            ) : (
              <>
                <Title
                  level={3}
                  className="text-[24px] font-bold text-[#2E2E2E] mb-[8px] text-center"
                >
                  Forgot Password
                </Title>
                <Text
                  type="secondary"
                  className="text-[14px] text-[#6C7688] block text-center mb-[24px]"
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

                  <Form.Item className="mt-[8px]">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      loading={loading}
                      className="bg-[linear-gradient(180deg,#F0C330,#B78520)] border-none font-semibold"
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
          className="text-[12px] text-[#888] text-center pt-[20px]"
        >
          © 2025 Verimed — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
