/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loginService } from "../../services/loginService";
import {
  clearRoleSessionStorage,
  filterSponsorAppointments,
  persistSponsorProfile,
  resolveSponsorProfileFromList,
  toValidId,
} from "../../utils/sponsorIsolation";
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
import LoginBg from "../../assets/images/loginBg.jpg";
import VerimedLogo from "../../assets/icons/VerimedLogo.png";
import { base_url, isAdminUser } from "../../constants/constants";

import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function LoginScreen() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    try {
      const data = localStorage.getItem("userData");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
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

  // ─── Sponsor helpers ──────────────────────────────────────────────────────
  const fetchSponsorProfile = async (userOrId, authToken) => {
    const userObj =
      userOrId && typeof userOrId === "object"
        ? userOrId
        : { id: userOrId };
    if (!toValidId(userObj?.id) || !authToken) return;
    try {
      const sponsorList = await loginService.getSponsorProfiles();
      const matchedSponsor = resolveSponsorProfileFromList(sponsorList, userObj);
      const resolvedSponsorId = persistSponsorProfile(matchedSponsor);
      if (resolvedSponsorId) {
        const ownedPatients = await fetchSponsorPatients(
          resolvedSponsorId,
          authToken,
        );
        await fetchSponsorAppointments(
          resolvedSponsorId,
          ownedPatients,
          authToken,
        );
      } else {
        localStorage.removeItem("sponsorData");
        localStorage.removeItem("sponsorProfileId");
        localStorage.removeItem("sponsorPatientIds");
        localStorage.removeItem("sponsorPatientData");
        localStorage.removeItem("sponsorAppointments");
      }
    } catch (error) {
      console.error("Error fetching sponsor profile:", error);
      notify("error", "Failed to load sponsor profile");
    }
  };

  const fetchSponsorPatients = async (sponsorProfileId, authToken) => {
    if (!sponsorProfileId || !authToken) return [];
    try {
      const patients = await loginService.getSponsorPatients(sponsorProfileId);
      if (Array.isArray(patients) && patients.length > 0) {
        const patientIds = patients
          .map((p) => toValidId(p.id))
          .filter(Boolean);
        localStorage.setItem(
          "sponsorPatientIds",
          JSON.stringify(patientIds),
        );
        localStorage.setItem("sponsorPatientData", JSON.stringify(patients));
        return patients;
      } else {
        localStorage.removeItem("sponsorPatientIds");
        localStorage.removeItem("sponsorPatientData");
        return [];
      }
    } catch (error) {
      console.error("Error fetching sponsor patients:", error);
      notify("error", "Failed to load sponsor patients");
      return [];
    }
  };

  const fetchSponsorAppointments = async (
    sponsorProfileId,
    ownedPatients = [],
    authToken,
  ) => {
    try {
      const validSponsorId = toValidId(sponsorProfileId);
      if (!validSponsorId || !authToken) {
        localStorage.removeItem("sponsorAppointments");
        return;
      }

      const ownedIds = (Array.isArray(ownedPatients) ? ownedPatients : [])
        .map((p) => toValidId(p?.id))
        .filter(Boolean);

      const data = await loginService.getSponsorAppointments(
        validSponsorId,
        ownedIds,
      );
      const filtered = filterSponsorAppointments(
        Array.isArray(data) ? data : [],
        validSponsorId,
        ownedIds,
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
      const authToken = res.token;

      // Clear previous session & React Query cache so stale data never leaks across users
      queryClient.clear();
      clearRoleSessionStorage();
      localStorage.removeItem("userData");
      localStorage.setItem("token", authToken);

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

      if (userData.user_role === "sponsor" && !isAdminUser(userData)) {
        await fetchSponsorProfile(userData, authToken);
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
      await fetchSponsorProfile(user, token);
      return true;
    },
    enabled:
      !!user &&
      !!token &&
      user.user_role === "sponsor" &&
      !isAdminUser(user),
  });

  return (
    <div className="flex min-h-screen overflow-hidden font-sans">
      {contextHolder}
      {/* Left Section */}
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
            Welcome to Verimed!
          </Title>
          <Text className="text-[#f0f0f0] text-[18px] leading-[1.5]">
            Home Health and Geriatric Wellness for Cameroon's Global Families. A
            physician-led, nurse-powered care program for diaspora professionals
            who demand exceptional, transparent, and reliable global standard
            medical care for their loved ones back home.
          </Text>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="flex-1 flex flex-col bg-[#f9f9f9] py-[40px] px-[40px]"
      >
        <div className="text-center mb-[20px]">
          <img src={VerimedLogo} alt="Verimed Logo" className="w-[140px]" />
        </div>

        <div
          className="flex-1 flex items-center justify-center"
        >
          <Card className="w-full max-w-[400px] rounded-[8px] shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
            <Title
              level={3}
              className="text-[24px] font-bold text-[#2E2E2E] mb-[8px] text-center"
            >
              Sign In
            </Title>
            <Text
              type="secondary"
              className="text-[14px] text-[#6C7688] text-center"
            >
              Please enter below details to access the dashboard
            </Text>

            <Form
              name="login"
              layout="vertical"
              className="mt-[24px]"
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
                className="flex justify-between items-center mb-[20px]"
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  onClick={() => navigate("/forgot-password")}
                  className="text-[#f5222d] cursor-pointer"
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
                  className="bg-[linear-gradient(180deg,#F0C330,#B78520)] border-none font-semibold"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
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
