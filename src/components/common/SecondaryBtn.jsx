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
      className={`flex items-center ${
        icon ? "gap-[6px]" : "gap-0"
      } bg-[#F0C3300A] text-[#F0C330] font-semibold border-[1.5px] border-solid border-[#F0C330] rounded-[6px] py-[9px] px-[14px] text-[14px] cursor-pointer w-auto whitespace-nowrap capitalize transition-opacity hover:opacity-90`}
      style={style}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {name}
    </button>
  );
}
