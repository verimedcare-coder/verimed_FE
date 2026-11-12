/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentsService } from "../../services/departmentsService";
import Header from "../../components/layout/Header";
import Sider from "../../components/layout/Sider";
import SecondaryBtn from "../../components/common/SecondaryBtn";
import PrimaryBtn from "../../components/common/PrimaryBtn";

import {
  Button,
  Table,
  Drawer,
  Input,
  Select,
  Avatar,
  Form,
  DatePicker,
  message,
  Upload,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { base_url, resolveMediaUrl, stripDialCode } from "../../constants/constants";
import {
  CalendarOutlined,
  FilterOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Option } = Select;
const { TextArea } = Input;

function SectionHeader({ title, children }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-[10px] min-w-0">
      <p className="text-[16px] font-semibold text-[#1B1B1B]">{title}</p>
      <div className="flex gap-[10px] flex-wrap">{children}</div>
    </div>
  );
}

const deptStats = [
  {
    id: 1,
    name: "Total Departments",
    count: 23,
    diff: "+95%",
    duration: "in last 7 Days",
  },
  {
    id: 2,
    name: "Total Doctors",
    count: 20,
    diff: "+95%",
    duration: "in last 7 Days",
  },
  {
    id: 3,
    name: "Care Takers",
    count: 24,
    diff: "+25%",
    duration: "in last 7 Days",
  },
  {
    id: 4,
    name: "Patients",
    count: 6,
    diff: "+15%",
    duration: "in last 7 Days",
  },
  {
    id: 5,
    name: "Revenue Contribution",
    count: 6,
    diff: "+15%",
    duration: "in last 7 Days",
  },
];

