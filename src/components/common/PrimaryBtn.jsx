// components/Primarybtn.jsx
import React from "react";

export default function Primarybtn({
  name = "Click Me",
  icon = null,
  onClick,
  style = {},
  className = "",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      {...props}
      className={`flex items-center ${
        icon ? "gap-[6px]" : "gap-0"
      } bg-gradient-to-b from-[#F0C330] to-[#B78520] text-white font-semibold border-none rounded-[6px] py-[9px] px-[14px] text-[14px] cursor-pointer w-auto whitespace-nowrap capitalize transition-opacity hover:opacity-95 ${className}`}
    >
      {icon && <span> {icon}</span>}
      {name}
    </button>
  );
}
