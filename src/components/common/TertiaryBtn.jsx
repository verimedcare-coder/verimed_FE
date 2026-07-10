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
      className="bg-transparent text-white font-semibold border-[1.5px] border-solid border-white rounded-[6px] py-[9px] px-[14px] text-[14px] cursor-pointer w-auto whitespace-nowrap capitalize transition-opacity hover:opacity-80 flex items-center justify-center"
      style={style}
      {...props}
    >
      {name}
    </button>
  );
}
