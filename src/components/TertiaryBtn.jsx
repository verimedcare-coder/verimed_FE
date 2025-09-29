import React from "react";

export default function TertiaryBtn({
  name = "Click Me",
  onClick,
  style = {},
  ...props
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: "#fff",
        fontWeight: 600,
        border: "1.5px solid #FFFFFF",
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
      {name}
    </button>
  );
}
