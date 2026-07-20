import React from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import patientdetails from "../../assets/images/patient-profile.jpg";
import { Button, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Primarybtn from "../../components/common/PrimaryBtn";
import BackButton from "../../components/common/BackButton";

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
          <div className="w-[98%] flex flex-row items-center justify-between mb-[10px]">
            <div className="flex items-center gap-[12px]">
              <BackButton />
              <h1 className="m-0 text-left capitalize text-[#1E293B] text-[22px] font-bold">
                Care Taker Details
              </h1>
            </div>
            <SecondaryBtn name="Send Message" onClick={() => {}} />
          </div>

          <div className="p-[24px] rounded-[16px] w-[98%] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-solid border-[#E2E8F0]">
            <div className="flex flex-row items-center justify-between w-full flex-wrap gap-[20px]">
              <div className="flex flex-row items-center justify-center gap-[20px]">
                <img
                  src={patientdetails}
                  alt="profile"
                  className="w-[80px] h-[80px] rounded-[16px] shrink-0 object-cover border-[2px] border-solid border-[#E6F0FA]"
                />
                <div>
                  <p className="text-[#64748B] text-[13px] font-medium mb-[4px]">Name</p>
                  <p className="text-[#0F172A] text-[20px] font-bold m-0">Clarissa A.</p>
                </div>
              </div>
              <div>
                <p className="text-[#64748B] text-[13px] font-medium mb-[4px]">Role</p>
                <div className="bg-[#FEF3C7] text-[#D97706] px-[12px] py-[4px] rounded-full text-[14px] font-semibold">Geriatric Care</div>
              </div>
              <div>
                <p className="text-[#64748B] text-[13px] font-medium mb-[4px]">Contact Number</p>
                <p className="text-[#0F172A] text-[16px] font-semibold m-0">+966 558441502</p>
              </div>
              <div>
                <p className="text-[#64748B] text-[13px] font-medium mb-[4px]">Assigned Since</p>
                <p className="text-[#0F172A] text-[16px] font-semibold m-0">July 2025</p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#E2E8F0] mt-[20px] mb-[20px]" />
            <div>
              <p className="text-[#64748B] text-[13px] font-medium mb-[4px]">Responsibilities</p>
              <p className="text-[#334155] text-[15px] font-medium m-0">
                Daily monitoring, vitals check, record submission
              </p>
            </div>
          </div>

          {/* divider */}
          <div className="h-[1px] w-[98%] bg-[#E2E8F0] mt-[10px] mb-[10px]" />

          {/* Latest Actions By Care Taker */}
          <div className="grid grid-cols-[2fr_1fr] gap-[20px] w-[98%]">
            {/* LEFT: Latest Actions Timeline */}
            <div className="bg-white rounded-[16px] p-[24px] flex flex-col gap-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-solid border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <SectionHeader title="Latest Actions by Care Taker" />
                <Button type="link" className="text-[#004C91] font-semibold text-[15px] p-0 hover:text-[#003B73]">
                  View All
                </Button>
              </div>
              <div className="relative ml-[20px] flex flex-col gap-[20px] mt-[10px]">
                <div className="absolute left-[5px] top-0 bottom-0 w-[2px] bg-[#E2E8F0]"></div>
                {appointmentDetails.map((item, index) => (
                  <div key={index} className="flex items-start gap-[20px] relative">
                    <div className="w-[12px] h-[12px] rounded-full bg-[#004C91] mt-[6px] shrink-0 z-10 shadow-[0_0_0_4px_#E6F0FA]"></div>
                    <div className="bg-[#F8FAFC] border border-solid border-[#E2E8F0] rounded-[12px] p-[16px] flex-1">
                      <div className="flex justify-between items-center mb-[8px]">
                        <p className="text-[13px] font-semibold text-[#64748B] m-0">{item.date}</p>
                      </div>
                      {item.title1 && (
                        <p className="text-[14px] text-[#334155] m-0 mb-[4px]">
                          <span className="font-semibold text-[#0F172A]">{item.title1}:</span> {item.answer1}
                        </p>
                      )}
                      {item.title2 && (
                        <p className="text-[14px] text-[#334155] m-0">
                          <span className="font-semibold text-[#0F172A]">{item.title2}:</span> {item.answer2}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {appointmentDetails.length === 0 && (
                  <div className="text-center text-[#64748B] py-[20px]">No recent actions found.</div>
                )}
              </div>
            </div>

            {/* RIGHT: Health Monitoring Snapshot */}
            <div className="bg-gradient-to-br from-[#004C91] to-[#0066C0] rounded-[16px] p-[24px] flex flex-col text-white shadow-[0_4px_12px_rgba(0,76,145,0.2)]">
              <div className="flex items-center justify-between mb-[20px]">
                <p className="text-[18px] font-semibold m-0">Health Snapshot</p>
                <Button type="text" className="text-white opacity-80 hover:opacity-100 font-semibold p-0">
                  View All
                </Button>
              </div>
              {timelineData.map((item, index) => (
                <div key={index} className="mb-[20px] relative border-b border-solid border-[#ffffff33] pb-[20px] last:border-0 last:mb-0 last:pb-0">
                  <div className="grid grid-cols-2 gap-[12px]">
                    <div>
                      <p className="text-[12px] opacity-70 m-0">Blood Pressure</p>
                      <p className="text-[15px] font-semibold m-0">{item.bloodPressure}</p>
                    </div>
                    <div>
                      <p className="text-[12px] opacity-70 m-0">Blood Sugar</p>
                      <p className="text-[15px] font-semibold m-0">{item.bloodSugar}</p>
                    </div>
                    <div>
                      <p className="text-[12px] opacity-70 m-0">Temperature</p>
                      <p className="text-[15px] font-semibold m-0">{item.temp}</p>
                    </div>
                    <div>
                      <p className="text-[12px] opacity-70 m-0">Oxygen</p>
                      <p className="text-[15px] font-semibold m-0">{item.oxygen}</p>
                    </div>
                  </div>
                  <p className="text-[12px] italic opacity-60 absolute bottom-[-5px] right-[0px]">{item.date}</p>
                </div>
              ))}
              {timelineData.length === 0 && (
                <div className="text-center opacity-80 py-[20px]">No recent health data available.</div>
              )}
            </div>
          </div>

          {/* divider */}
          <div className="h-[1px] w-[98%] bg-[#E2E8F0] mt-[10px] mb-[10px]" />

          {/* Feedback To My Care Taker */}
          <div className="bg-white rounded-[16px] p-[24px] w-[98%] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-solid border-[#E2E8F0] mb-[30px]">
            <h2 className="text-[18px] font-semibold text-[#1E293B] m-0 mb-[16px]">Feedback to My Care Taker</h2>
            <div className="h-[1px] w-full bg-[#E2E8F0] mb-[20px]" />
            <div className="flex gap-[20px] flex-col md:flex-row w-full">
              {/* How are you feeling today? */}
              <div className="flex-1">
                <label className="block text-[14px] font-medium text-[#475569] mb-[8px]">How are you feeling today?</label>
                <Select
                  className="w-full h-[42px]"
                  placeholder="Select an option"
                  options={[
                    { value: "good", label: "Good" },
                    { value: "okay", label: "Okay" },
                    { value: "not_well", label: "Not Well" },
                  ]}
                />
              </div>
              {/* Attach Photo */}
              <div className="flex-1">
                <label className="block text-[14px] font-medium text-[#475569] mb-[8px]">Attach Photo</label>
                <Upload
                  name="photo"
                  listType="picture"
                  maxCount={1}
                  showUploadList={{ showPreviewIcon: false }}
                  beforeUpload={() => false}
                  className="w-full"
                >
                  <Button icon={<UploadOutlined />} className="w-full h-[42px] border-[#CBD5E1] text-[#475569]">
                    Attach Photo (medication pack, wound check)
                  </Button>
                </Upload>
              </div>
            </div>
            {/* Your Comments */}
            <div className="w-full mt-[20px]">
              <label className="block text-[14px] font-medium text-[#475569] mb-[8px]">Your Comments</label>
              <Input.TextArea rows={4} placeholder="Enter your detailed comments here..." className="w-full rounded-[8px] border-[#CBD5E1]" />
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-[12px] mt-[24px] w-full">
              <Button onClick={() => {}} className="h-[40px] px-[20px] rounded-[6px] font-medium">
                Cancel
              </Button>
              <Primarybtn name="Submit Feedback" onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
