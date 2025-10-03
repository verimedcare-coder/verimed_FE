import React from "react";
import bannerImage from "../assets/images/banner-img.png";
import Profile1 from "../assets/images/banner-profile1.png";
import Profile2 from "../assets/images/banner-profile2.png";
import Profile3 from "../assets/images/banner-profile3.png";
import Primarybtn from "./PrimaryBtn";
import TertiaryBtn from "./TertiaryBtn";

export default function Banner({ hideButtons = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        width: "100%",
        background: "linear-gradient(90deg, #B0B9BC 0%, #568392 100%)",
        borderRadius: "16px",
        position: "relative",
        marginTop: "-10px",
      }}
    >
      {/* Left Section */}
      <div style={{ flex: 1, color: "#2E2E2E" }}>
        <h2
          style={{
            fontSize: "32px",
            color: "#007F5F",
            fontWeight: "600",
            lineHeight: "1.4",
            marginBottom: "12px",
          }}
        >
          No need to visit local hospitals
          <br />
          Get your consultation online
        </h2>

        <p
          style={{
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          Audio/text/video/in-person
        </p>

        {/* Profiles */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={Profile1}
              alt="doctor1"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
            <img
              src={Profile2}
              alt="doctor2"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "2px solid white",
                marginLeft: -10,
              }}
            />
            <img
              src={Profile3}
              alt="doctor3"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "2px solid white",
                marginLeft: -10,
              }}
            />
          </div>
          <span
            style={{
              marginLeft: 12,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            +100 doctors
          </span>
        </div>

        {/* Buttons - show only if not hidden */}
        {!hideButtons && (
          <div style={{ display: "flex", gap: "12px" }}>
            <Primarybtn name=" Get Appointment" onClick={() => {}} />
            <TertiaryBtn name=" Update Membership" />
          </div>
        )}
      </div>

      {/* Right Section */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <img
          src={bannerImage}
          alt="Doctors"
          style={{
            height: "228px",
            width: 295,
            top: "40px",
            position: "relative",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
