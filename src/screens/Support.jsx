import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";
import {
  CalendarOutlined,
  EllipsisOutlined,
  FilterOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";
import Primarybtn from "../components/PrimaryBtn";
import newMessage from "../assets/icons/new-message.svg";
import { Button, Table, Tag } from "antd";

function SectionHeader({ title, children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        minWidth: 0,
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 600, color: "#1B1B1B" }}>{title}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
        style={{
          borderRadius: 20,
          fontWeight: 500,
          padding: "2px 12px",
        }}
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
      style={{ display: "flex", height: "100vh", backgroundColor: "#F7F9FB" }}
    >
      {/* Sidebar */}
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

        {/* Content area with just text */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            overflowX: "hidden",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* stats */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              width: "100%",
            }}
          >
            {docStats.map((stat, idx) => (
              <div
                key={stat.id}
                style={{
                  minWidth: 160,
                  // maxWidth: 200,
                  flex: "0 0 auto",
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* ...card content... */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#007F5F33",
                    }}
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
                    style={{
                      color: "#6C7688",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {stat.name}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      color: "#2E2E2E",
                      fontSize: 18,
                      fontWeight: "800",
                    }}
                  >
                    {stat.count}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#27AE60",
                        height: 20,
                        width: 49,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 6,
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {stat.diff}
                      </p>
                    </div>
                    <p style={{ color: "#6C7688", fontSize: 13 }}>
                      {stat.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* charts */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 20,
            }}
          >
            {/* Left: Pie Chart */}
            <div
              style={{
                width: "50%",
                backgroundColor: "white",
                height: 437,
                borderRadius: 8,
                padding: 24,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 18, color: "#1B1B1B" }}>
                  Messages
                </p>
                <span
                  onClick={() => {}}
                  style={{
                    background: "#fff",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1F2329",
                    cursor: "pointer",
                    border: "1px solid #0000001F",
                  }}
                >
                  Aug 2025 <CalendarOutlined />
                </span>
              </div>
              <Pie
                {...memberShipPlansConfif}
                style={{ height: 320, width: "100%" }}
              />
            </div>

            {/* Right: Bar Chart */}
            <div
              style={{
                width: "100%",
                backgroundColor: "white",
                height: 437,
                borderRadius: 8,
                padding: 24,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  overflow: "hidden",
                  gap: 20,
                  padding: 20,
                }}
              >
                {/* LEFT PANEL */}
                <div
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    backgroundColor: "#fff",
                    overflowY: "auto",
                    overflowX: "hidden",
                    minWidth: 0,
                  }}
                >
                  <div style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                    <div style={{ position: "relative" }}>
                      <SearchOutlined
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          color: "#999",
                        }}
                      />

                      <input
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 8px 8px 30px",
                          border: "1px solid #ccc",
                          borderRadius: 5,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  {/* USER LIST */}
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      style={{
                        padding: 10,
                        borderBottom: "1px solid #f0f0f0",
                        backgroundColor:
                          selectedUser?.id === user.id ? "#f3f3f3" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {/* <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    marginRight: 10,
                  }}
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
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            display: "block",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            right: -4,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: user.online
                              ? "#F0C330"
                              : "#C4CAE8",
                            border: "3px solid white", // optional: adds a white border for contrast
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, marginLeft: 8 }}>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            color: "#45464E",
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "#8B8D97",
                          }}
                        >
                          {user.message}
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            position: "absolute",
                            right: 5,
                            top: 5,
                          }}
                        >
                          {user.isNew && (
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 400,
                                color: "#007F5F",
                                marginTop: 4,
                                background: "#007F5F1F",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 8,
                                padding: 3,
                              }}
                            >
                              New
                            </div>
                          )}
                          {user.unread > 0 && (
                            <div
                              style={{
                                marginTop: 4,
                                backgroundColor: "#004E89",
                                color: "#fff",
                                borderRadius: "50%",
                                width: 20,
                                height: 20,
                                fontSize: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {user.unread}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 400,
                            color: "#8B8D97",
                            position: "absolute",
                            bottom: 5,
                            right: 5,
                          }}
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
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              margin: 20,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <p style={{ fontSize: 18, fontWeight: 600, color: "#1B1B1B" }}>
                Recent Conversations Table
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <PrimaryBtn icon={<MessageOutlined />} name="Chats" />
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
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
