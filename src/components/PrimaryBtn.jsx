// components/Primarybtn.jsx
import React from "react";

export default function Primarybtn({
  name = "Click Me",
  icon = null,
  onClick,
  style = {},
  ...props
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: icon ? "6px" : "0", // space between icon and text
        background: "linear-gradient(180deg, #F0C330 , #B78520)",
        color: "#fff",
        fontWeight: 600,
        border: "none",
        borderRadius: "6px",
        padding: "9px 14px",
        fontSize: "14px",
        cursor: "pointer",
        width: "auto",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
        ...style,
      }}
      {...props}
    >
      {icon && <span> {icon}</span>}
      {name}
    </button>
  );
}
