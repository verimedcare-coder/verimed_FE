import React from "react";
export default function SecondaryBtn({
  name = "Click Me",
  onClick,
  icon = null,
  style = {},
  ...props
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#F0C3300A",
        color: "#F0C330",
        fontWeight: 600,
        gap: icon ? "6px" : "0",
        border: "1.5px solid #F0C330",
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
      {icon && <span>{icon}</span>}
      {name}
    </button>
  );
}