const assignedDoctors = [
  {
    id: 1,
    name: "Dr. Alice Brown",
    role: "Physician",
    patients: 20,
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 2,
    name: "Dr. John Deo",
    role: "Surgeon",
    patients: 15,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    role: "Cardiologist",
    patients: 10,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const departmentData = [
  {
    departmentId: "001",
    departmentName: "Internal Medicine",
    headDoctor: "Dr. Paul Ekom",
    type: "Clinical",
    totalDoctors: 10,
    patientsAssigned: 145,
    status: "Active",
  },
  {
    departmentId: "002",
    departmentName: "Cardiology",
    headDoctor: "Dr. Kom",
    type: "Clinical",
    totalDoctors: 9,
    patientsAssigned: 15,
    status: "Active",
  },
  {
    departmentId: "003",
    departmentName: "Neurology",
    headDoctor: "Dr. John",
    type: "Clinical",
    totalDoctors: 5,
    patientsAssigned: 15,
    status: "Inactive",
  },
];

// ---------- Status Badge ----------
const getStatusTag = (status) => (
  <span
    className={`py-[4px] px-[12px] rounded-[12px] font-medium text-[12px] ${status === "Active" ? "text-[#007F5F] bg-[#E6F4EA]" : "text-[#B00020] bg-[#FDEAEA]"}`}
  >
    {status}
  </span>
);

// ---------- Departments Component ----------
export default function Departments() {
  const queryClient = useQueryClient();
  const [selectedDept, setSelectedDept] = useState(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [logoFile, setLogoFile] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const { data: departmentList = [], isLoading: tableLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const data = await departmentsService.getDepartments();
      if (!Array.isArray(data)) return [];

      return data.map((item) => {
        return {
          ...item,
          hospital_name: item.dep_ID,
          hospital_address: item.address,
          hospital_phone: stripDialCode(item.contact_phone),
          dep_email: item.contact_email,
          dep_exprience: item.description,
          dep_category: item.dep_type,
        };
      });
    },
    enabled: !!token,
  });

  const filteredDepartmentList = departmentList.filter((dept) => {
    const matchesSearch = searchText
      ? dept.dep_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        dept.hospital_name?.toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesCategory =
      selectedCategory !== "All"
        ? dept.dep_category === selectedCategory
        : true;
    return matchesSearch && matchesCategory;
  });

  const handleCreateDepartment = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const cleanPhone = stripDialCode(values.hospital_phone);
      const deptData = {
        dep_name: values.dep_name,
        dep_ID: values.hospital_name,
        address: values.hospital_address || "",
        contact_phone: cleanPhone || "",
        ...(cleanPhone ? { country_code: values.country_code || "CM" } : {}),
        contact_email: values.dep_email || "",
        description: values.dep_exprience || "",
        dep_type: values.dep_category || "",
        status: values.status || "Active",
      };
      formData.append("verimed_department", JSON.stringify(deptData));
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await axios.post(
        `${base_url}/verimed_department_create_update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      message.success("Department created successfully!");
      setAddDrawerOpen(false);
      addForm.resetFields();
      setLogoFile(null);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to create department",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDepartment = async (values) => {
    if (!selectedDept) return;
    setLoading(true);
    try {
      const formData = new FormData();
      const cleanPhone = stripDialCode(values.hospital_phone);
      const resolvedCountryCode =
        values.country_code ||
        selectedDept.country_code ||
        (cleanPhone ? "CM" : null);
      const deptData = {
        depupdateid: selectedDept.id,
        dep_name: values.dep_name,
        dep_ID: values.hospital_name,
        address: values.hospital_address ?? selectedDept.address ?? null,
        contact_phone: cleanPhone || null,
        country_code: resolvedCountryCode,
        contact_email: values.dep_email ?? selectedDept.contact_email ?? null,
        description: values.dep_exprience ?? selectedDept.description ?? null,
        dep_type: values.dep_category ?? selectedDept.dep_type ?? null,
        status: values.status ?? selectedDept.status ?? "Active",
        docid: selectedDept.doctor || selectedDept.docid || null,
        dep_city: selectedDept.dep_city ?? null,
        dep_state: selectedDept.dep_state ?? null,
        dep_country: selectedDept.dep_country ?? null,
        dep_pincode: selectedDept.dep_pincode ?? null,
      };
      formData.append("verimed_department", JSON.stringify(deptData));
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await axios.patch(
        `${base_url}/verimed_department_create_update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      message.success("Department updated successfully!");
      setViewDrawerOpen(false);
      editForm.resetFields();
      setLogoFile(null);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to update department",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed`);
    }
    if (info.file.originFileObj) {
      setLogoFile(info.file.originFileObj);
    }
  };

  const columns = [
    {
      title: "Logo",
      key: "logo",
      width: 80,
      render: (_, record) => (
        <Avatar
          src={resolveMediaUrl(
            record.logo,
            `https://ui-avatars.com/api/?name=${record.dep_name || "D"}`,
          )}
          className="object-cover"
        />
      ),
    },
    {
      title: "Department Name",
      dataIndex: "dep_name",
      key: "dep_name",
      width: 200,
    },
    {
      title: "Hospital Name",
      dataIndex: "hospital_name",
      key: "hospital_name",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "dep_email",
      key: "dep_email",
      width: 180,
    },
    {
      title: "Phone",
      dataIndex: "hospital_phone",
      key: "hospital_phone",
      width: 130,
    },
    {
      title: "Category",
      dataIndex: "dep_category",
      key: "dep_category",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text) => getStatusTag(text || "Active"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDept(record);
            editForm.setFieldsValue(record);
            setViewDrawerOpen(true);
          }}
          className="cursor-pointer text-[#007F5F] text-[18px]"
        >
          <MoreOutlined />
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      {/* Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <div className="p-[20px] overflow-y-auto overflow-x-hidden gap-[20px] flex flex-col flex-1">
          {/* Stats Section */}
          <div className="flex items-center justify-between gap-[12px] w-full">
            {deptStats.map((stat, idx) => (
              <div
                key={stat.id}
                className="min-w-[160px] flex-none bg-white rounded-[8px] p-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between"
              >
                {/* ...card content... */}
                <div className="flex items-center justify-start gap-[10px]">
                  <div className="h-[30px] w-[30px] rounded-[100px] flex items-center justify-center bg-[#007F5F33]">
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
                  <p className="text-[#6C7688] text-[14px] font-medium">
                    {stat.name}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[#2E2E2E] text-[18px] font-extrabold">
                    {stat.count}
                  </p>
                  <div className="flex flex-col items-end justify-center w-full">
                    <div className="bg-[#27AE60] h-[20px] w-[49px] flex items-center justify-center rounded-[6px]">
                      <p className="text-[white] text-[12px] font-medium">
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

          {/* Table */}
          <div className="bg-white rounded-[12px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] ">
            <SectionHeader title="Department List">
              <div className="flex items-center gap-[12px]">
                <Input.Search
                  placeholder="Search departments..."
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                  className="rounded-[12px]"
                />
                <Select
                  defaultValue="All"
                  style={{ width: 150 }}
                  onChange={(value) => setSelectedCategory(value)}
                  className="rounded-[12px]"
                >
                  <Option value="All">All Categories</Option>
                  <Option value="General">General</Option>
                  <Option value="Specialty">Specialty</Option>
                  <Option value="Emergency">Emergency</Option>
                  <Option value="Diagnostic">Diagnostic</Option>
                </Select>
                <PrimaryBtn
                  icon={<PlusOutlined />}
                  name="New Department"
                  onClick={() => setAddDrawerOpen(true)}
                />
              </div>
            </SectionHeader>

            <Table
              columns={columns}
              dataSource={filteredDepartmentList}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              bordered
              className="w-full"
              loading={tableLoading || loading}
            />
          </div>
        </div>
      </div>

      {/* ---------- Add Department Drawer ---------- */}
      <Drawer
        title="Add Department"
        width={720}
        onClose={() => {
          setAddDrawerOpen(false);
          addForm.resetFields();
          setLogoFile(null);
        }}
        open={addDrawerOpen}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical" onFinish={handleCreateDepartment}>
          {/* Two-Column Grid Layout */}
          <div className="grid grid-cols-[1fr_1fr] gap-[16px] mt-[16px]">
            <Form.Item
              name="dep_name"
              label="Department Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter department name" />
            </Form.Item>

            <Form.Item
              name="hospital_name"
              label="Hospital Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter hospital name" />
            </Form.Item>

            <Form.Item name="hospital_address" label="Hospital Address">
              <Input placeholder="Enter hospital address" />
            </Form.Item>

            <Form.Item name="hospital_phone" label="Hospital Phone">
              <Input placeholder="Enter hospital phone" />
            </Form.Item>

            <Form.Item name="dep_email" label="Department Email">
              <Input placeholder="Enter department email" />
            </Form.Item>

            <Form.Item name="dep_category" label="Department Category">
              <Select placeholder="Select category">
                <Option value="General">General</Option>
                <Option value="Specialty">Specialty</Option>
                <Option value="Emergency">Emergency</Option>
                <Option value="Diagnostic">Diagnostic</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dep_exprience"
              label="Department Experience"
              className="col-span-2"
            >
              <Input placeholder="Enter department experience" />
            </Form.Item>

            {/* Logo Upload */}
            <Form.Item label="Department Logo" className="col-span-2">
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleLogoChange}
              >
                <Button icon={<UploadOutlined />}>Click to Upload Logo</Button>
              </Upload>
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <Form.Item className="mb-[0px]">
            <div className="flex justify-end gap-[12px]">
              <Button
                onClick={() => setAddDrawerOpen(false)}
                className="h-[40px] border-[1px] border-solid border-[#ccc] bg-white"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="h-[40px] bg-[#F0C330] text-[#000] font-medium border-solid border-[#B78520]"
              >
                Create Department
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>

      {/* ---------- View/Edit Department Drawer ---------- */}
      <Drawer
        title="Department Details"
        width={600}
        onClose={() => {
          setViewDrawerOpen(false);
          editForm.resetFields();
          setLogoFile(null);
        }}
        open={viewDrawerOpen}
        destroyOnClose
      >
        {selectedDept && (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateDepartment}
          >
            <div className="flex flex-col gap-[16px]">
              {/* Department Logo */}
              <div className="flex items-center gap-[16px]">
                <p className="text-[14px] font-medium mb-[4px] block text-[#2E2E2E]">
                  Department Logo
                </p>
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={handleLogoChange}
                  showUploadList={false}
                >
                  <Avatar
                    size={72}
                    src={resolveMediaUrl(
                      selectedDept.logo,
                      `https://ui-avatars.com/api/?name=${selectedDept.dep_name}`,
                    )}
                    className="rounded-full cursor-pointer object-cover"
                  />
                </Upload>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
                <Form.Item name="dep_ID" label="Department ID">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="dep_name" label="Department Name">
                  <Input />
                </Form.Item>
                <Form.Item name="hospital_name" label="Hospital Name">
                  <Input />
                </Form.Item>
                <Form.Item name="hospital_phone" label="Hospital Phone">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="dep_email"
                  label="Department Email"
                  className="col-span-2"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="hospital_address"
                  label="Hospital Address"
                  className="col-span-2"
                >
                  <Input />
                </Form.Item>
                <Form.Item name="dep_category" label="Department Category">
                  <Select>
                    <Option value="General">General</Option>
                    <Option value="Specialty">Specialty</Option>
                    <Option value="Emergency">Emergency</Option>
                    <Option value="Diagnostic">Diagnostic</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="dep_exprience" label="Department Experience">
                  <Input />
                </Form.Item>
              </div>

              {/* Logo Upload */}
              <Form.Item label="Update Logo">
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={handleLogoChange}
                >
                  <Button icon={<UploadOutlined />}>
                    Click to Upload New Logo
                  </Button>
                </Upload>
              </Form.Item>
            </div>

            {/* Action Buttons */}
            <Form.Item className="mb-[0px] mt-[24px]">
              <div className="flex justify-end gap-[12px]">
                <Button
                  onClick={() => setViewDrawerOpen(false)}
                  className="h-[40px] border-[1px] border-solid border-[#ccc] bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-[40px] bg-[#F0C330] text-[#000] font-medium border-solid border-[#B78520]"
                >
                  Update Department
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
}
