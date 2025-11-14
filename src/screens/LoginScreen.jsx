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
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch Sponsor Profile
  const fetchSponsorProfile = async (userId, token) => {
    if (!userId || !token) return;
    try {
      const endpoint = `${base_url}/sponsorprofile_list/`;
      const res = await axios.get(endpoint);
      const sponsorList = Array.isArray(res.data) ? res.data : [];

      const matchedSponsor = sponsorList.find(
        (sponsor) => sponsor.user.id === userId
      );

      if (matchedSponsor) {
        console.log("Matched Sponsor:", matchedSponsor);

        localStorage.setItem("sponsorData", JSON.stringify(matchedSponsor));
        localStorage.setItem("sponsorProfileId", matchedSponsor.id);

        // ✅ Fetch Sponsor Patients
        await fetchSponsorPatients(matchedSponsor.id, token);

        // ✅ Fetch Sponsor Appointments
        await fetchSponsorAppointments(token);
      } else {
        console.warn("No matching sponsor found for this user.");
      }
    } catch (error) {
      console.error("Error fetching sponsor profile:", error);
    }
  };

  const fetchSponsorPatients = async (sponsorProfileId, token) => {
    if (!sponsorProfileId || !token) return;
    try {
      const endpoint = `${base_url}/sponsor_patients_view/`;
      const headers = { Authorization: `Token ${token}` };
      const payload = { sponsorprofileid: sponsorProfileId };

      const res = await axios.post(endpoint, payload, { headers });
      const patients = Array.isArray(res.data) ? res.data : [];

      if (patients.length > 0) {
        const patientIds = patients.map((p) => p.id);
        console.log("Sponsor Patients:", patientIds);

        localStorage.setItem("sponsorPatientIds", JSON.stringify(patientIds));
        localStorage.setItem("sponsorPatientData", JSON.stringify(patients));
      } else {
        console.warn("No patients found for this sponsor.");
        localStorage.removeItem("sponsorPatientIds");
        localStorage.removeItem("sponsorPatientData");
      }
    } catch (error) {
      console.error("Error fetching sponsor patients:", error);
    }
  };

  const fetchSponsorAppointments = async (token) => {
    try {
      const sponsorProfileId = localStorage.getItem("sponsorProfileId");
      const sponsorPatientIds = JSON.parse(
        localStorage.getItem("sponsorPatientIds") || "[]"
      );

      if (!sponsorProfileId || sponsorPatientIds.length === 0) {
        console.warn("Missing sponsor profile or patients.");
        return;
      }

      const endpoint = `${base_url}/vb_patientappoinment_list/`;
      const headers = { Authorization: `Token ${token}` };

      // Use the first patient ID (required by API)
      const firstPatientId = sponsorPatientIds[0];
      const payload = { patientprofileid: firstPatientId };

      const res = await axios.post(endpoint, payload, { headers });
      const data = Array.isArray(res.data) ? res.data : [];

      const filteredAppointments = data.filter(
        (item) =>
          item?.patient?.sponsor === Number(sponsorProfileId) &&
          sponsorPatientIds.includes(item?.patient?.id)
      );

      console.log("Filtered Appointments:", filteredAppointments);

      localStorage.setItem(
        "sponsorAppointments",
        JSON.stringify(filteredAppointments)
      );

      if (filteredAppointments.length > 0) {
        message.success("Sponsor appointments loaded successfully!");
      } else {
        message.warning("No appointments found for sponsor patients.");
      }
    } catch (error) {
      console.error("Error fetching sponsor appointments:", error);
    }
  };

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

      localStorage.setItem("userData", JSON.stringify(userData));
      message.success("Login successful!");

      if (userData.user_role === "sponsor") {
        await fetchSponsorProfile(userData.id, token);
      }

      // ✅ Redirect by Role
      switch (userData.user_role) {
        case "admin":
        case "sponsor":
        case "doctor":
        case "patient":
        case "care_taker":
          window.location.href = "/overview";
          break;
        default:
          message.error("Invalid user role.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token && user.user_role === "sponsor") {
      fetchSponsorProfile(user.id, token);
    }
  }, [user, token]);

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
            filter: "brightness(0.3)",
          }}
        />
        {/* <div style={{ backgroundColor: "#00000077", zIndex: 10000 }} /> */}
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
          <Text
            style={{
              color: "#f0f0f0",
              fontSize: 18,
              lineHeight: "1.5",
            }}
          >
            Home Health and Geriatric Wellness for Cameroon’s Global Families. A
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
              style={{
                fontSize: 14,
                color: "#6C7688",
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
