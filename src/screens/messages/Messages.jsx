import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";
import Primarybtn from "../../components/common/PrimaryBtn";
import newMessage from "../../assets/icons/new-message.svg";
import { Modal, Tabs } from "antd";
import { isAdminUser } from "../../constants/constants";

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
};

const userGroups = {
  sponsors: [
    {
      id: 1,
      name: "Jane Doe",
      message: "Hi, I want make enquiries about your...",
      time: "12:55 am",
      unread: 2,
      isNew: true,
      online: true,
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  ],
  patients: [
    {
      id: 2,
      name: "Janet Adebayo",
      message: "Need to reschedule appointment.",
      time: "1:10 am",
      unread: 1,
      isNew: true,
      online: false,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ],
  caretakers: [
    {
      id: 3,
      name: "Nurse Lucy",
      message: "Vitals updated successfully.",
      time: "11:25 am",
      unread: 0,
      isNew: false,
      online: true,
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
  ],
  doctors: [
    {
      id: 4,
      name: "Dr. Ama Ngu",
      message: "Appointment Follow-up",
      time: "10:45 am",
      unread: 0,
      isNew: false,
      online: true,
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ],
};

export default function Messages() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🆕 for modal
  const [newSearchTerm, setNewSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sponsors");
  const activeUsers = userGroups[activeTab];

  // userdata type check
  const data = localStorage.getItem("userData");
  const user = data ? JSON.parse(data) : null;
  if (!user) {
    window.location.href = "/";
  }
  // treat the special id 100 as admin as well
  const isAdmin = isAdminUser(user);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
      u.id === user.id ? { ...u, unread: 0, isNew: false } : u,
    );
    setUsers(updatedUsers);
  };

  const newMessageUsers = users.filter(
    (user) => !messages[user.id] || messages[user.id].length === 0,
  );

  const filteredNewMessageUsers = newMessageUsers.filter((user) =>
    user.name.toLowerCase().includes(newSearchTerm.toLowerCase()),
  );

  const handleStartNewConversation = (user) => {
    handleSelectUser(user);
    setIsModalOpen(false);
  };

  return (
    <div
      className="flex h-screen bg-[#F7F9FB]"
    >
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        {(user?.user_role === "doctor" ||
          user?.user_role === "sponsor" ||
          user?.user_role === "care_taker") && (
          <div
            className="flex-1 flex overflow-hidden gap-[20px] p-[20px]"
          >
            {/* LEFT PANEL */}
            <div
              className="w-[35%] rounded-[12px] bg-white overflow-y-auto overflow-x-hidden min-w-0"
            >
              <div className="p-[10px] border-b-[1px] border-solid border-[#eee]">
                <div className="relative">
                  <SearchOutlined
                    className="absolute text-[#999] top-[10px] left-[10px]"
                  />

                  <input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-[8px_8px_8px_30px] border-[1px] border-solid border-[#ccc] rounded-[5px] box-border"
                  />
                </div>
              </div>

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

            {/* RIGHT PANEL */}
            <div
              className="flex-1 bg-white rounded-[12px] overflow-hidden flex flex-col"
            >
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div
                    className="p-[15px] flex items-center gap-[10px] border-b-[1px] border-solid border-[#eee]"
                  >
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-[40px] h-[40px] rounded-[8px]"
                    />
                    <div>
                      <p
                        className="text-[16px] font-medium text-[#45464E] m-0"
                      >
                        {selectedUser.name}
                      </p>
                      <div
                        className={`text-[14px] font-medium ${selectedUser.online ? "text-[#27AE60]" : "text-[#8B8D97]"}`}
                      >
                        {selectedUser.online ? "Online" : "Offline"}
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 p-[20px] overflow-y-auto">
                    <div
                      className="text-center"
                    >
                      <p
                        className="text-[12px] font-normal text-[#1C1D22]"
                      >
                        12 August 2022
                      </p>
                    </div>
                    {messages[selectedUser.id]?.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-[10px] ${msg.sender === "me" ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`inline-block py-[10px] px-[15px] rounded-[10px] max-w-[70%] text-white ${msg.sender === "me" ? "bg-[#004E89]" : "bg-[#007F5F]"}`}
                        >
                          {msg.text}
                        </div>
                        <div
                          className="text-[10px] text-[#999] mt-[2px]"
                        >
                          {msg.time}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div
                    className="p-[15px] flex items-center border-t-[1px] border-solid border-[#eee]"
                  >
                    <input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Your message"
                      className="flex-1 py-[10px] px-[15px] rounded-[20px] border-[1px] border-solid border-[#ccc] outline-none"
                    />
                    <button
                      onClick={handleSend}
                      className="ml-[10px] bg-[#D4AF37] text-[#fff] border-none py-[10px] px-[20px] rounded-[20px] cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                // No contact selected
                <div
                  className="flex-1 flex justify-center items-center flex-col text-[#999]"
                >
                  <div className="text-[48px]">
                    <img src={newMessage} />
                  </div>
                  <h2
                    className="text-[20px] font-medium text-[#000000] m-0"
                  >
                    Messages
                  </h2>
                  <p
                    className="text-[14px] font-normal text-[#8B8D97]"
                  >
                    Click on a contact to view messages.
                  </p>
                  <Primarybtn
                    name="New Appointment"
                    icon={<MessageOutlined />}
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {isAdmin && (
          <>
            <div
              className="flex-1 flex flex-col p-[20px] overflow-hidden"
            >
              {/* 🔹 Tabs for Roles */}
              <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                  setActiveTab(key);
                  setSelectedUser(null);
                }}
                items={[
                  { key: "sponsors", label: "Sponsors" },
                  { key: "patients", label: "Patients" },
                  { key: "caretakers", label: "Care Takers" },
                  { key: "doctors", label: "Doctors" },
                ]}
                tabBarStyle={{
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              />

              {/* 🔹 Main Message Layout */}
              <div
                className="flex-1 flex gap-[20px] overflow-hidden"
              >
                {/* LEFT PANEL */}
                <div
                  className="w-[35%] bg-white rounded-[12px] overflow-y-auto border-[1px] border-solid border-[#eee]"
                >
                  {activeUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`flex items-center py-[10px] px-[12px] border-b-[1px] border-solid border-[#f5f5f5] cursor-pointer ${selectedUser?.id === user.id ? "bg-[#f5f5f5]" : "bg-white"}`}
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-[40px] h-[40px] rounded-[8px] object-cover"
                        />
                        <span
                          className={`absolute top-[2px] -right-[4px] w-[8px] h-[8px] rounded-full border-[3px] border-solid border-white ${user.online ? "bg-[#F0C330]" : "bg-[#C4CAE8]"}`}
                        />
                      </div>

                      <div className="ml-[10px] flex-1">
                        <p className="m-0 font-medium">
                          {user.name}
                        </p>
                        <p
                          className="m-0 text-[13px] text-[#8B8D97] whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {user.message}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className="text-[12px] text-[#8B8D97] mb-[4px]"
                        >
                          {user.time}
                        </p>
                        {user.isNew && (
                          <div
                            className="bg-[#007F5F1F] text-[#007F5F] rounded-[8px] py-[2px] px-[6px] text-[12px]"
                          >
                            New
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* RIGHT PANEL */}
                <div
                  className="flex-1 bg-white rounded-[12px] flex flex-col items-center justify-center border-[1px] border-solid border-[#eee]"
                >
                  {selectedUser ? (
                    <div className="text-center">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-[80px] h-[80px] rounded-full mb-[12px]"
                      />
                      <h3 className="mb-[4px]">{selectedUser.name}</h3>
                      <p className="text-[#8B8D97]">{selectedUser.message}</p>
                    </div>
                  ) : (
                    <div
                      className="flex-1 flex justify-center items-center flex-col text-[#999]"
                    >
                      <img src={newMessage} alt="New Message" width={60} />
                      <h2
                        className="mt-[10px] font-semibold text-[#000]"
                      >
                        Messages
                      </h2>
                      <p className="text-[#8B8D97]">
                        Click on a contact to view messages.
                      </p>
                      <Primarybtn
                        icon={<MessageOutlined />}
                        name="New Message"
                        onClick={() => setIsModalOpen(true)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        title="New Message"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <p className="text-[16px] font-medium text-[#8B8D97]">
          Search a Customer to start a conversation
        </p>
        <input
          placeholder="Search customer name"
          value={newSearchTerm}
          onChange={(e) => setNewSearchTerm(e.target.value)}
          className="w-full py-[8px] px-[12px] border-[1px] border-solid border-[#ccc] rounded-[5px] mb-[10px]"
        />
        {filteredNewMessageUsers.length > 0 ? (
          filteredNewMessageUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleStartNewConversation(user)}
              className="flex items-center py-[8px] px-[0px] cursor-pointer border-b-[1px] border-solid border-[#f0f0f0]"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-[40px] h-[40px] rounded-[8px] mr-[10px]"
              />
              <div>
                <div className="text-[16px] font-medium">{user.name}</div>
                <div className="text-[12px] text-[#8B8D97]">
                  No conversation yet
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#8B8D97]">No new users</p>
        )}
      </Modal>
    </div>
  );
}
