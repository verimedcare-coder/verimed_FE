/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, no-useless-escape */
import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import {
  CalendarOutlined,
  EllipsisOutlined,
  FilterOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";
import Primarybtn from "../../components/common/PrimaryBtn";
import newMessage from "../../assets/icons/new-message.svg";
import { Button, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";

function SectionHeader({ title, children }) {
  return (
    <div
      className="flex justify-between items-center flex-wrap gap-[10px] min-w-0"
    >
      <p className="text-[16px] font-semibold text-[#1B1B1B]">{title}</p>
      <div className="flex gap-[10px] flex-wrap">
        {children}
      </div>
    </div>
  );
}

const initialUsers = [
  {
    id: 1,
    name: "Jane Doe",
    message: "Hi, I want make enquiries about your...",
    time: "12:55 am",
    unread: 2,
    online: true,
    isNew: true,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Janet Adebayo",
    message: "Hi, I want make enquiries about your...",
    time: "12:56 am",
    unread: 1,
    online: true,
    isNew: true,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Kunle Adekunle",
    message: "Macbook Pro",
    time: "12:55 am",
    unread: 0,
    online: false,
    isNew: false,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Mary Obi",
    message: "Do you deliver outside Lagos?",
    time: "12:40 am",
    unread: 3,
    online: true,
    isNew: true,
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 5,
    name: "Chris Johnson",
    message: "Need to confirm the invoice",
    time: "12:35 am",
    unread: 0,
    online: false,
    isNew: false,
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
];

const initialMessages = {
  1: [
    { sender: "them", text: "Hello!", time: "12:00" },
    { sender: "me", text: "Hi Jane, how can I help?", time: "12:01" },
  ],
  2: [{ sender: "them", text: "Is this product in stock?", time: "1:00" }],
  3: [],
  // Add for all users
};

const docStats = [
  {
    id: 1,
    name: "Total Messages",
    count: 1245,
    diff: "+95%",
  },
  {
    id: 2,
    name: "Average Response",
    count: 500,
    diff: "+95%",
  },
  {
    id: 3,
    name: "Open Tickets",
    count: 20,
    diff: "+95%",
  },
  {
    id: 4,
    name: "Escalated Issues",
    count: 24,
    diff: "+25%",
  },
  {
    id: 5,
    name: "Resolved Conversations",
    count: 6,
    diff: "+15%",
  },
];

const memberShipPlansConfif = {
  data: [
    { type: "Sponsors", value: 555 },
    { type: "Doctors", value: 254 },
    { type: "Care Takers", value: 215 },
    { type: "Patients", value: 125 },
  ],
  angleField: "value",
  colorField: "type",
  color: ["#1E90FF", "#36AC00", "#FFB020", "#EF2412"],
  radius: 0.8,
  innerRadius: 0.4,
  label: {
    text: "value",
    style: { fontWeight: "bold" },
  },
  legend: { position: "bottom" },
  interactions: [{ type: "element-active" }],
};

const statusBarConfig = {
  data: [
    { month: "01", Completed: 100, Ongoing: 50, Pending: 30 },
    { month: "02", Completed: 120, Ongoing: 70, Pending: 40 },
    { month: "03", Completed: 150, Ongoing: 80, Pending: 50 },
    { month: "04", Completed: 180, Ongoing: 60, Pending: 30 },
    { month: "05", Completed: 240, Ongoing: 80, Pending: 50 },
    { month: "06", Completed: 100, Ongoing: 40, Pending: 20 },
    { month: "07", Completed: 130, Ongoing: 60, Pending: 30 },
    { month: "08", Completed: 220, Ongoing: 80, Pending: 40 },
    { month: "09", Completed: 250, Ongoing: 90, Pending: 60 },
    { month: "10", Completed: 200, Ongoing: 70, Pending: 40 },
    { month: "11", Completed: 180, Ongoing: 60, Pending: 30 },
    { month: "12", Completed: 140, Ongoing: 50, Pending: 20 },
  ],
  isStack: true,
  xField: "month",
  yField: "value",
  seriesField: "type",
};

const transformedData = [];
statusBarConfig.data.forEach((item) => {
  transformedData.push(
    { month: item.month, type: "Completed", value: item.Completed },
    { month: item.month, type: "Ongoing", value: item.Ongoing },
    { month: item.month, type: "Pending", value: item.Pending }
  );
});

const stackedBarConfig = {
  data: transformedData,
  isStack: true,
  xField: "month",
  yField: "value",
  seriesField: "type",
  color: ["#00C49F", "#0088FE", "#FFBB28"],
  legend: { position: "bottom" },
};

const conversationData = [
  {
    id: 1,
    userName: "Dr. Anna Ngu",
    userRole: "Doctor",
    subject: "Appointment Follow-up",
    timestamp: "12:30 PM",
    status: "Active",
  },
  {
    id: 2,
    userName: "Mrs. Atom",
    userRole: "Sponsor",
    subject: "Billing Clarification",
    timestamp: "10:45 AM",
    status: "Active",
  },
  {
    id: 3,
    userName: "Nurse Lucy",
    userRole: "Care Taker",
    subject: "Patient Status Update",
    timestamp: "12:30 PM",
    status: "Active",
  },
  {
    id: 4,
    userName: "Dr. Anna Ngu",
    userRole: "Doctor",
    subject: "Appointment Follow-up",
    timestamp: "12:30 PM",
    status: "Active",
  },
];

// Table Columns
const columns = [
  {
    title: "User Name",
    dataIndex: "userName",
    key: "userName",
    width: 180,
  },
  {
    title: "User Role",
    dataIndex: "userRole",
    key: "userRole",
    width: 140,
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
    width: 200,
  },
  {
    title: "Timestamp",
    dataIndex: "timestamp",
    key: "timestamp",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status) => (
      <Tag
        color={status === "Active" ? "green" : "volcano"}
        className="rounded-[20px] font-medium py-[2px] px-[12px]"
      >
        {status}
      </Tag>
    ),
  },
  {
    title: "Action",
    key: "action",
    width: 80,
    render: (_, record) => (
      <Button
        type="text"
        icon={<EllipsisOutlined />}
        onClick={() => alert(`Actions for ${record.userName}`)}
      />
    ),
  },
];
export default function Support() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [newSearchTerm, setNewSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = () => {
    if (messageInput.trim() && selectedUser) {
      const newMessage = {
        sender: "me",
        text: messageInput,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));

      setMessageInput("");
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, unread: 0, isNew: false } : u
    );
    setUsers(updatedUsers);
  };

  const newMessageUsers = users.filter(
    (user) => !messages[user.id] || messages[user.id].length === 0
  );

  const filteredNewMessageUsers = newMessageUsers.filter((user) =>
    user.name.toLowerCase().includes(newSearchTerm.toLowerCase())
  );

  const handleStartNewConversation = (user) => {
    handleSelectUser(user);
    setIsModalOpen(false);
  };

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
        >
          {/* stats */}
          <div
            className="flex items-center justify-between gap-[12px] w-full"
          >
            {docStats.map((stat, idx) => (
              <div
                key={stat.id}
                className="min-w-[160px] flex-[0_0_auto] bg-white rounded-[8px] p-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between"
              >
                {/* ...card content... */}
                <div
                  className="flex items-center justify-start gap-[10px]"
                >
                  <div
                    className="h-[30px] w-[30px] rounded-[100px] flex items-center justify-center bg-[#007F5F33]"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_484_11034)">
                        <path
                          d="M11.5 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V11"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 3V7"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 3V7"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 11H20"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.0001 22.0001L21.3501 18.7161C21.5556 18.5168 21.719 18.2783 21.8307 18.0147C21.9425 17.7512 22.0003 17.4679 22.0007 17.1817C22.0012 16.8954 21.9443 16.612 21.8334 16.3481C21.7225 16.0841 21.5599 15.8451 21.3551 15.6451C20.9373 15.2365 20.3763 15.0071 19.7918 15.006C19.2074 15.0049 18.6455 15.2321 18.2261 15.6391L18.0021 15.8591L17.7791 15.6391C17.3613 15.2307 16.8006 15.0016 16.2163 15.0005C15.6321 14.9994 15.0705 15.2264 14.6511 15.6331C14.4456 15.8324 14.2821 16.0708 14.1703 16.3343C14.0585 16.5978 14.0006 16.8811 14 17.1673C13.9994 17.4536 14.0562 17.7371 14.167 18.001C14.2778 18.265 14.4404 18.504 14.6451 18.7041L18.0001 22.0001Z"
                          stroke="#007F5F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_484_11034">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p
                    className="text-[#6C7688] text-[14px] font-medium"
                  >
                    {stat.name}
                  </p>
                </div>
                <div
                  className="flex items-center justify-between"
                >
                  <p
                    className="text-[#2E2E2E] text-[18px] font-extrabold"
                  >
                    {stat.count}
                  </p>
                  <div
                    className="flex flex-col items-end justify-center w-full"
                  >
                    <div
                      className="bg-[#27AE60] h-[20px] w-[49px] flex items-center justify-center rounded-[6px]"
                    >
                      <p
                        className="text-[white] text-[12px] font-medium"
                      >
                        {stat.diff}
                      </p>
                    </div>
                    <p className="text-[#6C7688] text-[13px]">
                      {stat.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* charts */}
          <div
            className="flex items-center justify-between w-full gap-[20px]"
          >
            {/* Left: Pie Chart */}
            <div
              className="w-[50%] bg-white h-[437px] rounded-[8px] p-[24px] flex flex-col"
            >
              <div
                className="flex justify-between items-center mb-[16px]"
              >
                <p className="font-semibold text-[18px] text-[#1B1B1B]">
                  Messages
                </p>
                <span
                  onClick={() => {}}
                  className="bg-white rounded-[6px] py-[6px] px-[14px] text-[14px] font-medium text-[#1F2329] cursor-pointer border-[1px] border-solid border-[#0000001F]"
                >
                  Aug 2025 <CalendarOutlined />
                </span>
              </div>
              <Pie
                {...memberShipPlansConfif}
                className="h-[320px] w-full"
              />
            </div>

            {/* Right: Bar Chart */}
            <div
              className="w-full bg-white h-[437px] rounded-[8px] p-[24px] flex flex-col"
            >
              <div
                className="flex justify-between items-center mb-[18px] flex-wrap gap-[10px]"
              >
                <p className="text-[18px] font-semibold text-[#1B1B1B]">
                  Chat section{" "}
                </p>
                <div className="flex gap-[10px]">
                  <PrimaryBtn
                    icon={<MessageOutlined />}
                    name="chats"
                    onClick={() => navigate("/messages")}
                  />
                  <span
                    onClick={() => {}}
                    className="bg-white rounded-[6px] py-[6px] px-[14px] text-[14px] font-medium text-[#1F2329] cursor-pointer border-[1px] border-solid border-[#0000001F]"
                  >
                    Aug 2025 <CalendarOutlined />
                  </span>
                </div>
              </div>
              <div
                className="flex-1 flex overflow-hidden gap-[20px] p-[20px]"
              >
                {/* LEFT PANEL */}
                <div
                  className="w-full rounded-[12px] bg-white overflow-y-auto overflow-x-hidden min-w-0"
                >
                  {/* USER LIST */}
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`p-[10px] border-b-[1px] border-solid border-[#f0f0f0] cursor-pointer flex items-center relative ${selectedUser?.id === user.id ? "bg-[#f3f3f3]" : "bg-white"}`}
                    >
                      {/* <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-[40px] h-[40px] rounded-[8px] mr-[10px]"
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: user.online ? "#4CAF50" : "#ccc",
                    marginLeft: 6,
                  }}
                /> */}
                      <div
                        className="relative inline-block"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-[40px] h-[40px] rounded-[8px] block"
                        />
                        <span
                          className={`absolute top-[2px] -right-[4px] w-[8px] h-[8px] rounded-full border-[3px] border-solid border-white ${user.online ? "bg-[#F0C330]" : "bg-[#C4CAE8]"}`}
                        />
                      </div>

                      <div className="flex-1 ml-[8px]">
                        <div
                          className="text-[16px] font-medium flex items-center text-[#45464E]"
                        >
                          {user.name}
                        </div>
                        <div
                          className="text-[14px] font-normal text-[#8B8D97]"
                        >
                          {user.message}
                        </div>
                      </div>
                      <div
                        className="text-right"
                      >
                        <div
                          className="flex gap-[10px] absolute right-[5px] top-[5px]"
                        >
                          {user.isNew && (
                            <div
                              className="text-[12px] font-normal text-[#007F5F] mt-[4px] bg-[#007F5F1F] flex items-center justify-center rounded-[8px] p-[3px]"
                            >
                              New
                            </div>
                          )}
                          {user.unread > 0 && (
                            <div
                              className="mt-[4px] bg-[#004E89] text-[#fff] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center"
                            >
                              {user.unread}
                            </div>
                          )}
                        </div>
                        <div
                          className="text-[12px] font-normal text-[#8B8D97] absolute bottom-[5px] right-[5px]"
                        >
                          {user.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* appointment list */}
          <div
            className="bg-white rounded-[16px] p-[24px] w-full shadow-[0_2px_8px_rgba(0,0,0,0.05)] m-[20px]"
          >
            {/* Header */}
            <div
              className="flex justify-between items-center mb-[18px] flex-wrap gap-[10px]"
            >
              <p className="text-[18px] font-semibold text-[#1B1B1B]">
                Recent Conversations Table
              </p>
              <div className="flex gap-[10px]">
                <PrimaryBtn
                  icon={<MessageOutlined />}
                  name="Chats"
                  onClick={() => navigate("/messages")}
                />
                <SecondaryBtn icon={<FilterOutlined />} name="Filter" />
              </div>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={conversationData}
              pagination={{ current: 2, pageSize: 10, total: 120 }}
              scroll={{ x: true }}
              bordered
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
