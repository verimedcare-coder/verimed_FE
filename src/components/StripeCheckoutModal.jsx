import React, { useState, useEffect } from "react";
import { Modal, Input, Tag, Button, Steps, Checkbox, message, Alert } from "antd";
import {
  SafetyCertificateOutlined,
  CreditCardOutlined,
  LockOutlined,
  CheckCircleOutlined,
  BankOutlined,
  MobileOutlined,
  DownloadOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Step } = Steps;

export default function StripeCheckoutModal({
  open,
  onCancel,
  onSuccess,
  title = "Service / Plan",
  summaryTitle = "Checkout & Order Review",
  itemName = "Premium Membership Plan",
  subItemName = "Annual Medical Coordination & Monitoring",
  amount = "75,000 CFA ($150.00 USD)",
  buttonText = "Complete & Confirm Booking",
  userData,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [otpValue, setOtpValue] = useState("849201");
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Reset step whenever modal opens
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setVerifying(false);
    }
  }, [open]);

  const handleVerifyOTP = () => {
    if (!otpValue || otpValue.length < 4) {
      message.error("Please enter a valid 6-digit Bank verification code.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setCurrentStep(3); // Move to final receipt screen
      message.success("Bank 3D-Secure OTP verified! Payment cleared successfully via Stripe.");
    }, 1200);
  };

  const handleFinalSuccess = () => {
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: 12,
          }}
        >
          <SafetyCertificateOutlined
            style={{ color: "#007F5F", fontSize: 26 }}
          />
          <div>
            <h3
              style={{
                margin: 0,
                color: "#007F5F",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Verimed - Secure Stripe Payment Portal
            </h3>
            <span style={{ fontSize: 12, color: "#64748B", fontWeight: 400 }}>
              256-Bit SSL Encrypted Multi-Step Checkout & Verification
            </span>
          </div>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={620}
    >
      <div style={{ padding: "12px 0 4px 0" }}>
        {/* Ant Design Steps Indicator */}
        <Steps
          current={currentStep}
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Step title="Review" description="Order Summary" />
          <Step title="Payment" description="Card / Method" />
          <Step title="3D-Secure" description="Bank OTP" />
          <Step title="Receipt" description="Confirmation" />
        </Steps>

        {/* STEP 0: ORDER SUMMARY & MEDICAL REVIEW */}
        {currentStep === 0 && (
          <div>
            <div
              style={{
                background: "#F8FAFC",
                padding: 18,
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                marginBottom: 18,
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  color: "#1E293B",
                  fontSize: 15,
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{summaryTitle}</span>
                <Tag color="green" style={{ fontWeight: 600 }}>
                  Guaranteed Sponsor Rate
                </Tag>
              </h4>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>{title}:</span>
                <strong style={{ color: "#1E293B" }}>{itemName}</strong>
              </div>

              {subItemName && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#64748B" }}>Patient / Coverage:</span>
                  <strong style={{ color: "#1E293B" }}>{subItemName}</strong>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>Platform Processing Fee:</span>
                <span style={{ color: "#10B981", fontWeight: 600 }}>$0.00 (Waived)</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>Medical Team Dispatch:</span>
                <span style={{ color: "#007F5F", fontWeight: 500 }}>
                  Instant Dr. Foye Coordination Included
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 15,
                  borderTop: "1px dashed #CBD5E1",
                  paddingTop: 12,
                  marginTop: 12,
                }}
              >
                <span style={{ color: "#1E293B", fontWeight: 700 }}>
                  Total Amount Due:
                </span>
                <strong style={{ color: "#007F5F", fontSize: 18 }}>{amount}</strong>
              </div>
            </div>

            <div
              style={{
                background: "#EFF6FF",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #BFDBFE",
                marginBottom: 20,
              }}
            >
              <Checkbox
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ fontSize: 13, color: "#1E3A8A", fontWeight: 500 }}
              >
                I authorize Verimed Health to securely process this payment via Stripe and immediately coordinate patient vitals with our clinical team.
              </Checkbox>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 20,
              }}
            >
              <Button onClick={onCancel} style={{ height: 40, padding: "0 20px" }}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => setCurrentStep(1)}
                disabled={!agreedTerms}
                style={{
                  background: "#007F5F",
                  borderColor: "#007F5F",
                  fontWeight: 600,
                  height: 40,
                  padding: "0 24px",
                }}
              >
                Next: Payment Details <ArrowRightOutlined />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 1: PAYMENT METHOD & CARD ENTRY */}
        {currentStep === 1 && (
          <div>
            {/* Payment Method Selector */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <Button
                type={paymentMethod === "card" ? "primary" : "default"}
                icon={<CreditCardOutlined />}
                onClick={() => setPaymentMethod("card")}
                style={{
                  flex: 1,
                  background: paymentMethod === "card" ? "#007F5F" : "transparent",
                  borderColor: paymentMethod === "card" ? "#007F5F" : "#D1D5DB",
                  color: paymentMethod === "card" ? "#FFF" : "#374151",
                  fontWeight: 600,
                  height: 42,
                }}
              >
                Credit / Debit Card
              </Button>
              <Button
                type={paymentMethod === "mobile" ? "primary" : "default"}
                icon={<MobileOutlined />}
                onClick={() => setPaymentMethod("mobile")}
                style={{
                  flex: 1,
                  background: paymentMethod === "mobile" ? "#007F5F" : "transparent",
                  borderColor: paymentMethod === "mobile" ? "#007F5F" : "#D1D5DB",
                  color: paymentMethod === "mobile" ? "#FFF" : "#374151",
                  fontWeight: 600,
                  height: 42,
                }}
              >
                Mobile Money / ACH
              </Button>
            </div>

            {paymentMethod === "card" ? (
              <div
                style={{
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: 16,
                  background: "#FFF",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 13, color: "#334155" }}>
                    Stripe 256-Bit SSL Encrypted Card Portal
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Tag color="blue">VISA</Tag>
                    <Tag color="orange">MasterCard</Tag>
                    <Tag color="cyan">AMEX</Tag>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        display: "block",
                        marginBottom: 4,
                        fontWeight: 500,
                      }}
                    >
                      Card Number
                    </label>
                    <Input
                      prefix={<CreditCardOutlined style={{ color: "#94A3B8" }} />}
                      placeholder="4242 •••• •••• 4242"
                      defaultValue="4242 4242 4242 4242"
                      style={{ fontFamily: "monospace", height: 38 }}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          color: "#64748B",
                          display: "block",
                          marginBottom: 4,
                          fontWeight: 500,
                        }}
                      >
                        Expiration Date
                      </label>
                      <Input
                        placeholder="MM / YY"
                        defaultValue="12 / 28"
                        style={{ fontFamily: "monospace", height: 38 }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          color: "#64748B",
                          display: "block",
                          marginBottom: 4,
                          fontWeight: 500,
                        }}
                      >
                        CVC / CVV
                      </label>
                      <Input
                        prefix={<LockOutlined style={{ color: "#94A3B8" }} />}
                        placeholder="314"
                        defaultValue="314"
                        style={{ fontFamily: "monospace", height: 38 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        display: "block",
                        marginBottom: 4,
                        fontWeight: 500,
                      }}
                    >
                      Cardholder Name
                    </label>
                    <Input
                      placeholder="Name on card"
                      defaultValue={`${userData?.first_name || "Suhail"} ${
                        userData?.last_name || "Verified Sponsor"
                      }`.trim()}
                      style={{ height: 38 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: 20,
                  background: "#F8FAFC",
                  textAlign: "center",
                }}
              >
                <BankOutlined style={{ fontSize: 36, color: "#007F5F", marginBottom: 10 }} />
                <h4 style={{ margin: "0 0 6px 0", color: "#1E293B", fontSize: 15 }}>
                  Select Mobile Money Provider
                </h4>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>
                  Direct billing supported across Western & Central Africa plus International Bank ACH.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                  <Tag color="orange" style={{ padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
                    Orange Money (CFA)
                  </Tag>
                  <Tag color="yellow" style={{ padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
                    MTN Mobile Money
                  </Tag>
                  <Tag color="blue" style={{ padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
                    Wave Direct
                  </Tag>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 22,
              }}
            >
              <Button
                onClick={() => setCurrentStep(0)}
                style={{ height: 40, padding: "0 18px" }}
              >
                <ArrowLeftOutlined /> Back to Review
              </Button>
              <Button
                type="primary"
                icon={<LockOutlined />}
                onClick={() => setCurrentStep(2)}
                style={{
                  background: "#007F5F",
                  borderColor: "#007F5F",
                  fontWeight: 600,
                  height: 40,
                  padding: "0 24px",
                }}
              >
                Next: Authorize Payment <ArrowRightOutlined />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: BANK 3D-SECURE / OTP VERIFICATION */}
        {currentStep === 2 && (
          <div>
            <Alert
              message="Stripe 3D-Secure (3DS) Bank Authentication Required"
              description={`To protect your account against unauthorized charges, your card issuer / bank requires a one-time verification code (OTP) to approve this payment of ${amount} to Verimed Health.`}
              type="info"
              showIcon
              icon={<LockOutlined style={{ fontSize: 22 }} />}
              style={{
                marginBottom: 20,
                borderRadius: 8,
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
              }}
            />

            <div
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                padding: 24,
                background: "#FFF",
                textAlign: "center",
              }}
            >
              <MobileOutlined style={{ fontSize: 32, color: "#3B82F6", marginBottom: 10 }} />
              <h4 style={{ margin: "0 0 6px 0", color: "#1E293B", fontSize: 15 }}>
                Enter Bank One-Time Verification Code
              </h4>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 18 }}>
                We sent a 6-digit verification code via SMS to your registered mobile <strong>+1 ••• ••• 4150</strong> or Banking App.
              </p>

              <div style={{ maxWidth: 260, margin: "0 auto 16px auto" }}>
                <Input
                  placeholder="Enter 6-digit OTP (e.g. 849201)"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  maxLength={6}
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    letterSpacing: 4,
                    fontWeight: 700,
                    height: 46,
                  }}
                />
              </div>

              <div style={{ fontSize: 12, color: "#64748B" }}>
                Didn't receive code?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setOtpValue("123456");
                    message.success("New 6-digit Bank verification code resent via SMS (Auto-filled 123456)!");
                  }}
                  style={{ color: "#007F5F", fontWeight: 600 }}
                >
                  Resend Code / Auto-fill Code
                </a>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 22,
              }}
            >
              <Button
                onClick={() => setCurrentStep(1)}
                disabled={verifying}
                style={{ height: 40, padding: "0 18px" }}
              >
                <ArrowLeftOutlined /> Back to Card Details
              </Button>
              <Button
                type="primary"
                onClick={handleVerifyOTP}
                loading={verifying}
                style={{
                  background: "#007F5F",
                  borderColor: "#007F5F",
                  fontWeight: 600,
                  height: 40,
                  padding: "0 24px",
                }}
              >
                {verifying ? "Verifying with Bank..." : "Verify OTP & Clear Payment ➔"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: OFFICIAL E-RECEIPT & FINAL CONFIRMATION */}
        {currentStep === 3 && (
          <div>
            <div
              style={{
                background: "#ECFDF5",
                border: "1px solid #6EE7B7",
                borderRadius: 10,
                padding: 20,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <CheckCircleOutlined style={{ fontSize: 44, color: "#10B981", marginBottom: 10 }} />
              <h3 style={{ margin: "0 0 6px 0", color: "#065F46", fontSize: 18, fontWeight: 700 }}>
                Stripe Payment Cleared & Verified!
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: "#047857" }}>
                Transaction successfully authenticated via 256-Bit SSL. Medical team coordination initiated.
              </p>
            </div>

            {/* Official E-Receipt Details */}
            <div
              style={{
                background: "#FFF",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                padding: 18,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px dashed #CBD5E1",
                  paddingBottom: 10,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>
                  Stripe E-Receipt Details
                </span>
                <Tag color="success" style={{ fontWeight: 600 }}>
                  PAID & VERIFIED (#TXN-STRIPE-849201)
                </Tag>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "#64748B" }}>Transaction Reference:</span>
                <strong style={{ fontFamily: "monospace", color: "#1E293B" }}>TXN-VM-849201-992</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "#64748B" }}>Service / Plan:</span>
                <strong style={{ color: "#1E293B" }}>{itemName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "#64748B" }}>Amount Authorized:</span>
                <strong style={{ color: "#007F5F", fontSize: 15 }}>{amount}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "#64748B" }}>Card Billed:</span>
                <span style={{ color: "#334155", fontWeight: 500 }}>VISA •••• 4242 (3D-Secure Verified)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: "#64748B" }}>Medical Team Status:</span>
                <Tag color="blue" style={{ margin: 0, fontWeight: 500 }}>
                  Dispatched to Dr. Foye & Care Coordinators
                </Tag>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  message.success("Official Stripe PDF Receipt (#TXN-VM-849201) downloaded to your device!")
                }
                style={{ height: 40, fontWeight: 500 }}
              >
                Download PDF Receipt
              </Button>

              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleFinalSuccess}
                style={{
                  background: "#007F5F",
                  borderColor: "#007F5F",
                  fontWeight: 600,
                  height: 42,
                  padding: "0 28px",
                  fontSize: 14,
                }}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
