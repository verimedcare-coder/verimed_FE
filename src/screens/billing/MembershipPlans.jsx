/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { myPatientsService } from "../../services/myPatientsService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import PrimaryBtn from "../../components/common/PrimaryBtn";
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
  message,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  PlusOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";
import { base_url } from "../../constants/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StripeCheckoutModal from "../../components/modals/StripeCheckoutModal";

const { Option } = Select;
const { TextArea } = Input;

function SectionHeader({ title, children }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-[10px] min-w-0">
      <p className="text-[16px] font-semibold text-[#1B1B1B]">{title}</p>
      <div className="flex gap-[10px] flex-wrap">
        {children}
      </div>
    </div>
  );
}

export default function MembershipPlans() {
  const navigate = useNavigate();
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const openPlanStripeModal = (plan = null) => {
    setSelectedPlan(plan);
    setIsStripeModalOpen(true);
  };

  const handlePlanStripeSuccess = () => {
    setIsStripeModalOpen(false);
    message.success(
      "Payment verified and membership plan successfully subscribed via Stripe!"
    );
  };

  const token = localStorage.getItem("token");

  const { data: appointmentList = [] } = useQuery({
    queryKey: ["allAppointments"],
    queryFn: async () => {
      const data = await myPatientsService.getAllAppointments();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });

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
          className="rounded-[20px] font-medium py-[2px] px-[12px]"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          className="text-[#1F2329] font-medium p-0"
          onClick={() => alert(`Viewing details for ${record.planName}`)}
        >
          ...
        </Button>
      ),
    },
    {
      title: "Subscription Action",
      key: "subscribe",
      width: 180,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<CreditCardOutlined />}
          className="bg-[#007F5F] font-medium border-solid border-[#007F5F]"
          onClick={() => openPlanStripeModal(record)}
        >
          Subscribe via Stripe
        </Button>
      ),
    },
  ];

  return (
    <div
      className="flex h-screen bg-[#F7F9FB]"
    >
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        {/* Content area with just text */}
        <div
          className="p-[20px] overflow-y-auto gap-[20px] flex flex-col items-center overflow-x-hidden"
        >
          <div
            className="flex items-center justify-between gap-[12px] w-full"
          >
            {docStats.map((stat, idx) => (
              <div
                key={stat.id}
                className="min-w-[160px] flex-none bg-white rounded-[8px] p-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between"
              >
                {/* ...card content... */}
                <div
                  className="flex items-center justify-start gap-[10px]"
                >
                  <div
                    className="h-[30px] w-[30px] rounded-[100px] flex items-center justify-center bg-[#007F5F33]"
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
                    className="text-[#6C7688] text-[14px] font-medium"
                  >
                    {stat.name}
                  </p>
                </div>
                <div
                  className="flex items-center justify-between"
                >
                  <p
                    className="text-[#2E2E2E] text-[18px] font-extrabold"
                  >
                    {stat.count}
                  </p>
                  <div
                    className="flex flex-col items-end justify-center w-full"
                  >
                    <div
                      className="bg-[#27AE60] h-[20px] w-[49px] flex items-center justify-center rounded-[6px]"
                    >
                      <p
                        className="text-[white] text-[12px] font-medium"
                      >
                        {stat.diff}
                      </p>
                    </div>
                    <p className="text-[#6C7688] text-[13px]">
                      {stat.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* charts */}
          <div
            className="flex items-center justify-between w-full gap-[20px]"
          >
            {/* Left: Pie Chart */}
            <div
              className="w-[50%] bg-white h-[437px] rounded-[8px] p-[24px] flex flex-col"
            >
              <div
                className="flex justify-between items-center mb-[16px]"
              >
                <p className="font-semibold text-[18px] text-[#1B1B1B]">
                  Membership Plans{" "}
                </p>
                <span
                  onClick={() => {}}
                  className="bg-white rounded-[6px] py-[6px] px-[14px] text-[14px] font-medium text-[#1F2329] cursor-pointer border-[1px] border-solid border-[#0000001F]"
                >
                  Aug 2025 <CalendarOutlined />
                </span>
              </div>
              <Pie
                {...memberShipPlansConfif}
                className="h-[320px] w-full"
              />
            </div>

            {/* Right: Bar Chart */}
            <div
              className="w-[50%] bg-white h-[437px] rounded-[8px] p-[24px] flex flex-col"
            >
              <div
                className="flex justify-between items-center mb-[16px]"
              >
                <p className="font-semibold text-[18px] text-[#1B1B1B]">
                  Membership Plans Statistics{" "}
                </p>
                <span
                  onClick={() => {}}
                  className="bg-white rounded-[6px] py-[6px] px-[14px] text-[14px] font-medium text-[#1F2329] cursor-pointer border-[1px] border-solid border-[#0000001F]"
                >
                  Aug 2025 <CalendarOutlined />
                </span>
              </div>

              {/* Top summary boxes */}
              <div
                className="flex justify-between mb-[20px]"
              >
                {[
                  { label: "Subscriptions", value: 6314 },
                  { label: "Renewals", value: 4578 },
                  { label: "Cancellations", value: 745 },
                  { label: "Revenue", value: 456 },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`flex-1 text-center border-[1px] border-solid border-[#E7E8EB] rounded-[8px] p-[10px_5px] bg-[#FAFAFA] ${i !== 3 ? "mr-[10px]" : "mr-0"}`}
                  >
                    <p className="text-[12px] text-[#666]">{stat.label}</p>
                    <p
                      className="text-[16px] font-bold text-[#1B1B1B] m-0"
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <Column {...stackedBarConfig} className="h-[260px]" />
            </div>
          </div>

          {/* appointment list */}
          <div className="bg-white rounded-[16px] p-[24px] w-full shadow-[0_2px_8px_rgba(0,0,0,0.05)] m-[20px]">
            {/* Header */}
            <div
              className="flex justify-between items-center mb-[18px] flex-wrap gap-[10px]"
            >
              <p className="text-[18px] font-semibold text-[#1B1B1B]">
                Membership Plan List
              </p>
              <div className="flex gap-[10px]">
                <PrimaryBtn
                  icon={<CreditCardOutlined />}
                  name="Subscribe / Upgrade via Stripe"
                  onClick={() => openPlanStripeModal(null)}
                />
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
              rowKey="id"
              pagination={false}
            />
          </div>
        </div>

        {/* Add Plan Drawer */}
        <Drawer
          title="Add New Membership Plan"
          width={450}
          onClose={() => setAddDrawerOpen(false)}
          open={addDrawerOpen}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" onFinish={handleFinish}>
            {/* Plan Info */}
            <div className="mb-[24px]">
              <h4
                className="text-[#1F2329] font-semibold mb-[16px]"
              >
                Plan Information
              </h4>

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
                name="description"
                label="Detailed Description"
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
                <DatePicker className="w-full" />
              </Form.Item>
            </div>

            <Divider orientation="left">Pricing Details</Divider>

            {/* Pricing Details */}
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
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
                className="col-span-2"
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
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
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
            <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
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
            <Form.Item className="mt-[24px]">
              <div
                className="flex justify-end gap-[12px]"
              >
                <SecondaryBtn name="cancel" />
                <PrimaryBtn name="Save Plan" type="primary" htmlType="submit" />
              </div>
            </Form.Item>
          </Form>
        </Drawer>
      </div>

      {/* Verimed Multi-Step Secure Stripe Checkout Portal */}
      <StripeCheckoutModal
        open={isStripeModalOpen}
        onCancel={() => setIsStripeModalOpen(false)}
        onSuccess={handlePlanStripeSuccess}
        title="Membership Plan"
        summaryTitle={
          selectedPlan
            ? `Subscription Summary (${selectedPlan.planName})`
            : "Plan Enrollment Summary"
        }
        itemName={selectedPlan ? selectedPlan.planName : "Premium Plan"}
        subItemName={
          selectedPlan
            ? `Included: ${selectedPlan.visits}, ${selectedPlan.consults}`
            : "Annual Medical Coordination & Monitoring"
        }
        amount={
          selectedPlan ? selectedPlan.price : "150,000 CFA ($150.00 USD)"
        }
        buttonText={
          selectedPlan
            ? `Subscribe & Pay ${selectedPlan.price}`
            : "Subscribe & Pay 150,000 CFA"
        }
      />
    </div>
  );
}
