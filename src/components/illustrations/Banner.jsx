import React from "react";
import BannerIllustration from "./BannerIllustration";
import Profile1 from "../../assets/images/banner-profile1.png";
import Profile2 from "../../assets/images/banner-profile2.png";
import Profile3 from "../../assets/images/banner-profile3.png";
import Primarybtn from "../common/PrimaryBtn";
import TertiaryBtn from "../common/TertiaryBtn";
import { useNavigate } from "react-router-dom";

export default function Banner({ hideButtons = false }) {
  const navigate = useNavigate();
  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch {
      return null;
    }
  })();

  return (
    <div className="flex justify-between items-center p-[20px] w-full bg-gradient-to-r from-[#B0B9BC] to-[#568392] rounded-[16px] relative mt-[-10px]">
      {/* Left Section */}
      <div className="flex-1 text-[#2E2E2E]">
        {userData?.service_purchased && (
          <div className="inline-flex items-center gap-2 bg-[#007F5F] text-white px-3 py-1 rounded-full text-[13px] font-semibold mb-3 shadow-sm">
            <span>✓ Active Care Plan:</span>
            <span>{userData.service_purchased}</span>
          </div>
        )}

        <h2 className="text-[32px] text-[#007F5F] font-semibold mb-[12px] leading-[1.4]">
          No need to visit local hospitals
          <br />
          Get your consultation online
        </h2>

        <p className="text-[16px] mb-[20px]">
          Audio/text/video/in-person
        </p>

        {/* Profiles */}
        <div className="flex items-center mb-[20px]">
          <div className="flex items-center">
            <img
              src={Profile1}
              alt="doctor1"
              className="w-[32px] h-[32px] rounded-full border-[2px] border-solid border-[white]"
            />
            <img
              src={Profile2}
              alt="doctor2"
              className="w-[32px] h-[32px] rounded-full border-[2px] border-solid border-[white] ml-[-10]"
            />
            <img
              src={Profile3}
              alt="doctor3"
              className="w-[32px] h-[32px] rounded-full border-[2px] border-solid border-[white] ml-[-10]"
            />
          </div>
          <span className="ml-[12px] text-[14px] font-medium">
            +10 doctors
          </span>
        </div>

        {/* Buttons - show only if not hidden */}
        {!hideButtons && (
          <div className="flex gap-[12px] items-center flex-wrap">
            <Primarybtn
              name="Request Appointment"
              onClick={() =>
                navigate("/appointments", { state: { openBookingModal: true } })
              }
            />
            {userData?.service_purchased ? (
              <span className="text-[13px] font-semibold text-[#007F5F] bg-white/80 px-3 py-2 rounded-[8px]">
                Covered under your plan
              </span>
            ) : (
              <TertiaryBtn
                name="Purchase Service"
                onClick={() =>
                  (window.location.href = "https://verimed.care/services")
                }
              />
            )}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex-1 relative flex justify-end">
        <BannerIllustration />
      </div>
    </div>
  );
}
