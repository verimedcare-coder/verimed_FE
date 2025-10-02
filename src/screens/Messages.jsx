import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";
import Primarybtn from "../components/PrimaryBtn";
import newMessage from "../assets/icons/new-message.svg";
import { Modal } from "antd";

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
export default function Messages() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🆕 for modal
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
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

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
              width: "35%",
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
                <div style={{ position: "relative", display: "inline-block" }}>
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
                      backgroundColor: user.online ? "#F0C330" : "#C4CAE8",
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
                    style={{ fontSize: 14, fontWeight: 400, color: "#8B8D97" }}
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

          {/* RIGHT PANEL */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div
                  style={{
                    padding: 15,
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#45464E",
                        margin: 0,
                      }}
                    >
                      {selectedUser.name}
                    </p>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: selectedUser.online ? "#27AE60" : "#8B8D97",
                      }}
                    >
                      {selectedUser.online ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "#1C1D22",
                      }}
                    >
                      12 August 2022
                    </p>
                  </div>
                  {messages[selectedUser.id]?.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: 10,
                        textAlign: msg.sender === "me" ? "right" : "left",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          padding: "10px 15px",
                          borderRadius: 10,
                          backgroundColor:
                            msg.sender === "me" ? "#004E89" : "#007F5F",
                          color: msg.sender === "me" ? "#fff" : "#fff",
                          maxWidth: "70%",
                        }}
                      >
                        {msg.text}
                      </div>
                      <div
                        style={{ fontSize: 10, color: "#999", marginTop: 2 }}
                      >
                        {msg.time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div
                  style={{
                    padding: 15,
                    borderTop: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Your message"
                    style={{
                      flex: 1,
                      padding: "10px 15px",
                      borderRadius: 20,
                      border: "1px solid #ccc",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleSend}
                    style={{
                      marginLeft: 10,
                      backgroundColor: "#D4AF37",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 20,
                      cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              // No contact selected
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#999",
                }}
              >
                <div style={{ fontSize: 48 }}>
                  <img src={newMessage} />
                </div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#000000",
                    margin: 0,
                  }}
                >
                  Messages
                </h2>
                <p style={{ fontSize: 14, fontWeight: 400, color: "#8B8D97" }}>
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
      </div>
      <Modal
        title="New Message"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <p style={{ fontSize: 16, fontWeight: 500, color: "#8B8D97" }}>
          Search a Customer to start a conversation
        </p>
        <input
          placeholder="Search customer name"
          value={newSearchTerm}
          onChange={(e) => setNewSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: 5,
            marginBottom: 10,
          }}
        />
        {filteredNewMessageUsers.length > 0 ? (
          filteredNewMessageUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleStartNewConversation(user)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 0",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              />
              <div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: "#8B8D97" }}>
                  No conversation yet
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#8B8D97" }}>No new users</p>
        )}
      </Modal>
    </div>
  );
}
