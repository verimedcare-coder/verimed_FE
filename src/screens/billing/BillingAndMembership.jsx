import React, { useState } from "react";
import { Table, Button, DatePicker, message } from "antd";
import {
  DownloadOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import VerimedLogo from "../../assets/icons/VerimedLogo.png";
import Primarybtn from "../../components/common/PrimaryBtn";
import StripeCheckoutModal from "../../components/modals/StripeCheckoutModal";

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
  <div className="min-w-[150px]">
    <p className="m-0 text-[12px] text-[#6B7280]">{label}</p>
    <p className="m-0 font-medium text-[14px] text-[#111827]">
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
        <span className={text === "Active" ? "text-[#10B981]" : "text-[#6B7280]"}>
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
          className="text-[#111827] flex items-center gap-[6px]"
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
          className={`font-medium border-solid ${record.status === "Active" ? "bg-[#94A3B8] border-[#94A3B8]" : "bg-[#007F5F] border-[#007F5F]"}`}
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
    <div className="flex bg-[#F7F9FB]">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        {/* Page Content */}
        <div className="flex-1 p-[20px] overflow-y-auto">
          {/* Current Membership Plan Section */}
          <div
            className="bg-transparent rounded-[10px] border-none mb-[20px]"
          >
            {/* Header Row */}
            <div
              className="flex w-full justify-between items-center mb-[20px]"
            >
              <p className="font-semibold text-[16px] m-0">
                Current Membership Plan
              </p>
              <p className="text-[14px] m-0 italic">
                Renewal Due <strong>Aug 25, 2025</strong>
              </p>
            </div>

            {/* White Box Content */}
            <div
              className="bg-transparent rounded-[10px] p-[20px] flex items-center justify-center flex-wrap gap-[10px]"
            >
              {/* Logo */}
              <div className="shrink-0">
                <img
                  src={VerimedLogo}
                  alt="Verimed Logo"
                  className="h-[50px]"
                />
              </div>

              {/* Top Row Info */}
              {currentMembershipTop.map((item, index) => (
                <Info key={index} label={item.label} value={item.value} />
              ))}

              {/* Divider */}
              <div
                className="w-full h-[1px] bg-[#E5E7EB] m-[15px 0]"
              />

              {/* Bottom Row Info */}
              {currentMembershipBottom.map((item, index) => (
                <Info key={index} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          {/* Invoice & Billing History */}
          <div className="bg-white border-[1px] border-solid border-[#E5E7EB] rounded-[10px] p-[20px] font-['Inter',sans-serif]">
            <div
              className="flex justify-between items-center mb-[20px]"
            >
              <h3 className="m-0 text-[18px] text-[#047857]">
                Invoice & Billing History
              </h3>

              <div className="flex gap-[10px]">
                <DatePicker
                  picker="year"
                  defaultValue={dayjs("2025", "YYYY")}
                  suffixIcon={<CalendarOutlined />}
                  className="w-[100px]"
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
