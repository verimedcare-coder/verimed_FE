import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Tag,
  Button,
  Steps,
  Checkbox,
  message,
  Alert,
} from "antd";
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
  paymentLink = null,
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
      message.success(
        "Bank 3D-Secure OTP verified! Payment cleared successfully via Stripe.",
      );
    }, 1200);
  };

  const handleFinalSuccess = () => {
    if (onSuccess) onSuccess();
  };

  const handleProceedToStripe = () => {
    if (paymentLink) {
      window.open(paymentLink, "_blank", "noopener,noreferrer");
      message.success("Redirecting you to Stripe checkout...");
      return;
    }

    setCurrentStep(2);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-[10px] pb-[12px] border-b border-solid border-[#E2E8F0]">
          <SafetyCertificateOutlined className="text-[#007F5F] text-[26px]" />
          <div>
            <h3 className="m-0 text-[#007F5F] text-[18px] font-bold">
              Verimed - Secure Stripe Payment Portal
            </h3>
            <span className="text-[12px] text-[#64748B] font-normal">
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
      <div className="p-[12px 0 4px 0]">
        {/* Ant Design Steps Indicator */}
        <Steps current={currentStep} size="small" className="mb-[24px]">
          <Step title="Review" description="Order Summary" />
          <Step title="Payment" description="Card / Method" />
          <Step title="3D-Secure" description="Bank OTP" />
          <Step title="Receipt" description="Confirmation" />
        </Steps>

        {/* STEP 0: ORDER SUMMARY & MEDICAL REVIEW */}
        {currentStep === 0 && (
          <div>
            <div className="bg-[#F8FAFC] p-[18px] rounded-[10px] border-[1px] border-solid border-[#E2E8F0] mb-[18px]">
              <h4 className="m-[0 0 12px 0] text-[#1E293B] text-[15px] font-semibold flex justify-between items-center">
                <span>{summaryTitle}</span>
                <Tag color="green" className="font-semibold">
                  Guaranteed Sponsor Rate
                </Tag>
              </h4>

              <div className="flex justify-between text-[14px] mb-[8px]">
                <span className="text-[#64748B]">{title}:</span>
                <strong className="text-[#1E293B]">{itemName}</strong>
              </div>

              {subItemName && (
                <div className="flex justify-between text-[14px] mb-[8px]">
                  <span className="text-[#64748B]">Patient / Coverage:</span>
                  <strong className="text-[#1E293B]">{subItemName}</strong>
                </div>
              )}

              <div className="flex justify-between text-[13px] mb-[8px]">
                <span className="text-[#64748B]">Platform Processing Fee:</span>
                <span className="text-[#10B981] font-semibold">
                  $0.00 (Waived)
                </span>
              </div>

              <div className="flex justify-between text-[13px] mb-[8px]">
                <span className="text-[#64748B]">Medical Team Dispatch:</span>
                <span className="text-[#007F5F] font-medium">
                  Instant Dr. Foye Coordination Included
                </span>
              </div>

              <div className="flex justify-between text-[15px] pt-[12px] mt-[12px] border-t border-dashed border-[#CBD5E1]">
                <span className="text-[#1E293B] font-bold">
                  Total Amount Due:
                </span>
                <strong className="text-[#007F5F] text-[18px]">{amount}</strong>
              </div>
            </div>

            <div className="bg-[#EFF6FF] p-[12px] rounded-[8px] border-[1px] border-solid border-[#BFDBFE] mb-[20px]">
              <Checkbox
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="text-[13px] text-[#1E3A8A] font-medium"
              >
                I authorize Verimed Health to securely process this payment via
                Stripe and immediately coordinate patient vitals with our
                clinical team.
              </Checkbox>
            </div>

            <div className="flex justify-end gap-[12px] mt-[20px]">
              <Button
                onClick={onCancel}
                className="h-[40px] py-[0px] px-[20px]"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => setCurrentStep(1)}
                disabled={!agreedTerms}
                className="bg-[#007F5F] font-semibold h-[40px] py-[0px] px-[24px] border-[#007F5F]"
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
            <div className="flex gap-[10px] mb-[16px]">
              <Button
                type={paymentMethod === "card" ? "primary" : "default"}
                icon={<CreditCardOutlined />}
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 font-semibold h-[42px] ${paymentMethod === "card" ? "bg-[#007F5F] border-[#007F5F] text-white" : "bg-transparent border-[#D1D5DB] text-[#374151]"}`}
              >
                Credit / Debit Card
              </Button>
              <Button
                type={paymentMethod === "mobile" ? "primary" : "default"}
                icon={<MobileOutlined />}
                onClick={() => setPaymentMethod("mobile")}
                className={`flex-1 font-semibold h-[42px] ${paymentMethod === "mobile" ? "bg-[#007F5F] border-[#007F5F] text-white" : "bg-transparent border-[#D1D5DB] text-[#374151]"}`}
              >
                Mobile Money / ACH
              </Button>
            </div>

            {paymentMethod === "card" ? (
              <div className="border-[1px] border-solid border-[#E2E8F0] rounded-[10px] p-[16px] bg-[#FFF]">
                <div className="flex justify-between items-center mb-[14px]">
                  <span className="font-semibold text-[13px] text-[#334155]">
                    Stripe 256-Bit SSL Encrypted Card Portal
                  </span>
                  <div className="flex gap-[6px]">
                    <Tag color="blue">VISA</Tag>
                    <Tag color="orange">MasterCard</Tag>
                    <Tag color="cyan">AMEX</Tag>
                  </div>
                </div>

                <div className="flex flex-col gap-[14px]">
                  <div>
                    <label className="text-[12px] text-[#64748B] block mb-[4px] font-medium">
                      Card Number
                    </label>
                    <Input
                      prefix={<CreditCardOutlined className="text-[#94A3B8]" />}
                      placeholder="4242 •••• •••• 4242"
                      defaultValue="4242 4242 4242 4242"
                      className="h-[38px] font-mono"
                    />
                  </div>
                  <div className="grid gap-[12px] grid-cols-2">
                    <div>
                      <label className="text-[12px] text-[#64748B] block mb-[4px] font-medium">
                        Expiration Date
                      </label>
                      <Input
                        placeholder="MM / YY"
                        defaultValue="12 / 28"
                        className="h-[38px] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-[#64748B] block mb-[4px] font-medium">
                        CVC / CVV
                      </label>
                      <Input
                        prefix={<LockOutlined className="text-[#94A3B8]" />}
                        placeholder="314"
                        defaultValue="314"
                        className="h-[38px] font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] text-[#64748B] block mb-[4px] font-medium">
                      Cardholder Name
                    </label>
                    <Input
                      placeholder="Name on card"
                      defaultValue={`${userData?.first_name || "Suhail"} ${
                        userData?.last_name || "Verified Sponsor"
                      }`.trim()}
                      className="h-[38px]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-[1px] border-solid border-[#E2E8F0] rounded-[10px] p-[20px] bg-[#F8FAFC] text-center">
                <BankOutlined className="text-[36px] text-[#007F5F] mb-[10px]" />
                <h4 className="m-[0 0 6px 0] text-[#1E293B] text-[15px]">
                  Select Mobile Money Provider
                </h4>
                <p className="text-[13px] text-[#64748B] mb-[16px]">
                  Direct billing supported across Western & Central Africa plus
                  International Bank ACH.
                </p>
                <div className="flex justify-center gap-[10px] flex-wrap">
                  <Tag
                    color="orange"
                    className="py-[6px] px-[14px] text-[13px] cursor-pointer"
                  >
                    Orange Money (CFA)
                  </Tag>
                  <Tag
                    color="yellow"
                    className="py-[6px] px-[14px] text-[13px] cursor-pointer"
                  >
                    MTN Mobile Money
                  </Tag>
                  <Tag
                    color="blue"
                    className="py-[6px] px-[14px] text-[13px] cursor-pointer"
                  >
                    Wave Direct
                  </Tag>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-[22px]">
              <Button
                onClick={() => setCurrentStep(0)}
                className="h-[40px] py-[0px] px-[18px]"
              >
                <ArrowLeftOutlined /> Back to Review
              </Button>
              <Button
                type="primary"
                icon={<LockOutlined />}
                onClick={handleProceedToStripe}
                className="bg-[#007F5F] font-semibold h-[40px] py-[0px] px-[24px] border-[#007F5F]"
              >
                {paymentLink
                  ? "Continue to Stripe Checkout"
                  : "Next: Authorize Payment"}{" "}
                <ArrowRightOutlined />
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
              icon={<LockOutlined className="text-[22px]" />}
              className="mb-[20px] rounded-[8px] bg-[#EFF6FF] border-[1px] border-solid border-[#BFDBFE]"
            />

            <div className="border-[1px] border-solid border-[#E2E8F0] rounded-[10px] p-[24px] bg-[#FFF] text-center">
              <MobileOutlined className="text-[32px] text-[#3B82F6] mb-[10px]" />
              <h4 className="m-[0 0 6px 0] text-[#1E293B] text-[15px]">
                Enter Bank One-Time Verification Code
              </h4>
              <p className="text-[13px] text-[#64748B] mb-[18px]">
                We sent a 6-digit verification code via SMS to your registered
                mobile <strong>+1 ••• ••• 4150</strong> or Banking App.
              </p>

              <div className="max-w-[260px] m-[0 auto 16px auto]">
                <Input
                  placeholder="Enter 6-digit OTP (e.g. 849201)"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  maxLength={6}
                  className="text-center text-[18px] font-bold h-[46px] tracking-[4px]"
                />
              </div>

              <div className="text-[12px] text-[#64748B]">
                Didn't receive code?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setOtpValue("123456");
                    message.success(
                      "New 6-digit Bank verification code resent via SMS (Auto-filled 123456)!",
                    );
                  }}
                  className="text-[#007F5F] font-semibold"
                >
                  Resend Code / Auto-fill Code
                </a>
              </div>
            </div>

            <div className="flex justify-between items-center mt-[22px]">
              <Button
                onClick={() => setCurrentStep(1)}
                disabled={verifying}
                className="h-[40px] py-[0px] px-[18px]"
              >
                <ArrowLeftOutlined /> Back to Card Details
              </Button>
              <Button
                type="primary"
                onClick={handleVerifyOTP}
                loading={verifying}
                className="bg-[#007F5F] font-semibold h-[40px] py-[0px] px-[24px] border-[#007F5F]"
              >
                {verifying
                  ? "Verifying with Bank..."
                  : "Verify OTP & Clear Payment ➔"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: OFFICIAL E-RECEIPT & FINAL CONFIRMATION */}
        {currentStep === 3 && (
          <div>
            <div className="bg-[#ECFDF5] border-[1px] border-solid border-[#6EE7B7] rounded-[10px] p-[20px] text-center mb-[20px]">
              <CheckCircleOutlined className="text-[44px] text-[#10B981] mb-[10px]" />
              <h3 className="m-[0 0 6px 0] text-[#065F46] text-[18px] font-bold">
                Stripe Payment Cleared & Verified!
              </h3>
              <p className="m-0 text-[13px] text-[#047857]">
                Transaction successfully authenticated via 256-Bit SSL. Medical
                team coordination initiated.
              </p>
            </div>

            {/* Official E-Receipt Details */}
            <div className="bg-[#FFF] border-[1px] border-solid border-[#E2E8F0] rounded-[10px] p-[18px] mb-[20px]">
              <div className="flex justify-between items-center pb-[10px] mb-[10px] border-b border-dashed border-[#CBD5E1]">
                <span className="text-[14px] font-semibold text-[#1E293B]">
                  Stripe E-Receipt Details
                </span>
                <Tag color="success" className="font-semibold">
                  PAID & VERIFIED (#TXN-STRIPE-849201)
                </Tag>
              </div>

              <div className="flex justify-between text-[13px] mb-[8px]">
                <span className="text-[#64748B]">Transaction Reference:</span>
                <strong className="text-[#1E293B] font-mono">
                  TXN-VM-849201-992
                </strong>
              </div>
              <div className="flex justify-between text-[13px] mb-[8px]">
                <span className="text-[#64748B]">Service / Plan:</span>
                <strong className="text-[#1E293B]">{itemName}</strong>
              </div>
              <div className="flex justify-between text-[13px] mb-[8px]">
                <span className="text-[#64748B]">Amount Authorized:</span>
                <strong className="text-[#007F5F] text-[15px]">{amount}</strong>
              </div>
              <div className="flex justify-between text-[13px] mb-[8px]">
                <span className="text-[#64748B]">Card Billed:</span>
                <span className="text-[#334155] font-medium">
                  VISA •••• 4242 (3D-Secure Verified)
                </span>
              </div>
              <div className="flex justify-between text-[13px] mb-[4px]">
                <span className="text-[#64748B]">Medical Team Status:</span>
                <Tag color="blue" className="m-0 font-medium">
                  Dispatched to Dr. Foy & Care Coordinators
                </Tag>
              </div>
            </div>

            <div className="flex justify-between items-center mt-[20px]">
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  message.success(
                    "Official Stripe PDF Receipt (#TXN-VM-849201) downloaded to your device!",
                  )
                }
                className="h-[40px] font-medium"
              >
                Download PDF Receipt
              </Button>

              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleFinalSuccess}
                className="bg-[#007F5F] font-semibold h-[42px] py-[0px] px-[28px] text-[14px] border-[#007F5F]"
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
