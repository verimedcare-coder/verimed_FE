/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loginService } from "../services/loginService";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Typography,
  notification,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import LoginBg from "../assets/images/loginBg.jpg";
import VerimedLogo from "../assets/icons/VerimedLogo.png";
import { base_url, isAdminUser } from "../constants/constants";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function LoginScreen() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Single helper — always uses notification (not message) so toasts are visible
  // even when a redirect is about to happen
  const notify = (type, msg) => {
    api[type]({
      message: msg,
      placement: "topRight",
      duration: type === "error" ? 4 : 2,
    });
  };

  const [user] = useState(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });

  const location = useLocation();

  // Show any message passed via navigation state (e.g. from ForgotPassword)
  useEffect(() => {
    if (location.state?.message) {
      notify("info", location.state.message);
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const token = localStorage.getItem("token");

  // ─── Sponsor helpers (unchanged) ─────────────────────────────────────────
  const fetchSponsorProfile = async (userId, token) => {
    if (!userId || !token) return;
    try {
      const sponsorList = await loginService.getSponsorProfiles();
      const matchedSponsor = (Array.isArray(sponsorList) ? sponsorList : []).find((s) => s.user.id === userId);
      if (matchedSponsor) {
        localStorage.setItem("sponsorData", JSON.stringify(matchedSponsor));
        localStorage.setItem("sponsorProfileId", matchedSponsor.id);
        await fetchSponsorPatients(matchedSponsor.id, token);
        await fetchSponsorAppointments(token);
      }
    } catch (error) {
      console.error("Error fetching sponsor profile:", error);
      notify("error", "Failed to load sponsor profile");
    }
  };

  const fetchSponsorPatients = async (sponsorProfileId, token) => {
    if (!sponsorProfileId || !token) return;
    try {
      const patients = await loginService.getSponsorPatients(sponsorProfileId);
      if (Array.isArray(patients) && patients.length > 0) {
        localStorage.setItem("sponsorPatientIds", JSON.stringify(patients.map((p) => p.id)));
        localStorage.setItem("sponsorPatientData", JSON.stringify(patients));
      } else {
        localStorage.removeItem("sponsorPatientIds");
        localStorage.removeItem("sponsorPatientData");
      }
    } catch (error) {
      console.error("Error fetching sponsor patients:", error);
      notify("error", "Failed to load sponsor patients");
    }
  };

  const fetchSponsorAppointments = async (token) => {
    try {
      const sponsorProfileId = localStorage.getItem("sponsorProfileId");
      const sponsorPatientIds = JSON.parse(
        localStorage.getItem("sponsorPatientIds") || "[]",
      );
      if (!sponsorProfileId || sponsorPatientIds.length === 0) return;

      const data = await loginService.getPatientAppointments(sponsorPatientIds[0]);
      const filtered = (Array.isArray(data) ? data : []).filter(
        (item) =>
          item?.patient?.sponsor === Number(sponsorProfileId) &&
          sponsorPatientIds.includes(item?.patient?.id),
      );
      localStorage.setItem("sponsorAppointments", JSON.stringify(filtered));
    } catch (error) {
      console.error("Error fetching sponsor appointments:", error);
      notify("error", "Failed to load sponsor appointments");
    }
  };

  // ─── Login ────────────────────────────────────────────────────────────────
  const onFinish = async (values) => {
    const { username, password } = values;
    setLoading(true);

    try {
      // Step 1 — authenticate
      const res = await loginService.login({ username, password });
      const token = res.token;
      localStorage.setItem("token", token);

      // Step 2 — get user details
      const userList = await loginService.getUsers();
      const userData = (Array.isArray(userList) ? userList : []).find((u) => u.username === username);

      if (!userData) {
        notify("error", "User not found. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Special case: treat id 100 as admin
      if (isAdminUser(userData) && userData.user_role !== "admin") {
        userData.user_role = "admin";
      }

      localStorage.setItem("userData", JSON.stringify(userData));

      if (userData.user_role === "sponsor") {
        await fetchSponsorProfile(userData.id, token);
      }

      // Step 3 — notify success, then redirect after toast is visible
      const roleRouteMap = {
        admin: "/overview",
        sponsor: "/overview",
        doctor: "/overview",
        patient: "/overview",
        care_taker: "/overview",
      };

      const route = roleRouteMap[userData.user_role];

      if (route) {
        notify("success", "Login successful! Redirecting…");
        // Small delay so the success toast renders before navigation
        setTimeout(() => {
          navigate(route);
        }, 800);
      } else {
        notify("error", "Invalid user role. Please contact support.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);

      // Surface the exact backend error message
      const backendMsg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Invalid username or password. Please try again.";

      notify("error", backendMsg);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useQuery({
    queryKey: ["sponsorProfileInit", user?.id],
    queryFn: async () => {
      await fetchSponsorProfile(user.id, token);
      return true;
    },
    enabled: !!user && !!token && user.user_role === "sponsor",
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {contextHolder}
      {/* Left Section */}
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
            Welcome to Verimed!
          </Title>
          <Text style={{ color: "#f0f0f0", fontSize: 18, lineHeight: "1.5" }}>
            Home Health and Geriatric Wellness for Cameroon's Global Families. A
            physician-led, nurse-powered care program for diaspora professionals
            who demand exceptional, transparent, and reliable global standard
            medical care for their loved ones back home.
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
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src={VerimedLogo} alt="Verimed Logo" style={{ width: 140 }} />
        </div>

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
              style={{ fontSize: 14, color: "#6C7688", textAlign: "center" }}
            >
              Please enter below details to access the dashboard
            </Text>

            <Form
              name="login"
              layout="vertical"
              style={{ marginTop: 24 }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input prefix={<MailOutlined />} size="large" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
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
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  onClick={() => navigate("/forgot-password")}
                  style={{ color: "#f5222d", cursor: "pointer" }}
                >
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
