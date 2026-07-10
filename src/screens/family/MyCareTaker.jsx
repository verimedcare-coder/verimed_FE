import React from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { Button, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Primarybtn from "../../components/common/PrimaryBtn";

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

export default function MyCareTaker() {
  const appointmentDetails = [];
  const timelineData = [];

  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        {/* Content area */}
        <div className="p-[20px] overflow-y-auto overflow-x-hidden gap-[20px] flex flex-col items-center">
          {/* Care Taker Details */}
          <div className="w-[98%] flex flex-row items-center justify-between">
            <p className="text-left capitalize text-[#2E2E2E] text-[16px] font-medium">
              Care Taker Details
            </p>
            <SecondaryBtn name="Send Message" onClick={() => {}} />
          </div>

          <div className="p-[20px] rounded-[16px] w-[95%] border border-solid border-[#1B1B1B1A]">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center justify-center gap-[20px]">
                <img
                  src={patientdetails}
                  alt="profile"
                  className="w-[64px] h-[64px] rounded-[12px] shrink-0 object-cover"
                />
                <div>
                  <p className="text-[#2E2E2E] font-medium opacity-60">Name</p>
                  <p className="text-[#2E2E2E] text-[18px] font-bold">Clarissa A.</p>
                </div>
              </div>
              <div>
                <p className="text-[#2E2E2E] font-medium opacity-60">Role</p>
                <p className="text-[#2E2E2E] text-[18px] font-bold">Geriatric Care</p>
              </div>
              <div>
                <p className="text-[#2E2E2E] font-medium opacity-60">Contact Number</p>
                <p className="text-[#2E2E2E] text-[18px] font-bold">+966 558441502</p>
              </div>
              <div>
                <p className="text-[#2E2E2E] font-medium opacity-60">Assigned Since</p>
                <p className="text-[#2E2E2E] text-[18px] font-bold">July 2025</p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10" />
            <div>
              <p className="text-[#2E2E2E] font-medium opacity-60">Role</p>
              <p className="text-[#2E2E2E] text-[18px] font-bold">
                Daily monitoring, vitals check, record submission
              </p>
            </div>
          </div>

          {/* divider */}
          <div className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10" />

          {/* Latest Actions By Care Taker */}
          <div className="grid grid-cols-[2fr_1fr] gap-[20px] w-full">
            {/* LEFT: Latest Actions Timeline */}
            <div className="bg-white rounded-[12px] p-[20px] flex flex-col gap-[20px]">
              <div className="flex items-center justify-between">
                <SectionHeader title="Latest Actions by Care Taker" />
                <Button onClick={() => {}} className="border-none text-[#F0C330] text-[20px] font-semibold shadow-none">
                  View All
                </Button>
              </div>
              <div className="relative ml-[20px] flex flex-col gap-[20px]">
                <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-[#2E2E2E] opacity-10"></div>
                {appointmentDetails.map((item, index) => (
                  <div key={index} className="flex items-start gap-[15px] relative">
                    <div className="w-[12px] h-[12px] rounded-full bg-[#004E89] mt-[5px] shrink-0 z-10"></div>
                    <div className="bg-[#004E890A] border border-solid border-[#E6E8EB] rounded-[10px] p-[15px] flex-1 gap-[16px]">
                      <div className="flex justify-between items-center mb-[-10px]">
                        <p className="text-[12px] font-semibold mb-[8px] text-[#2E2E2E]">{item.date}</p>
                      </div>
                      {item.title1 && (
                        <p className="text-[14px] font-medium text-[#2E2E2E]">
                          {item.title1}:{" "}
                          <span className="text-[14px] font-medium text-[#06152B99]">
                            {item.answer1}
                          </span>
                        </p>
                      )}
                      {item.title2 && (
                        <p className="text-[14px] font-medium text-[#2E2E2E]">
                          {item.title2}:{" "}
                          <span className="text-[14px] font-medium text-[#06152B99]">
                            {item.answer2}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Health Monitoring Snapshot */}
            <div className="bg-[#004E890A] rounded-[12px] p-[20px] flex flex-col border border-solid border-[#004E89]">
              <div className="flex items-center justify-between">
                <SectionHeader title="Health Monitoring Snapshot" />
                <Button onClick={() => {}} className="border-none text-[#F0C330] text-[20px] font-semibold bg-transparent shadow-none">
                  View All
                </Button>
              </div>
              {timelineData.map((item, index) => (
                <div key={index} className="mb-[20px] relative border-b border-solid border-[#1B1B1B1A] pb-[20px]">
                  <p className="text-[14px] font-medium text-[#2E2E2E]">
                    Blood Pressure:{" "}
                    <span className="text-[14px] font-medium text-[#06152B99]">{item.bloodPressure}</span>
                  </p>
                  <p className="text-[14px] font-medium text-[#2E2E2E]">
                    Blood Sugar:{" "}
                    <span className="text-[14px] font-medium text-[#06152B99]">{item.bloodSugar}</span>
                  </p>
                  <p className="text-[14px] font-medium text-[#2E2E2E]">
                    Temperature:{" "}
                    <span className="text-[14px] font-medium text-[#06152B99]">{item.temp}</span>
                  </p>
                  <p className="text-[14px] font-medium text-[#2E2E2E]">
                    Oxygen:{" "}
                    <span className="text-[14px] font-medium text-[#06152B99]">{item.oxygen}</span>
                  </p>
                  <p className="text-[14px] font-medium text-[#2E2E2E]">
                    Heart Rate:{" "}
                    <span className="text-[14px] font-medium text-[#06152B99]">{item.heartRate}</span>
                  </p>
                  <p className="text-[14px] font-medium text-[#2E2E2E]">
                    Weight:{" "}
                    <span className="text-[14px] font-medium text-[#06152B99]">{item.weight}</span>
                  </p>
                  <p className="text-[12px] italic text-[#6B7280] absolute bottom-[-5px] right-[8px]">{item.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* divider */}
          <div className="h-[1px] w-full bg-[#1B1B1B] mt-[10px] mb-[10px] opacity-10" />

          {/* Feedback To My Care Taker */}
          <div className="bg-white rounded-[16px] p-[20px] w-[97%] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <SectionHeader title="Feedback to My Care Taker" />
            <div className="h-[1px] w-full bg-[#1B1B1B] opacity-10" />
            <div className="flex gap-[20px] mt-[20px] w-full">
              {/* How are you feeling today? */}
              <div className="flex-1">
                <Select
                  className="w-full h-[42px]"
                  placeholder="How are you feeling today?"
                  options={[
                    { value: "good", label: "Good" },
                    { value: "okay", label: "Okay" },
                    { value: "not_well", label: "Not Well" },
                  ]}
                />
              </div>
              {/* Attach Photo */}
              <div className="flex-1">
                <Upload
                  name="photo"
                  listType="picture"
                  maxCount={1}
                  showUploadList={{ showPreviewIcon: false }}
                  beforeUpload={() => false}
                  className="w-full"
                >
                  <Button icon={<UploadOutlined />} className="w-full h-[42px]">
                    Attach Photo (medication pack, wound check)
                  </Button>
                </Upload>
              </div>
            </div>
            {/* Your Comments */}
            <div className="w-full mt-[20px]">
              <Input.TextArea rows={4} placeholder="Your Comments" className="w-full" />
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-[10px] mt-[24px] w-full">
              <SecondaryBtn name="Cancel" onClick={() => {}} />
              <Primarybtn name="Submit Feedback" onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
