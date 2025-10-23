import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";
import {
  Button,
  Table,
  Tag,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";
import { base_url } from "../constants/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

function SectionHeader({ title, children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        minWidth: 0,
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 600, color: "#1B1B1B" }}>{title}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

export default function MembershipPlans() {
  const navigate = useNavigate();
  const [appointmentList, setAppointmentList] = useState([]);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      const endpoint = `${base_url}/verimed_bookappoinment_create_update/`;
      const headers = {
        Authorization: `Token ${token}`,
      };
      const res = await axios.get(endpoint, { headers });
      setAppointmentList(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleFinish = (values) => {
    console.log("New Membership Plan:", values);
  };

  const docStats = [
    {
      id: 1,
      name: "Total Active Plans",
      count: appointmentList.length,
      diff: "+95%",
    },
    {
      id: 2,
      name: "Active Subscriptions",
      count: appointmentList.length,
      diff: "+95%",
    },
    {
      id: 3,
      name: "Monthly Revenue",
      count: 20,
      diff: "+95%",
    },
    {
      id: 4,
      name: "Plan Growth",
      count: 24,
      diff: "+25%",
    },
    {
      id: 5,
      name: "Patients per Plan",
      count: 6,
      diff: "+15%",
    },
  ];

  const memberShipPlansConfif = {
    data: [
      { type: "Essential Plan", value: 555 },
      { type: "Premium Plan", value: 254 },
      { type: "Elite Plan", value: 215 },
      { type: "Platinum Family Plan", value: 125 },
    ],
    angleField: "value",
    colorField: "type",
    color: ["#1E90FF", "#36AC00", "#FFB020", "#EF2412"],
    radius: 0.8,
    innerRadius: 0.4,
    label: {
      text: "value",
      style: { fontWeight: "bold" },
    },
    legend: { position: "bottom" },
    interactions: [{ type: "element-active" }],
  };

  const statusBarConfig = {
    data: [
      { month: "01", Completed: 100, Ongoing: 50, Pending: 30 },
      { month: "02", Completed: 120, Ongoing: 70, Pending: 40 },
      { month: "03", Completed: 150, Ongoing: 80, Pending: 50 },
      { month: "04", Completed: 180, Ongoing: 60, Pending: 30 },
      { month: "05", Completed: 240, Ongoing: 80, Pending: 50 },
      { month: "06", Completed: 100, Ongoing: 40, Pending: 20 },
      { month: "07", Completed: 130, Ongoing: 60, Pending: 30 },
      { month: "08", Completed: 220, Ongoing: 80, Pending: 40 },
      { month: "09", Completed: 250, Ongoing: 90, Pending: 60 },
      { month: "10", Completed: 200, Ongoing: 70, Pending: 40 },
      { month: "11", Completed: 180, Ongoing: 60, Pending: 30 },
      { month: "12", Completed: 140, Ongoing: 50, Pending: 20 },
    ],
    isStack: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
  };

  // Transform the data for stacked bars
  const transformedData = [];
  statusBarConfig.data.forEach((item) => {
    transformedData.push(
      { month: item.month, type: "Completed", value: item.Completed },
      { month: item.month, type: "Ongoing", value: item.Ongoing },
      { month: item.month, type: "Pending", value: item.Pending }
    );
  });

  const stackedBarConfig = {
    data: transformedData,
    isStack: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
    color: ["#00C49F", "#0088FE", "#FFBB28"],
    legend: { position: "bottom" },
  };

  const membershipData = [
    {
      id: 1,
      planName: "Essential Plan",
      price: "75,000 CFA",
      visits: "2 Home Visits",
      consults: "2 Virtual Consults",
      patients: 555,
      status: "Active",
    },
    {
      id: 2,
      planName: "Premium Plan",
      price: "150,000 CFA",
      visits: "2 Home Visits",
      consults: "2 Virtual Consults",
      patients: 555,
      status: "Active",
    },
    {
      id: 3,
      planName: "Elite Plan",
      price: "300,000 CFA",
      visits: "2 Home Visits",
      consults: "2 Virtual Consults",
      patients: 555,
      status: "Active",
    },
    {
      id: 4,
      planName: "Premium Plan",
      price: "500,000 CFA",
      visits: "2 Home Visits",
      consults: "2 Virtual Consults",
      patients: 555,
      status: "Active",
    },
  ];

  const columns = [
    {
      title: "Plan Name",
      dataIndex: "planName",
      key: "planName",
      width: 180,
    },
    {
      title: "Price / Month",
      dataIndex: "price",
      key: "price",
      width: 160,
    },
    {
      title: "Visits / Month",
      dataIndex: "visits",
      key: "visits",
      width: 160,
    },
    {
      title: "Virtual Consults",
      dataIndex: "consults",
      key: "consults",
      width: 160,
    },
    {
      title: "Patients",
      dataIndex: "patients",
      key: "patients",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag
          color={status === "Active" ? "green" : "volcano"}
          style={{
            borderRadius: 20,
            fontWeight: 500,
            padding: "2px 12px",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          style={{ color: "#1F2329", fontWeight: 500, padding: 0 }}
          onClick={() => alert(`Viewing details for ${record.planName}`)}
        >
          ...
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#F7F9FB" }}
    >
      {/* Sidebar */}
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

        {/* Content area with just text */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            overflowX: "hidden",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              width: "100%",
            }}
          >
            {docStats.map((stat, idx) => (
              <div
                key={stat.id}
                style={{
                  minWidth: 160,
                  // maxWidth: 200,
                  flex: "0 0 auto",
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* ...card content... */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#007F5F33",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_484_11034)">
                        <path
                          d="M11.5 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V11"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 3V7"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 3V7"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 11H20"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.0001 22.0001L21.3501 18.7161C21.5556 18.5168 21.719 18.2783 21.8307 18.0147C21.9425 17.7512 22.0003 17.4679 22.0007 17.1817C22.0012 16.8954 21.9443 16.612 21.8334 16.3481C21.7225 16.0841 21.5599 15.8451 21.3551 15.6451C20.9373 15.2365 20.3763 15.0071 19.7918 15.006C19.2074 15.0049 18.6455 15.2321 18.2261 15.6391L18.0021 15.8591L17.7791 15.6391C17.3613 15.2307 16.8006 15.0016 16.2163 15.0005C15.6321 14.9994 15.0705 15.2264 14.6511 15.6331C14.4456 15.8324 14.2821 16.0708 14.1703 16.3343C14.0585 16.5978 14.0006 16.8811 14 17.1673C13.9994 17.4536 14.0562 17.7371 14.167 18.001C14.2778 18.265 14.4404 18.504 14.6451 18.7041L18.0001 22.0001Z"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_484_11034">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p
                    style={{
                      color: "#6C7688",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {stat.name}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontSize: 18,
                      fontWeight: "800",
                    }}
                  >
                    {stat.count}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#27AE60",
                        height: 20,
                        width: 49,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 6,
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {stat.diff}
                      </p>
                    </div>
                    <p style={{ color: "#6C7688", fontSize: 13 }}>
                      {stat.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* charts */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 20,
            }}
          >
            {/* Left: Pie Chart */}
            <div
              style={{
                width: "50%",
                backgroundColor: "white",
                height: 437,
                borderRadius: 8,
                padding: 24,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 18, color: "#1B1B1B" }}>
                  Membership Plans{" "}
                </p>
                <span
                  onClick={() => {}}
                  style={{
                    background: "#fff",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1F2329",
                    cursor: "pointer",
                    border: "1px solid #0000001F",
                  }}
                >
                  Aug 2025 <CalendarOutlined />
                </span>
              </div>
              <Pie
                {...memberShipPlansConfif}
                style={{ height: 320, width: "100%" }}
              />
            </div>

            {/* Right: Bar Chart */}
            <div
              style={{
                width: "50%",
                backgroundColor: "white",
                height: 437,
                borderRadius: 8,
                padding: 24,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 18, color: "#1B1B1B" }}>
                  Membership Plans Statistics{" "}
                </p>
                <span
                  onClick={() => {}}
                  style={{
                    background: "#fff",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1F2329",
                    cursor: "pointer",
                    border: "1px solid #0000001F",
                  }}
                >
                  Aug 2025 <CalendarOutlined />
                </span>
              </div>

              {/* Top summary boxes */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                {[
                  { label: "Subscriptions", value: 6314 },
                  { label: "Renewals", value: 4578 },
                  { label: "Cancellations", value: 745 },
                  { label: "Revenue", value: 456 },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      border: "1px solid #E7E8EB",
                      borderRadius: 8,
                      padding: "10px 5px",
                      background: "#FAFAFA",
                      marginRight: i !== 3 ? 10 : 0,
                    }}
                  >
                    <p style={{ fontSize: 12, color: "#666" }}>{stat.label}</p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1B1B1B",
                        margin: 0,
                      }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <Column {...stackedBarConfig} style={{ height: 260 }} />
            </div>
          </div>

          {/* appointment list */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              margin: 20,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <p style={{ fontSize: 18, fontWeight: 600, color: "#1B1B1B" }}>
                Membership Plan List
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <PrimaryBtn
                  icon={<PlusOutlined />}
                  name="New Membership Plan"
                  onClick={() => setAddDrawerOpen(true)}
                />
                <SecondaryBtn name="Filter" icon={<FilterOutlined />} />
              </div>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={membershipData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              bordered
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <Drawer
          title="Add New Membership Plan"
          width={700}
          onClose={() => setAddDrawerOpen(false)}
          open={addDrawerOpen}
          destroyOnClose
        >
          <Form layout="vertical" onFinish={handleFinish}>
            {/* Plan Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 8,
              }}
            >
              <Form.Item
                name="planName"
                label="Plan Name"
                rules={[{ required: true, message: "Please enter Plan Name" }]}
              >
                <Input placeholder="Enter Plan Name" />
              </Form.Item>

              <Form.Item label="Plan ID">
                <Input value="PL-2032" disabled />
              </Form.Item>

              <Form.Item
                name="tagline"
                label="Tagline / Short Description"
                style={{ gridColumn: "1 / span 2" }}
              >
                <Input placeholder="Enter tagline or short description" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Detailed Description"
                style={{ gridColumn: "1 / span 2" }}
              >
                <TextArea rows={3} placeholder="Describe this plan in detail" />
              </Form.Item>

              <Form.Item name="status" label="Status">
                <Select defaultValue="Active">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>

              <Form.Item name="createdDate" label="Created Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <Divider orientation="left">Pricing Details</Divider>

            {/* Pricing Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Form.Item name="currency" label="Currency">
                <Select defaultValue="CFA">
                  <Option value="CFA">CFA</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>

              <Form.Item name="billingCycle" label="Billing Cycle">
                <Select defaultValue="Monthly">
                  <Option value="Monthly">Monthly</Option>
                  <Option value="Quarterly">Quarterly</Option>
                  <Option value="Yearly">Yearly</Option>
                </Select>
              </Form.Item>

              <Form.Item name="planPrice" label="Plan Price">
                <Input placeholder="75,000" />
              </Form.Item>

              <Form.Item name="discount" label="Discount (if any)">
                <Input placeholder="10%" />
              </Form.Item>

              <Form.Item name="trialPeriod" label="Trial Period (Days)">
                <Input placeholder="7" />
              </Form.Item>

              <Form.Item name="setupFee" label="Setup Fee">
                <Input placeholder="0" />
              </Form.Item>

              <Form.Item
                name="renewalReminder"
                label="Next Renewal Reminder"
                style={{ gridColumn: "1 / span 2" }}
              >
                <Select defaultValue="3 Days Before Renewal">
                  <Option value="3 Days Before Renewal">
                    3 Days Before Renewal
                  </Option>
                  <Option value="7 Days Before Renewal">
                    7 Days Before Renewal
                  </Option>
                </Select>
              </Form.Item>
            </div>

            <Divider orientation="left">Care Features & Limits</Divider>

            {/* Care Features */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Form.Item name="homeVisits" label="Home Visits per Month">
                <Select defaultValue="6">
                  <Option value="2">2</Option>
                  <Option value="4">4</Option>
                  <Option value="6">6</Option>
                  <Option value="Unlimited">Unlimited</Option>
                </Select>
              </Form.Item>

              <Form.Item name="virtualConsults" label="Virtual Consultations">
                <Select defaultValue="Unlimited">
                  <Option value="1">1</Option>
                  <Option value="3">3</Option>
                  <Option value="Unlimited">Unlimited</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="careCoordination"
                label="Care Coordination Access"
              >
                <Select defaultValue="Included">
                  <Option value="Included">Included</Option>
                  <Option value="Not Included">Not Included</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="vitalsMonitoring"
                label="Vitals Monitoring Frequency"
              >
                <Select defaultValue="Daily">
                  <Option value="Daily">Daily</Option>
                  <Option value="Weekly">Weekly</Option>
                </Select>
              </Form.Item>

              <Form.Item name="lineSupport" label="24/7 Care Line Support">
                <Select defaultValue="Enabled">
                  <Option value="Enabled">Enabled</Option>
                  <Option value="Disabled">Disabled</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="emergencyPriority"
                label="Emergency Response Priority"
              >
                <Select defaultValue="Standard">
                  <Option value="Standard">Standard</Option>
                  <Option value="High">High</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="dedicatedCoordinator"
                label="Dedicated Care Coordinator"
              >
                <Select defaultValue="Yes">
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </div>

            <Divider orientation="left">Patient Management Rules</Divider>

            {/* Patient Management Rules */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Form.Item
                name="maxPatients"
                label="Maximum Patients per Sponsor"
              >
                <Input placeholder="2" />
              </Form.Item>

              <Form.Item name="doctorType" label="Doctor Type">
                <Select defaultValue="Specialist">
                  <Option value="General">General</Option>
                  <Option value="Specialist">Specialist</Option>
                </Select>
              </Form.Item>

              <Form.Item name="caretakerVisits" label="Care Taker Visits">
                <Select defaultValue="Daily">
                  <Option value="Daily">Daily</Option>
                  <Option value="Weekly">Weekly</Option>
                </Select>
              </Form.Item>

              <Form.Item name="familyUpdate" label="Family Update Frequency">
                <Select defaultValue="Daily">
                  <Option value="Daily">Daily</Option>
                  <Option value="Weekly">Weekly</Option>
                </Select>
              </Form.Item>

              <Form.Item name="doctorReports" label="Access to Doctor Reports">
                <Select defaultValue="Yes">
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Buttons */}
            <Form.Item style={{ marginTop: 24 }}>
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
              >
                <SecondaryBtn name="cancel" />
                <PrimaryBtn name="Save Plan" type="primary" htmlType="submit" />
              </div>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </div>
  );
}
