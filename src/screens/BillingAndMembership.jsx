import React, { useState } from "react";
import { Table, Button, DatePicker, message } from "antd";
import {
  DownloadOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Header from "../components/Header";
import Sider from "../components/Sider";
import VerimedLogo from "../assets/icons/VerimedLogo.png";
import Primarybtn from "../components/PrimaryBtn";
import StripeCheckoutModal from "../components/StripeCheckoutModal";

// Table Data
const dataSource = [
  {
    key: "1",
    date: "July 25, 2025",
    invoice: "INV-3024",
    plan: "Premium Plan",
    amount: "150,000 CFA",
    status: "Active",
  },
  {
    key: "2",
    date: "June 25, 2025",
    invoice: "INV-3023",
    plan: "Essential Plan",
    amount: "75,000 CFA",
    status: "Inactive",
  },
  {
    key: "3",
    date: "May 25, 2025",
    invoice: "INV-3022",
    plan: "Premium Plan",
    amount: "150,000 CFA",
    status: "Inactive",
  },
  {
    key: "4",
    date: "April 25, 2025",
    invoice: "INV-3021",
    plan: "Premium Plan",
    amount: "150,000 CFA",
    status: "Inactive",
  },
];

const Info = ({ label, value }) => (
  <div style={{ minWidth: 150 }}>
    <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{label}</p>
    <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: "#111827" }}>
      {value}
    </p>
  </div>
);

export default function BillingAndMembership() {
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const openPayModal = (record = null) => {
    setSelectedInvoice(record);
    setIsStripeModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsStripeModalOpen(false);
    message.success(
      "Payment verified and membership / invoice successfully processed via Stripe!"
    );
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Invoice No.",
      dataIndex: "invoice",
      key: "invoice",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span style={{ color: text === "Active" ? "#10B981" : "#6B7280" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Download",
      dataIndex: "download",
      key: "download",
      render: () => (
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            color: "#111827",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <DownloadOutlined /> Download PDF
        </a>
      ),
    },
    {
      title: "Payment Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<CreditCardOutlined />}
          style={{
            background: record.status === "Active" ? "#94A3B8" : "#007F5F",
            borderColor: record.status === "Active" ? "#94A3B8" : "#007F5F",
            fontWeight: 500,
          }}
          onClick={() => openPayModal(record)}
        >
          {record.status === "Active" ? "Paid (Receipt)" : "Pay via Stripe"}
        </Button>
      ),
    },
  ];

  const currentMembershipTop = [
    { label: "Plan Name", value: "Premium Plan" },
    { label: "Status", value: "Active" },
    { label: "Start Date", value: "July 25, 2025" },
    { label: "Next Renewal", value: "Aug 25, 2025" },
    { label: "Contact Support", value: "+966 558441502" },
  ];

  const currentMembershipBottom = [
    { label: "Coverage", value: "1 Patient" },
    { label: "Care Taker", value: "1 Care Taker" },
    { label: "Monitoring", value: "Monthly Vitals Monitoring" },
    { label: "Cost", value: "150,000 CFA" },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F7F9FB" }}>
      {/* Sidebar */}
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {/* Current Membership Plan Section */}
          <div
            style={{
              backgroundColor: "transparent",
              borderRadius: "10px",
              border: "none",
              marginBottom: "20px",
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>
                Current Membership Plan
              </p>
              <p style={{ fontSize: 14, fontStyle: "italic", margin: 0 }}>
                Renewal Due <strong>Aug 25, 2025</strong>
              </p>
            </div>

            {/* White Box Content */}
            <div
              style={{
                background: "transparent",
                borderRadius: 10,
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {/* Logo */}
              <div style={{ flexShrink: 0 }}>
                <img
                  src={VerimedLogo}
                  alt="Verimed Logo"
                  style={{ height: 50 }}
                />
              </div>

              {/* Top Row Info */}
              {currentMembershipTop.map((item, index) => (
                <Info key={index} label={item.label} value={item.value} />
              ))}

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E5E7EB",
                  margin: "15px 0",
                }}
              />

              {/* Bottom Row Info */}
              {currentMembershipBottom.map((item, index) => (
                <Info key={index} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          {/* Invoice & Billing History */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "20px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, color: "#047857" }}>
                Invoice & Billing History
              </h3>

              <div style={{ display: "flex", gap: 10 }}>
                <DatePicker
                  picker="year"
                  defaultValue={dayjs("2025", "YYYY")}
                  suffixIcon={<CalendarOutlined />}
                  style={{ width: 100 }}
                />
                <Primarybtn
                  name="Renew / Pay via Stripe"
                  onClick={() => openPayModal(null)}
                />
              </div>
            </div>

            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 5 }}
              bordered
              scroll={{ x: true }}
            />
          </div>
        </div>
      </div>

      {/* Stripe Checkout Payment Portal */}
      <StripeCheckoutModal
        open={isStripeModalOpen}
        onCancel={() => setIsStripeModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        title={selectedInvoice ? "Invoice Payment" : "Membership Plan Renewal"}
        summaryTitle={
          selectedInvoice
            ? `Invoice Summary (${selectedInvoice.invoice})`
            : "Plan Renewal Summary"
        }
        itemName={
          selectedInvoice ? selectedInvoice.plan : "Premium Membership Plan"
        }
        subItemName={
          selectedInvoice
            ? `Invoice Date: ${selectedInvoice.date}`
            : "Annual Vitals Monitoring & Doctor Coordination"
        }
        amount={
          selectedInvoice ? selectedInvoice.amount : "150,000 CFA ($150.00 USD)"
        }
        buttonText={
          selectedInvoice
            ? `Pay ${selectedInvoice.amount} & Verify`
            : "Pay 150,000 CFA & Renew Membership"
        }
      />
    </div>
  );
}
