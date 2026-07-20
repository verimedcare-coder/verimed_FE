import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import { Table, Button, Tag, Space, Typography, Card, Input } from "antd";
import { CheckOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ReportsToReview() {
  const [reports, setReports] = useState([
    {
      id: "REP-001",
      patientName: "John Doe",
      date: "2023-10-27",
      type: "Blood Test",
      status: "Pending",
    },
    {
      id: "REP-002",
      patientName: "Jane Smith",
      date: "2023-10-28",
      type: "MRI Scan",
      status: "Pending",
    },
    {
      id: "REP-003",
      patientName: "Robert Johnson",
      date: "2023-10-29",
      type: "X-Ray",
      status: "Pending",
    },
  ]);

  const [searchText, setSearchText] = useState("");

  const handleApprove = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const handleReject = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const columns = [
    {
      title: "Report ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color="orange">{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<CheckOutlined />} 
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => handleApprove(record.id)}
          >
            Approve
          </Button>
          <Button 
            type="primary" 
            danger 
            icon={<CloseOutlined />}
            onClick={() => handleReject(record.id)}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const filteredReports = reports.filter(r => 
    r.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
    r.id.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F7F9FB] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0">
          <Header />
        </div>

        {/* Content area */}
        <div className="flex-1 p-[24px] overflow-auto">
          <Card className="shadow-sm rounded-lg" bordered={false}>
            <div className="flex justify-between items-center mb-6">
              <Title level={4} className="!mb-0">Reports to Review</Title>
              <Input
                placeholder="Search patient or ID..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-64 rounded-md"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            
            <Table 
              columns={columns} 
              dataSource={filteredReports} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
              className="overflow-x-auto"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
