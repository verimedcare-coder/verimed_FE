import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function BackButton({ fallbackPath = -1, className = "" }) {
  const navigate = useNavigate();

  return (
    <Button
      type="text"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(fallbackPath)}
      className={`flex items-center gap-[6px] text-[#004C91] hover:text-[#003B73] hover:bg-[#E6F0FA] font-medium rounded-[6px] px-[12px] h-[36px] ${className}`}
    >
      Back
    </Button>
  );
}
