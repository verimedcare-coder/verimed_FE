import React from "react";
import flagIcon from "../assets/icons/flag.svg";
import logoutIcon from "../assets/icons/logout.svg";
import notifyIcon from "../assets/icons/notify.svg";
import searchIcon from "../assets/icons/search.svg";
import downArrow from "../assets/icons/downArrow.svg";
import Primarybtn from "./PrimaryBtn";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #ddd",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Section */}
      <div style={{ display: "flex", gap: "8px", fontSize: "16px" }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#2E2E2E" }}>
          Sponsor –
        </span>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#2E2E2E" }}>
          Welcome Back, Jenifer Johnson
        </span>
      </div>

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Dropdown */}
        <select
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #00000014",
            borderRadius: "6px",
            padding: "10px 12px",
            fontSize: "14px",
            color: "#2E2E2E",
          }}
        >
          <option>Mr. Samuel N.</option>
        </select>

        <Primarybtn name="add a patient" onClick={() => {}} />

        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#F3F5F8",
            borderRadius: "6px",
            padding: "10px 12px",
            border: "1px solid #00000014",
          }}
        >
          <img
            src={searchIcon}
            alt="Search"
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          <input
            type="text"
            placeholder="Search"
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "14px",
              width: "120px",
            }}
          />
        </div>

        {/* Language Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 8px",
            cursor: "pointer",
          }}
        >
          <img src={flagIcon} alt="Flag" style={{ width: 20, height: 20 }} />
          <span style={{ fontSize: 14 }}>EN</span>
          <span>
            <img src={downArrow} alt="Down Arrow" />
          </span>
        </div>

        {/* Notification Icon */}
        <div
          style={{
            backgroundColor: "#F3F5F8",
            padding: "3px 4px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "1px solid #00000014",
          }}
        >
          <img
            src={notifyIcon}
            alt="Notifications"
            style={{ width: 26, height: 26 }}
          />
        </div>

        {/* Logout Icon */}
        <div
          style={{
            backgroundColor: "#FF45451F",
            padding: "3px 4px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "1px solid #FF4545",
          }}
        >
          <img
            src={logoutIcon}
            alt="Logout"
            style={{ width: 24, height: 24 }}
          />
        </div>
      </div>
    </div>
  );
}
