import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import SecondaryBtn from "../components/SecondaryBtn";
import PrimaryBtn from "../components/PrimaryBtn";
import {
  Tabs,
  Table,
  Input,
  Button,
  Tag,
  Space,
  Drawer,
  Avatar,
  Form,
  DatePicker,
  Upload,
  Spin,
  Modal,
  Checkbox,
  notification,
  Divider,
} from "antd";
import {
  EllipsisOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Primarybtn from "../components/PrimaryBtn";
import { Select } from "antd";
import bloodPressure from "../assets/icons/blood-pressure.svg";
import heartRate from "../assets/icons/heart-rate.svg";
import oxygen from "../assets/icons/oxygen.svg";
import respiratory from "../assets/icons/respiratory.svg";
import statusIcon from "../assets/icons/status.svg";
import sugar from "../assets/icons/sugar.svg";
import weight from "../assets/icons/weight.svg";
import temperature from "../assets/icons/temperature.png";
import dayjs from "dayjs";
import { base_url } from "../constants/constants";

const { Option } = Select;

const linkedPatients = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    name: "Mr. Samuel N. (VM–976–324)",
    doctor: "Dr. Paul M.",
    caretaker: "Nurse Clarisse A.",
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Ms. Grace N. (VM–845–123)",
    doctor: "Dr. Linda S.",
    caretaker: "Nurse Alex P.",
  },
];
const linkedSponsor = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    name: "Name",
    phone: "+1 416 222 1000",
    email: "john.n@verimed.com",
  },
];

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("sponsors");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [addDrawerVisible, setAddDrawerVisible] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [docList, setDocList] = useState([]);
  const [sponsorList, setSponsorList] = useState([]);
  const [caretakerList, setCaretakerList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const userListEndpoint = `${base_url}/user_view/`;
      const headers = {
        Authorization: "Token 7d406eecd7d9be342a7dbad264a73c5ac761f19a",
      };
      const userRes = await axios.get(userListEndpoint, { headers });
      const allusers = userRes.data;

      const sponsorListEndpoint = `${base_url}/sponsorprofile_list/`;
      const res = await axios.get(sponsorListEndpoint, { headers });
      const sponsors = res.data;

      const sponsorUserIds = sponsors.map((doc) => doc.user);

      const filteredAllusers = allusers.filter((user) =>
        sponsorUserIds.includes(user.id)
      );

      const combinedSponsors = filteredAllusers.map((user) => {
        const sponsorProfile = sponsors.find((doc) => doc.user === user.id);
        return {
          ...user,
          sponsorProfile,
        };
      });

      console.log("Sponsors API:", res.data);

      setSponsorList(combinedSponsors);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareTakers = async () => {
    setLoading(true);
    try {
      const userListEndpoint = `${base_url}/user_view/`;
      const headers = {
        Authorization: "Token 7d406eecd7d9be342a7dbad264a73c5ac761f19a",
      };
      const userRes = await axios.get(userListEndpoint, { headers });
      const allusers = userRes.data;

      const caretakerListEndpoint = `${base_url}/caretakerprofile_list/`;
      const res = await axios.get(caretakerListEndpoint);
      const caretakers = res.data;

      const caretakersUserIds = caretakers.map((doc) => doc.user);

      const filteredAllusers = allusers.filter((user) =>
        caretakersUserIds.includes(user.id)
      );

      const combinedCaretakers = filteredAllusers.map((user) => {
        const caretakerProfile = caretakers.find((doc) => doc.user === user.id);
        return {
          ...user,
          caretakerProfile,
        };
      });

      setCaretakerList(combinedCaretakers);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const userListEndpoint = `${base_url}/user_view/`;
      const headers = {
        Authorization: "Token 7d406eecd7d9be342a7dbad264a73c5ac761f19a",
      };
      const userRes = await axios.get(userListEndpoint, { headers });
      const allusers = userRes.data;

      const patientListEndpoint = `${base_url}/patientprofile_list/`;
      const res = await axios.get(patientListEndpoint, { headers });
      const patients = res.data;

      const patientUserIds = patients.map((doc) => doc.user);

      const filteredAllusers = allusers.filter((user) =>
        patientUserIds.includes(user.id)
      );

      const combinedPatients = filteredAllusers.map((user) => {
        const patientProfile = patients.find((doc) => doc.user === user.id);
        return {
          ...user,
          patientProfile,
        };
      });

      setPatientList(combinedPatients);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const userListEndpoint = `${base_url}/user_view/`;
      const headers = {
        Authorization: "Token 7d406eecd7d9be342a7dbad264a73c5ac761f19a",
      };
      const userRes = await axios.get(userListEndpoint, { headers });
      const allusers = userRes.data;

      const docListEndpoint = `${base_url}/doctorprofile_list/`;
      const res = await axios.get(docListEndpoint, { headers });
      const doctors = res.data;

      const doctorUserIds = doctors.map((doc) => doc.user);

      const filteredAllusers = allusers.filter((user) =>
        doctorUserIds.includes(user.id)
      );

      const combinedDoctors = filteredAllusers.map((user) => {
        const doctorProfile = doctors.find((doc) => doc.user === user.id);
        return {
          ...user,
          doctorProfile,
        };
      });

      setDocList(combinedDoctors);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
    fetchCareTakers();
    fetchPatients();
    fetchDoctors();
  }, []);

  const dotStyle = (color) => ({
    width: "8px",
    height: "8px",
    background: color,
    borderRadius: "50%",
    flexShrink: 0,
  });
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  // const onFinish = (values) => {
  //   console.log("Sponsor Info Submitted:", values);
  //   form.resetFields();
  //   setOpen(false);
  // };

  const handleSubmit = async (values, activeTab) => {
    try {
      const roleMap = {
        sponsors: "sponsor",
        doctors: "doctor",
        caretakers: "care_taker",
        patients: "patient",
      };

      const user_signup = {
        first_name: values.first_name,
        last_name: values.last_name,
        role: roleMap[activeTab],
        email: values.email,
        countrycode: "IN",
        phone: values.phone,
        password: values.password,
      };

      const formData = new FormData();
      formData.append("user_signup", JSON.stringify(user_signup));
      if (values.photo) {
        formData.append("photo", values.photo);
      }

      const endpoint = `${base_url}/user_create/`;

      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Token 7d406eecd7d9be342a7dbad264a73c5ac761f19a",
        },
      });

      notification.success({
        message: `${roleMap[activeTab]} created successfully!`,
      });
      setAddDrawerVisible(false);
    } catch (error) {
      console.error("Signup error:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.detail || "Something went wrong.",
      });
    }
  };

  const handleUpdateClick = async () => {
    if (!editedData) return;

    console.log(`🧾 Submitting edited data for ${activeTab}:`, editedData);

    try {
      let endpoint = "";
      let formData = new FormData();
      let keyName = "";
      let updateData = {};

      switch (activeTab) {
        case "sponsors":
          endpoint = `${base_url}/sponsorprofile_update/`;
          keyName = "sponsorprofile_update_data";
          updateData = {
            spon_profile_updateid: selectedSponsor?.sponsorProfile?.id,
            sponsor_address: editedData.sponsor_address || "",
            sponsor_gender: editedData.sponsor_gender || "",
            work_employment: editedData.work_employment || "",
            how_found_us: editedData.how_found_us || "",
          };
          break;

        case "doctors":
          endpoint = `${base_url}/doctorprofile_update/`;
          keyName = "doctorprofile_update_data";
          updateData = {
            doctor_profile_updateid: selectedDoctor?.doctorProfile?.id,
            doctor_address: editedData.address || "",
            doctor_gender: editedData.gender || "",
            specialization: editedData.speciality || "",
            year_of_graduation: editedData.yr_graduation || "",
          };
          break;

        case "patients":
          endpoint = `${base_url}/patientprofile_update/`;
          keyName = "patientprofile_update_data";
          updateData = {
            patient_profile_updateid: selectedPatient?.patientProfile?.id,
            patient_address: editedData.address || "",
            patient_gender: editedData.gender || "",
            condition: editedData.condition || "",
          };
          break;

        case "caretakers":
          endpoint = `${base_url}/caretakerprofile_update/`;
          keyName = "caretakerprofile_update_data";
          updateData = {
            caretaker_profile_updateid:
              selectedCaretaker?.caretakerProfile?.id || "",
            caretaker_address: editedData.address || "",
            caretaker_exprience: editedData.experience || 0,
            care_gender: editedData.gender || "",
            credentials: editedData.credentials || "",
            yr_of_graduation: editedData.yr_graduation || "",
            skillset: editedData.skillset || "",
          };
          break;

        default:
          console.warn("⚠️ Unknown user type:", activeTab);
          return;
      }

      // Append JSON payload to FormData
      formData.append(keyName, JSON.stringify(updateData));

      // If a photo is being edited/uploaded
      if (editedData.photo) {
        formData.append("photo", editedData.photo);
      }

      console.log("🚀 Sending PATCH to:", endpoint);
      console.log("📦 FormData content:", updateData);

      const headers = {
        Authorization: "Token 7d406eecd7d9be342a7dbad264a73c5ac761f19a",
        "Content-Type": "multipart/form-data",
      };

      const res = await axios.patch(endpoint, formData, { headers });
      console.log("✅ Update Success:", res.data);

      notification.success({
        message: `${activeTab.slice(0, -1).toUpperCase()} PROFILE UPDATED`,
        description: `The ${activeTab.slice(
          0,
          -1
        )} profile was updated successfully.`,
        placement: "topRight",
      });

      if (activeTab === "sponsors") fetchSponsors();
      if (activeTab === "doctors") fetchDoctors();
      if (activeTab === "patients") fetchPatients();
      if (activeTab === "caretakers") fetchCareTakers();

      setDrawerVisible(false);
    } catch (error) {
      console.error(" Update failed:", error);
      notification.error({
        message: "UPDATE FAILED",
        description:
          error.response?.data?.detail ||
          `Unable to update ${activeTab.slice(0, -1)} profile.`,
        placement: "topRight",
      });
    }
  };

  const vitals = [
    {
      icon: bloodPressure,
      label: "Blood Pressure",
      value: "100/67 mmHg",
      color: "#27AE60",
    },
    { icon: heartRate, label: "Heart Rate", value: "89 bpm", color: "#EF1E1E" },
    { icon: sugar, label: "Sugar", value: "180", color: "#27AE60" },
    { icon: oxygen, label: "Oxygen", value: "96", color: "#27AE60" },
    {
      icon: temperature,
      label: "Temperature",
      value: "101 °C",
      color: "#27AE60",
    },
    {
      icon: respiratory,
      label: "Respiratory Rate",
      value: "24 rpm",
      color: "#EF1E1E",
    },
    { icon: weight, label: "Weight", value: "100 kg", color: "#27AE60" },
    { icon: statusIcon, label: "Status", value: "Stable", color: "#27AE60" },
  ];

  const handleEditClick = (record) => {
    switch (activeTab) {
      case "sponsors":
        setSelectedSponsor(record);
        setEditedData({
          ...record,
          sponsor_address: record.sponsorProfile?.sponsor_address || "",
          sponsor_gender: record.sponsorProfile?.sponsor_gender || "",
          work_employment: record.sponsorProfile?.work_employment || "",
          how_found_us: record.sponsorProfile?.how_found_us || "",
        });
        break;

      case "doctors":
        setSelectedDoctor(record);
        setEditedData(record);
        break;

      case "caretakers":
        setSelectedCaretaker(record);
        setEditedData({
          ...record,
          name: record.name || "",
          address: record.caretakerProfile?.caretaker_address || "",
          gender: record.caretakerProfile?.care_gender || "",
          experience: record.caretakerProfile?.caretaker_exprience || "",
          yr_graduation: record.caretakerProfile?.yr_of_graduation || "",
          credentials: record.caretakerProfile?.credentials || "",
          skillset: record.caretakerProfile?.skillset || "",
        });
        break;

      case "patients":
        setSelectedPatient(record);
        setEditedData(record);
        break;

      default:
        break;
    }

    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <img
            src={record.avatar}
            alt={text}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          {text}
        </Space>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Patients Linked",
      dataIndex: "patientsLinked",
      key: "patientsLinked",
    },
    { title: "Membership", dataIndex: "membership", key: "membership" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <EllipsisOutlined
          style={{ fontSize: 18, cursor: "pointer" }}
          onClick={() => handleEditClick(record)}
        />
      ),
    },
  ];

  const getFilteredData = () => {
    const dataMap = {
      sponsors: sponsorList.map((s) => ({
        ...s,
        key: s.id,
        avatar: s.photo,
        name: s.first_name + " " + s.last_name,
        email: s.email,
        phone: s.phone,
        country: s.country,
        patientsLinked: s.sponsorProfile?.patients_count || 0,
        membership: s.sponsorProfile?.membership_plan || "N/A",
        status: s.is_active ? "Active" : "Inactive",
      })),
      doctors: docList.map((d) => ({
        ...d,
        key: d.id,
        avatar: d.photo,
        name: d.first_name + " " + d.last_name,
        email: d.email,
        phone: d.phone,
        country: d.country,
        patientsLinked: d.doctorProfile?.patients_count || 0,
        membership: d.doctorProfile?.membership_plan || "N/A",
        status: d.is_active ? "Active" : "Inactive",
      })),
      caretakers: caretakerList.map((c) => ({
        ...c,
        key: c.id,
        avatar: c.photo,
        name: c.first_name + " " + c.last_name,
        email: c.email,
        phone: c.phone,
        country: c.country,
        patientsLinked: c.caretakerProfile?.patients_count || 0,
        membership: c.caretakerProfile?.membership_plan || "N/A",
        status: c.is_active ? "Active" : "Inactive",
      })),
      patients: patientList.map((p) => ({
        ...p,
        key: p.id,
        avatar: p.photo,
        name: p.first_name + " " + p.last_name,
        email: p.email,
        phone: p.phone,
        country: p.country,
        patientsLinked: 0,
        membership: p.patientProfile?.membership_plan || "N/A",
        status: p.is_active ? "Active" : "Inactive",
        age: p.patientProfile?.age,
        gender: p.gender,
        Condition: p.patientProfile?.medical_condition || "N/A",
        CareTaker: "N/A",
        Doctor: "N/A",
        EnrolmentDate: "N/A",
      })),
    };
    const data = dataMap[activeTab] || [];
    return data.filter(
      (d) => d.name && d.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const drawerTitleMap = {
    sponsors: "Sponsor Detailed View",
    doctors: "Doctor Detailed View",
    caretakers: "Caretaker Detailed View",
    patients: "Patient Detailed View",
  };

  const createSponsor = async (values) => {
    try {
      console.log("sponsor creation form: ", values);
    } catch (error) {
      console.log("Error Creating Sponsor: ", error);
    }
  };

  const createDoctor = async (values) => {
    try {
      console.log("Doctor creation form:", values);
    } catch (error) {
      console.log("Error Creating Doctor:", error);
    }
  };

  const createCareTaker = async (values) => {
    try {
      console.log("Care Taker creation form:", values);
    } catch (error) {
      console.log("Error Creating Care taker:", error);
    }
  };

  const createPatient = async (values) => {
    try {
      console.log("Care Taker creation form:", values);
    } catch (error) {
      console.log("Error Creating Care taker:", error);
    }
  };

  const UserForm = ({ onFinish }) => {
    const [form] = Form.useForm();

    const normFile = (e) => (Array.isArray(e) ? e : e && e.file.originFileObj);

    return (
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ countrycode: "IN" }}
      >
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: "Please enter last name" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          name="photo"
          label="Upload Photo"
          valuePropName="file"
          getValueFromEvent={normFile}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create User
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const renderDrawerContent = () => {
    if (activeTab === "sponsors" && selectedSponsor)
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Profile and Basic Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 10,
              }}
            >
              <p style={labelStyle}>Profile Image</p>

              <div style={{ position: "relative", width: 72, height: 72 }}>
                {/* Avatar */}
                <Avatar
                  size={72}
                  src={uploadedImage || selectedSponsor.avatar}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />

                {/* Upload Icon Overlay */}
                <label
                  htmlFor="image-upload"
                  style={{
                    position: "absolute",
                    bottom: -10,
                    right: "50%",
                    transform: "translateX(50%)",
                    background: "#fff",
                    borderRadius: "50%",
                    padding: 4,
                    cursor: "pointer",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                    alt="Upload"
                    width={16}
                    height={16}
                  />
                </label>

                {/* Hidden File Input */}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <label style={labelStyle}>Address</label>
                <Input
                  value={editedData.sponsor_address}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      sponsor_address: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <Input
                  value={editedData.sponsor_gender}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      sponsor_gender: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Work Employment</label>

                <Input
                  value={editedData.work_employment}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      work_employment: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>How found us</label>

                <Input
                  value={editedData.how_found_us}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      how_found_us: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Name</label>
                <Input
                  value={editedData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Sponsor ID</label>
                <Input value="SP-1021" />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <Input
                  value={editedData.phone}
                  onChange={(e) =>
                    setEditedData({ ...editedData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <Input
                  value={editedData.email}
                  onChange={(e) =>
                    setEditedData({ ...editedData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Address</label>
              <Input
                value={editedData.country}
                onChange={(e) =>
                  setEditedData({ ...editedData, country: e.target.value })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Total Patients</label>
              <Input value="2 (Father – Michael N., Mother – Grace N.)" />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <Input
                value={editedData.gender || "Male"}
                onChange={(e) =>
                  setEditedData({ ...editedData, gender: e.target.value })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Current Plan</label>
              <Input
                value={editedData.membership}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    membership: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <Select
                value={editedData.status}
                onChange={(value) =>
                  setEditedData({ ...editedData, status: value })
                }
                style={{ width: "100%" }}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
          </div>

          {/* Patients Linked (Static Example) */}
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Patients Linked</p>
            {linkedPatients.map((patient) => (
              <div
                key={patient.id}
                style={{
                  background: "#F9F9F9",
                  padding: 16,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  border: "1px solid #eaeaea",
                }}
              >
                {/* Profile Image */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    size={48}
                    src={patient.avatar}
                    style={{ borderRadius: 8, width: 60, height: 62 }}
                  />
                </div>

                {/* Name */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Name</p>
                  <p style={infoTextStyle}>{patient.name}</p>
                </div>

                {/* Assigned Doctor */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Assigned Doctor</p>
                  <p style={infoTextStyle}>{patient.doctor}</p>
                </div>

                {/* Care Taker */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Care Taker</p>
                  <p style={infoTextStyle}>{patient.caretaker}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    if (activeTab === "doctors" && selectedDoctor)
      return (
        <div>
          <p style={labelStyle}>Doctor Name</p>
          <Input
            value={editedData.name}
            onChange={(e) =>
              setEditedData({ ...editedData, name: e.target.value })
            }
          />
          <p style={labelStyle}>Specialization</p>
          <Input
            value={editedData.specialization}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                specialization: e.target.value,
              })
            }
          />
          <p style={labelStyle}>Phone</p>
          <Input
            value={editedData.phone}
            onChange={(e) =>
              setEditedData({ ...editedData, phone: e.target.value })
            }
          />
        </div>
      );

    if (activeTab === "caretakers" && selectedCaretaker)
      return (
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div>
            <p style={labelStyle}>Caretaker Name</p>
            <Input
              value={editedData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
            />
          </div>
          <div>
            <p style={labelStyle}>Caretaker Address</p>
            <Input
              rows={2}
              value={editedData.address}
              onChange={(e) =>
                setEditedData({ ...editedData, address: e.target.value })
              }
            />
          </div>
          <div>
            <p style={labelStyle}>Caretaker Gender</p>
            <Select
              value={editedData.gender}
              style={{ width: "100%" }}
              onChange={(value) =>
                setEditedData({ ...editedData, gender: value })
              }
            >
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </div>
          <div>
            <p style={labelStyle}>Experience (in years)</p>
            <Input
              type="number"
              min={0}
              value={editedData.experience}
              onChange={(e) =>
                setEditedData({ ...editedData, experience: e.target.value })
              }
            />
          </div>
          <div>
            <p style={labelStyle}>Year of Graduation</p>
            <Input
              value={editedData.yr_graduation}
              onChange={(e) =>
                setEditedData({ ...editedData, yr_graduation: e.target.value })
              }
            />
          </div>
          <div>
            <p style={labelStyle}>Credentials</p>
            <Input.TextArea
              rows={2}
              value={editedData.credentials}
              onChange={(e) =>
                setEditedData({ ...editedData, credentials: e.target.value })
              }
            />
          </div>
          <div>
            <p style={labelStyle}>Skillset</p>
            <Input.TextArea
              rows={3}
              value={editedData.skillset}
              onChange={(e) =>
                setEditedData({ ...editedData, skillset: e.target.value })
              }
            />
          </div>
        </div>
      );

    if (activeTab === "patients" && selectedPatient)
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Profile and Basic Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 10,
              }}
            >
              <p style={labelStyle}>Profile Image</p>

              <div style={{ position: "relative", width: 72, height: 72 }}>
                {/* Avatar */}
                <Avatar
                  size={72}
                  src={uploadedImage || selectedPatient.avatar}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />

                {/* Upload Icon Overlay */}
                <label
                  htmlFor="image-upload"
                  style={{
                    position: "absolute",
                    bottom: -10,
                    right: "50%",
                    transform: "translateX(50%)",
                    background: "#fff",
                    borderRadius: "50%",
                    padding: 4,
                    cursor: "pointer",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                    alt="Upload"
                    width={16}
                    height={16}
                  />
                </label>

                {/* Hidden File Input */}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <label style={labelStyle}>Name</label>
                <Input
                  value={editedData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Patient ID</label>
                <Input value="PT-2094" />
              </div>
              <div>
                <label style={labelStyle}>Age</label>
                <Input
                  value={editedData.age}
                  onChange={(e) =>
                    setEditedData({ ...editedData, age: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Care Taker</label>
                <Input
                  value={editedData.caretaker}
                  onChange={(e) =>
                    setEditedData({ ...editedData, caretaker: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <Input
                  value={editedData.gender || "Male"}
                  onChange={(e) =>
                    setEditedData({ ...editedData, gender: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Condition</label>
                <Input
                  value={editedData.Condition}
                  onChange={(e) =>
                    setEditedData({ ...editedData, Condition: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Sponsor</label>
              <Input value="John Nelson (Canada)" />
            </div>

            <div>
              <label style={labelStyle}>Care Taker</label>
              <Input
                value={editedData.CareTaker}
                onChange={(e) =>
                  setEditedData({ ...editedData, CareTaker: e.target.value })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <Select
                value={editedData.status}
                onChange={(value) =>
                  setEditedData({ ...editedData, status: value })
                }
                style={{ width: "100%" }}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
            <div>
              <label style={labelStyle}>Membership Plan</label>
              <Input
                value={editedData.membership}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    membership: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Doctor</label>
              <Input
                value={editedData.Doctor}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    Doctor: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Enrollment Date</label>
              <Input
                value={editedData.EnrolmentDate}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    EnrolmentDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Health Records</p>
            <div style={vitalsGrid}>
              {vitals.map((item, i) => (
                <div key={i} style={vitalCard}>
                  <img
                    src={item.icon}
                    alt={item.label}
                    style={{ width: 24, height: 24, flexShrink: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <p style={vitalLabel}>{item.label}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <div style={dotStyle(item.color)}></div>
                      <span style={vitalValue}>{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patients Linked (Static Example) */}
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>Sponsor Details</p>
            {linkedSponsor.map((sponsor) => (
              <div
                key={sponsor.id}
                style={{
                  background: "#F9F9F9",
                  padding: 16,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  border: "1px solid #eaeaea",
                }}
              >
                {/* Profile Image */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    size={48}
                    src={sponsor.avatar}
                    style={{ borderRadius: 8, width: 60, height: 62 }}
                  />
                </div>

                {/* Name */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Name</p>
                  <p style={infoTextStyle}>{sponsor.name}</p>
                </div>

                {/* Assigned Doctor */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Phone</p>
                  <p style={infoTextStyle}>{sponsor.phone}</p>
                </div>

                {/* Care Taker */}
                <div style={linkedInfoStyle}>
                  <p style={linkedLabelStyle}>Email</p>
                  <p style={infoTextStyle}>{sponsor.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    return null;
  };

  const tabItems = [
    { key: "sponsors", label: "Sponsors" },
    { key: "doctors", label: "Doctors" },
    { key: "caretakers", label: "Caretakers" },
    { key: "patients", label: "Patients" },
  ];

  const adminStats = [
    {
      id: 1,
      name: "Total Sponsors",
      count: 88,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 2,
      name: "Total Doctors",
      count: 58,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 3,
      name: "Care Takers",
      count: 20,
      diff: "+95%",
      duration: "in last 7 Days",
    },
    {
      id: 4,
      name: "Patients",
      count: 24,
      diff: "+25%",
      duration: "in last 7 Days",
    },
    {
      id: 5,
      name: "Active Memberships",
      count: 6,
      diff: "+15%",
      duration: "in last 7 Days",
    },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#F7F9FB" }}
    >
      {/* Sidebar */}
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Sider />
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" tip="Loading..." />
        </div>
      )}

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
          {/* cards */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              width: "100%",
            }}
          >
            {adminStats.map((stat, idx) => (
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
          {/* tabs */}
          <div
            style={{
              width: "100%",
              background: "transparent",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key);
                setDrawerVisible(false);
              }}
              items={tabItems}
            />

            <div style={tableContainer}>
              <div
                style={{
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Input
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                />

                <PrimaryBtn
                  name={`Add ${activeTab.slice(0, -1)}`}
                  icon={<PlusOutlined />}
                  onClick={() => setAddDrawerVisible(true)}
                />

                <Drawer
                  title={`Add ${activeTab.slice(0, -1)}`}
                  width={720}
                  open={addDrawerVisible}
                  onClose={() => setAddDrawerVisible(false)}
                >
                  <UserForm
                    onFinish={(values) => handleSubmit(values, activeTab)}
                  />
                </Drawer>
              </div>

              <Table
                columns={columns}
                dataSource={getFilteredData()} // Using the updated function
                pagination={{ pageSize: 5 }}
                rowKey="id"
                bordered
              />
            </div>

            <Drawer
              title={drawerTitleMap[activeTab]}
              width={720}
              onClose={() => setDrawerVisible(false)}
              open={drawerVisible}
              bodyStyle={{ padding: 24 }}
            >
              {renderDrawerContent()}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 24,
                  gap: 20,
                }}
              >
                <Button danger size="large">
                  Deactivate Account
                </Button>

                <PrimaryBtn
                  name={`Edit ${
                    activeTab.slice(0, -1).charAt(0).toUpperCase() +
                    activeTab.slice(1, -1)
                  }`}
                  type="primary"
                  size="large"
                  onClick={handleUpdateClick}
                />
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}
const tableContainer = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};
const labelStyle = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 4,
  display: "block",
  color: "#2E2E2E",
};
const linkedLabelStyle = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 4,
  display: "block",
  color: "#2E2E2E",
  opacity: "60%",
};

const linkedInfoStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const infoTextStyle = {
  margin: 0,
  fontWeight: 500,
  fontSize: 16,
  color: "#2E2E2E",
  textAlign: "center",
};
const vitalsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 15,
  minWidth: 0,
  width: "100%",
  background: "rgb(249, 249, 249)",
};

const vitalCard = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #1B1B1B1A",
  borderRadius: "10px",
  padding: "10px",
  minHeight: "80px",
  minWidth: 0,
};

const vitalLabel = { fontSize: 14, fontWeight: 600, marginBottom: 2 };
const vitalValue = { fontSize: 14, color: "#2E2E2E", wordBreak: "break-word" };
