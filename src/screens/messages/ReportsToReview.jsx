/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";

export default function ReportsToReview() {
  return (
    <div
      className="flex h-screen bg-[#F7F9FB]"
    >
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        {/* Content area with just text */}
        <div
          className="p-[20px] overflow-y-auto overflow-x-hidden gap-[20px] flex flex-col items-center"
        ></div>
      </div>
    </div>
  );
}
