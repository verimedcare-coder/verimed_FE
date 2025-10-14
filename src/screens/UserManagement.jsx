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

  const onFinish = (values) => {
    console.log("Sponsor Info Submitted:", values);
    form.resetFields();
    setOpen(false);
  };

  const handleUpdateClick = async () => {
    if (!editedData) return;

    console.log(`🧾 Submitting edited data for ${activeTab}:`, editedData);

    try {
      let endpoint = "";
      let payload = {};
      let headers = {
        Authorization: "Token 7d406eecd7d9be342a7dbad264a73c5ac761f19a",
        "Content-Type": "application/json",
      };

      switch (activeTab) {
        case "sponsors":
          endpoint = `${base_url}/verimed/sponsorprofile_update/`;
          payload = {
            spon_profile_updateid: selectedSponsor?.sponsorProfile?.id,
            sponsor_address: editedData.sponsorProfile?.sponsor_address || "",
            sponsor_gender: editedData.sponsorProfile?.sponsor_gender || "",
            work_employment: editedData.sponsorProfile?.work_employment || "",
            how_found_us: editedData.sponsorProfile?.how_found_us || "",
          };
          break;

        case "doctors":
          endpoint = `${base_url}/verimed/doctorprofile_update/`;
          payload = {
            doctor_profile_updateid: selectedDoctor?.doctorProfile?.id,
            doctor_address: editedData.address,
            doctor_gender: editedData.gender,
            specialization: editedData.speciality,
            year_of_graduation: editedData.yr_graduation,
          };
          break;

        case "patients":
          endpoint = `${base_url}/verimed/patientprofile_update/`;
          payload = {
            patient_profile_updateid: selectedPatient?.patientProfile?.id,
            patient_address: editedData.address,
            patient_gender: editedData.gender,
            condition: editedData.condition,
          };
          break;

        case "caretakers":
          endpoint = `${base_url}/verimed/caretakerprofile_update/`;
          payload = {
            caretaker_profile_updateid: selectedCaretaker?.caretakerProfile?.id,
            caretaker_address: editedData.address,
            caretaker_gender: editedData.gender,
            credentials: editedData.credentials,
            skillset: editedData.skillset,
          };
          break;

        default:
          console.warn("⚠️ Unknown user type:", activeTab);
          return;
      }

      console.log("🚀 Sending PATCH to:", endpoint);
      console.log("📦 Payload:", payload);

      const res = await axios.patch(endpoint, payload, { headers });
      console.log("✅ Update Success:", res.data);

      notification.success({
        message: `${activeTab.slice(0, -1).toUpperCase()} PROFILE UPDATED`,
        description: `The ${activeTab.slice(
          0,
          -1
        )} profile was updated successfully.`,
        placement: "topRight",
      });

      // Refresh data based on tab
      if (activeTab === "sponsors") fetchSponsors();
      if (activeTab === "doctors") fetchDoctors();
      if (activeTab === "patients") fetchPatients();
      if (activeTab === "caretakers") fetchCareTakers();

      setDrawerVisible(false);
    } catch (error) {
      console.error("❌ Update failed:", error);
      notification.error({
        message: "UPDATE FAILED",
        description: `Unable to update ${activeTab.slice(0, -1)} profile.`,
        placement: "topRight",
      });
    }
  };

  // Sample doctors data - REMOVED FOR CLARITY AS IT'S REPLACED BY docList
  const [doctorsData] = useState([
    {
      key: 1,
      name: "John",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "john.n@verimed.com",
      phone: "+1 416 222 1000",
      gender: "Male",
      country: "Canada",
      patientsLinked: 1,
      Doctor: "mr.paul",
      CareTaker: "Nurse Clarisse",
      Sponsor: "John Nelson (Canada)",
      membership: "Premium",
      EnrolmentDate: "Feb 12, 2024",
      Condition: "Hypertension, Diabetes",
      status: "Active",
    },
  ]);
  // Sample caretakers data - REMOVED FOR CLARITY AS IT'S REPLACED BY caretakerList
  const [caretakersData] = useState([
    { id: 1, name: "Ravi Kumar", shift: "Night", phone: "7777766666" },
  ]);
  // Sample patients data - REMOVED FOR CLARITY AS IT'S REPLACED BY patientList
  const [patientsData] = useState([
    {
      key: 1,
      name: "John",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      email: "john.n@verimed.com",
      phone: "+1 416 222 1000",
      gender: "Male",
      age: 55,
      country: "Canada",
      patientsLinked: 1,
      Doctor: "mr.paul",
      CareTaker: "Nurse Clarisse",
      Sponsor: "John Nelson (Canada)",
      membership: "Premium",
      EnrolmentDate: "Feb 12, 2024",
      Condition: "Hypertension, Diabetes",
      status: "Active",
    },
  ]);
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
        setEditedData(record);
        console.log(editedData, "edit");
        break;
      case "doctors":
        setSelectedDoctor(record);
        setEditedData(record);
        break;
      case "caretakers":
        setSelectedCaretaker(record);
        setEditedData(record);
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

  function SponsorForm({ mode = "add", data = {}, onCancel, onSave }) {
    const [formData, setFormData] = useState({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || "",
      address: data.address || "",
      password: data.password || "",
      phone: data.phone || "",
      company: data.company || "",
      found_us: data.fount_us || "",
    });

    const handleChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      console.log("Sponsor Form Data:", formData);
      if (onSave) onSave(formData);
    };

    return (
      <Form
        layout="vertical"
        onFinish={createSponsor}
        style={{
          padding: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: 24,
          }}
        >
          <Form.Item label="First Name" required>
            <Input
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Last Name" required>
            <Input
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Phone Number">
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Email Address">
            <Input
              value={formData.email}
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="comfirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item label="Address">
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Company Name">
            <Input
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </Form.Item>
        </div>

        <Form.Item label="How Found Us?">
          <Select
            value={formData.found_us}
            onChange={(value) => handleChange("found_us", value)}
            options={[
              { label: "Search", value: "Search" },
              { label: "Social Media", value: "Social Media" },
              { label: "Friends", value: "Friends" },
              { label: "Family", value: "Family" },
              { label: "Other", value: "Other" },
            ]}
          />
        </Form.Item>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <Space>
            <SecondaryBtn name="cancel" onClick={onCancel} />
            <PrimaryBtn
              type="button"
              onClick={handleSave}
              name={mode === "edit" ? "Save Changes" : "Add Sponsor"}
            />
          </Space>
        </div>
      </Form>
    );
  }

  function DoctorForm({ mode = "add", data = {}, onCancel, onSave }) {
    const [formData, setFormData] = useState({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || "",
      address: data.address || "",
      password: data.password || "",
      phone: data.phone || "",
      license_no: data.license_no || "",
      city: data.city || "",
      pincode: data.pincode || "",
      speciality: data.speciality || "",
      yr_graduation: data.yr_graduation || "",
      language: data.language || "",
      photo: data.photo || "",
    });

    const handleChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      const payload = { ...formData };
      console.log("Doctor Form Data:", payload);
      if (onSave) onSave(payload);
    };

    const getBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState(
      data.photo
        ? [
            {
              uid: "-1",
              name: "doctor.png",
              status: "done",
              url: data.photo,
            },
          ]
        : []
    );

    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    };

    const handleImageChange = async ({ fileList: newFileList }) => {
      const latest = newFileList.slice(-1);
      setFileList(latest);

      if (latest.length > 0) {
        const file = latest[0].originFileObj;
        if (file) {
          const base64 = await getBase64(file);
          handleChange("photo", base64);
        } else if (latest[0].url) {
          handleChange("photo", latest[0].url);
        }
      } else {
        handleChange("photo", "");
      }
    };

    const uploadButton = (
      <div style={{ textAlign: "center" }}>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <Form
        layout="vertical"
        onFinish={createDoctor(formData)}
        style={{
          padding: 16,
        }}
      >
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleImageChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: 24,
          }}
        >
          <Form.Item label="First Name" required>
            <Input
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Last Name" required>
            <Input
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Phone Number">
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Email Address">
            <Input
              value={formData.email}
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="comfirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item label="License Number">
            <Input
              value={formData.license_no}
              onChange={(e) => handleChange("license_no", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Speciality">
            <Input
              value={formData.speciality}
              onChange={(e) => handleChange("speciality", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Year of Graduation">
            <Input
              value={formData.yr_graduation}
              onChange={(e) => handleChange("yr_graduation", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="City">
            <Input
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Pincode">
            <Input
              value={formData.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Address">
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Languages Known">
            <Select
              mode="multiple"
              placeholder="Select languages"
              value={formData.language || []}
              onChange={(value) => handleChange("language", value)}
              options={[
                { label: "English", value: "English" },
                { label: "French", value: "French" },
                { label: "Fulfulde", value: "Fulfulde" },
                { label: "Ewondo", value: "Ewondo" },
                { label: "Duala", value: "Duala" },
                { label: "Bakweri", value: "Bakweri" },
                { label: "Bassa", value: "Bassa" },
                { label: "Maka", value: "Maka" },
                { label: "Tikar", value: "Tikar" },
                { label: "Arabic", value: "Arabic" },
              ]}
            />
          </Form.Item>
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <Space>
            <SecondaryBtn name="cancel" onClick={onCancel} />
            <PrimaryBtn
              type="button"
              onClick={handleSave}
              name={mode === "edit" ? "Save Changes" : "Add Doctor"}
            />
          </Space>
        </div>
      </Form>
    );
  }

  function CaretakerForm({ mode = "add", data = {}, onCancel, onSave }) {
    const [formData, setFormData] = useState({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || "",
      address: data.address || "",
      password: data.password || "",
      phone: data.phone || "",
      profileImage: data.profileImage || null,
      name: data.name || "",
      caretakerId: data.caretakerId || "CT-1011",
      age: data.age || "",
      gender: data.gender || "",
      patientAssigned: data.patientAssigned || "",
      doctor: data.doctor || "",
      plan: data.plan || "Standard",
      onboardDate: data.onboardDate ? dayjs(data.onboardDate) : null,
      credentials: data.credentials || "",
      yr_graduation: data.yr_graduation || "",
      skillset: data.skillset || [],
      status: data.status || "Active",
    });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    // inside CaretakerForm

    const [fileList, setFileList] = useState(
      data.profileImage
        ? [
            {
              uid: "-1",
              name: "caretaker.png",
              status: "done",
              url: data.profileImage,
            },
          ]
        : []
    );

    const getBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    };

    const handleImageChange = async ({ fileList: newFileList }) => {
      const latest = newFileList.slice(-1);
      setFileList(latest);

      if (latest.length > 0) {
        const file = latest[0].originFileObj;
        if (file) {
          const base64 = await getBase64(file);
          handleChange("photo", base64); // store photo in formData
        } else if (latest[0].url) {
          handleChange("photo", latest[0].url);
        }
      } else {
        handleChange("photo", "");
      }
    };

    const uploadButton = (
      <div style={{ textAlign: "center" }}>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    const handleChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      console.log("Caretaker form data:", formData);
      if (onSave) onSave(formData);
    };

    return (
      <Form layout="vertical" onFinish={createCareTaker}>
        {/* Profile Image Upload and Preview Logic */}
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleImageChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>

        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>

        {/* Two-Column Grid for Form Fields */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
          }}
        >
          <Form.Item label="First Name" required>
            <Input
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Last Name" required>
            <Input
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Phone Number">
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Email Address">
            <Input
              value={formData.email}
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="comfirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Care Taker ID</span>}>
            <Input value={formData.caretakerId} disabled />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Age</span>}>
            <Input
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              placeholder="e.g., 35"
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Gender</span>}>
            <Select
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Address</span>}>
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Patient Assigned</span>}>
            <Select
              placeholder="Select Patient"
              value={formData.patientAssigned}
              onChange={(value) => handleChange("patientAssigned", value)}
              options={[
                { label: "Michael N. (PT-2094)", value: "PT-2094" },
                { label: "Grace N. (PT-2095)", value: "PT-2095" },
                { label: "Samuel L. (PT-2096)", value: "PT-2096" },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Doctor</span>}>
            <Select
              placeholder="Select Doctor"
              value={formData.doctor}
              onChange={(value) => handleChange("doctor", value)}
              options={[
                { label: "Dr. Paul M.", value: "Dr. Paul M." },
                { label: "Dr. Linda S.", value: "Dr. Linda S." },
                { label: "Dr. John D.", value: "Dr. John D." },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Credentials</span>}>
            <Select
              value={formData.credentials}
              onChange={(value) => handleChange("credentials", value)}
              options={[
                { label: "Nurse", value: "Nurse" },
                { label: "Therapist", value: "Therapist" },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Year Of Graduation</span>}>
            <Input
              value={formData.yr_graduation}
              onChange={(e) => handleChange("yr_graduation", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Skill Set">
            <Select
              mode="multiple"
              placeholder="Select"
              value={formData.skillset || []}
              onChange={(value) => handleChange("skillset", value)}
              options={[
                { label: "Patient Care", value: "Patient Care" },
                { label: "First Aid", value: "First Aid" },
                {
                  label: "Medication Management",
                  value: "Medication Management",
                },
                { label: "Elderly Support", value: "Elderly Support" },
                {
                  label: "Physiotherapy Assistance",
                  value: "Physiotherapy Assistance",
                },
                { label: "Meal Preparation", value: "Meal Preparation" },
                { label: "Hygiene Maintenance", value: "Hygiene Maintenance" },
                { label: "Vitals Monitoring", value: "Vitals Monitoring" },
                { label: "Companionship", value: "Companionship" },
                { label: "Basic Nursing", value: "Basic Nursing" },
                { label: "Housekeeping", value: "Housekeeping" },
                { label: "Mobility Assistance", value: "Mobility Assistance" },
                { label: "Wound Dressing", value: "Wound Dressing" },
                { label: "CPR Certified", value: "CPR Certified" },
                { label: "Emergency Response", value: "Emergency Response" },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Onboard Date</span>}>
            <DatePicker
              value={formData.onboardDate}
              onChange={(date) => handleChange("onboardDate", date)}
              format="MMM DD, YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Status</span>}>
            <Select
              value={formData.status}
              onChange={(value) => handleChange("status", value)}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Pending", value: "Pending" },
              ]}
            />
          </Form.Item>
        </div>

        {/* Action Buttons */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <Space>
            <SecondaryBtn name="Cancel" onClick={onCancel} />
            <PrimaryBtn
              type="button"
              onClick={handleSave}
              name={mode === "edit" ? "Save Changes" : "Add Caretaker"}
            />
          </Space>
        </div>
      </Form>
    );
  }

  function PatientForm({ mode = "add", data = {}, onCancel, onSave }) {
    const [formData, setFormData] = useState({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || "",
      address: data.address || "",
      quarter: data.quarter || "",
      password: data.password || "",
      phone: data.phone || "",
      profileImage: data.profileImage || null,
      age: data.age || "",
      gender: data.gender || "",
      condition: data.condition || "",
      caretaker: data.caretaker || "",
      family_caretaker: data.family_caretaker || "",
      sponsor: data.sponsor || [],
      doctor: data.doctor || "",
      membershipPlan: data.membershipPlan || "Premium",
      enrolmentDate: data.enrolmentDate ? dayjs(data.enrolmentDate) : null,
      status: data.status || "Active",

      // Patient Information
      primaryLanguages: data.primaryLanguages || [],
      religion: data.religion || "",
      escalateToPhysician: data.escalateToPhysician || "",

      // Emergency Contacts
      emergencyName: data.emergencyName || "",
      emergencyRelation: data.emergencyRelation || "",
      emergencyCountry: data.emergencyCountry || "",
      emergencyPhone: data.emergencyPhone || "",
      emergencyEmail: data.emergencyEmail || "",
      localContactName: data.localContactName || "",
      localContactRelation: data.localContactRelation || "",
      localContactPhone: data.localContactPhone || "",

      // Enrollment
      enrollmentReason: data.enrollmentReason || [],
      additionalComments: data.additionalComments || "",

      // Medical History
      diagnosedConditions: data.diagnosedConditions || [],
      cancerType: data.cancerType || "",
      otherConditions: data.otherConditions || "",
      recentDoctors: data.recentDoctors || "",
      majorSurgeries: data.majorSurgeries || "",
      currentSymptoms: data.currentSymptoms || "",

      // Medications
      medicationName: data.medicationName || "",
      medicationDose: data.medicationDose || "",
      medicationFrequency: data.medicationFrequency || "",
      medicationReason: data.medicationReason || "",
      medicationIssues: data.medicationIssues || "",
      medicationIssueExplanation: data.medicationIssueExplanation || "",

      // Allergies
      noAllergies: data.noAllergies || "",
      drugAllergies: data.drugAllergies || "",
      foodAllergies: data.foodAllergies || "",

      // Functional Status
      recentFalls: data.recentFalls || "",
      fallCount: data.fallCount || "",
      memoryProblems: data.memoryProblems || "",
      canBathe: data.canBathe || "",
      canDress: data.canDress || "",
      canEatFeedSelf: data.canEatFeedSelf || "",
      canWalkUseAssistiveDevice: data.canWalkUseAssistiveDevice || "",
      canUseBathroom: data.canUseBathroom || "",
      canRememberDailyActivities: data.canRememberDailyActivities || "",
      canManageFinancesMedications: data.canManageFinancesMedications || "",

      // Lifestyle
      dailyRoutine: data.dailyRoutine || "",
      dietaryHabits: data.dietaryHabits || "",
      sleepQuality: data.sleepQuality || "",
      activityLevel: data.activityLevel || "",
      tobaccoAlcoholUse: data.tobaccoAlcoholUse || "",
      painLevel: data.painLevel || "",
      painLocation: data.painLocation || "",

      // Social/Emotional
      mood: data.mood || "",
      spiritualNeeds: data.spiritualNeeds || "",
      trustedPersonExists: data.trustedPersonExists || "",
      trustedPersonName: data.trustedPersonName || "",

      // Goals
      familyGoals: data.familyGoals || "",
      carePreferences: data.carePreferences || "",
      preferredCareType: data.preferredCareType || "",

      // Uploads
      uploadedDocTypes: data.uploadedDocTypes || [],
      uploadedFiles: data.uploadedFiles || [],
    });

    const getBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState(
      data.profileImage
        ? [
            {
              uid: "-1",
              name: "profile.png",
              status: "done",
              url: data.profileImage,
            },
          ]
        : []
    );

    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    };

    const handleImageChange = async ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1)); // only 1 image
      const lastFile = newFileList[0];
      if (lastFile) {
        const base64 = await getBase64(lastFile.originFileObj);
        setFormData((prev) => ({
          ...prev,
          profileImage: base64,
        }));
      }
    };

    const handleChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      const payload = {
        ...formData,
        uploadedFiles: fileList.map((f) => f.url || f.thumbUrl || f.name),
      };
      console.log("🩺 Final Patient Payload:", payload);
      if (onSave) onSave(payload);
    };

    const uploadButton = (
      <div style={{ textAlign: "center" }}>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <Form layout="vertical" onFinish={createPatient}>
        {/* <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleImageChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>

        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal> */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
          }}
        >
          <Form.Item label="First Name" required>
            <Input
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Last Name" required>
            <Input
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Phone Number">
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Email Address">
            <Input
              value={formData.email}
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Address">
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Quarter/Neighborhood">
            <Input
              value={formData.quarter}
              onChange={(e) => handleChange("quarter", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="comfirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Gender</span>}>
            <Select
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Condition</span>}>
            <Input
              value={formData.condition}
              onChange={(e) => handleChange("condition", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Family Caretaker</span>}>
            <Input
              value={formData.family_caretaker}
              onChange={(e) => handleChange("family_caretaker", e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Care Taker</span>}>
            <Select
              placeholder="Select Caretaker"
              value={formData.caretaker}
              onChange={(value) => handleChange("caretaker", value)}
              options={[
                { label: "Dr. Paul M.", value: "Dr. Paul M." },
                { label: "Dr. Linda S.", value: "Dr. Linda S." },
                { label: "Dr. John D.", value: "Dr. John D." },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Doctor</span>}>
            <Select
              placeholder="Select Doctor"
              value={formData.doctor}
              onChange={(value) => handleChange("doctor", value)}
              options={[
                { label: "Dr. Paul M.", value: "Dr. Paul M." },
                { label: "Dr. Linda S.", value: "Dr. Linda S." },
                { label: "Dr. John D.", value: "Dr. John D." },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Sponsor</span>}>
            <Select
              placeholder="Select Sponsor"
              mode="multiple"
              value={formData.sponsor || []}
              onChange={(value) => handleChange("sponsor", value)}
              options={[
                { label: "Dr. Paul M.", value: "Dr. Paul M." },
                { label: "Dr. Linda S.", value: "Dr. Linda S." },
                { label: "Dr. John D.", value: "Dr. John D." },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Membership Plan</span>}>
            <Select
              value={formData.membershipPlan}
              onChange={(value) => handleChange("membershipPlan", value)}
              options={[
                { label: "Basic", value: "Basic" },
                { label: "Standard", value: "Standard" },
                { label: "Premium", value: "Premium" },
              ]}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Enrolment Date</span>}>
            <DatePicker
              value={formData.enrolmentDate}
              onChange={(date) => handleChange("enrolmentDate", date)}
              style={{ width: "100%" }}
              format="MMM DD, YYYY"
            />
          </Form.Item>
        </div>

        {/* ============================
  1. PATIENT INFORMATION
============================ */}
        <Divider orientation="left">Patient Information</Divider>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item label="Primary Language(s) Spoken">
            <Select
              mode="multiple"
              placeholder="Select languages"
              value={formData.primaryLanguages || []}
              onChange={(value) => handleChange("primaryLanguages", value)}
              options={[
                { label: "English", value: "English" },
                { label: "French", value: "French" },
                { label: "Fulfulde", value: "Fulfulde" },
                { label: "Ewondo", value: "Ewondo" },
                { label: "Duala", value: "Duala" },
                { label: "Arabic", value: "Arabic" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Religion / Spiritual Practices">
            <Input
              value={formData.religion}
              onChange={(e) => handleChange("religion", e.target.value)}
              placeholder="e.g., Christianity, Islam, Traditional"
            />
          </Form.Item>

          <Form.Item label="Escalate to Physician?">
            <Select
              placeholder="Select"
              value={formData.escalateToPhysician}
              onChange={(value) => handleChange("escalateToPhysician", value)}
              options={[
                { label: "Alone", value: "Alone" },
                { label: "With Spouse", value: "With Spouse" },
                { label: "With Children", value: "With Children" },
                { label: "With Caregiver", value: "With Caregiver" },
                {
                  label: "With Another Relative",
                  value: "With Another Relative",
                },
              ]}
            />
          </Form.Item>
        </div>

        {/* ============================
  2. EMERGENCY & FAMILY CONTACT
============================ */}
        <Divider orientation="left">Emergency & Family Contact</Divider>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item label="Contact Name">
            <Input
              value={formData.emergencyName}
              onChange={(e) => handleChange("emergencyName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Relationship to Patient">
            <Input
              value={formData.emergencyRelation}
              onChange={(e) =>
                handleChange("emergencyRelation", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Country of Residence">
            <Input
              value={formData.emergencyCountry}
              onChange={(e) => handleChange("emergencyCountry", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Phone / WhatsApp">
            <Input
              value={formData.emergencyPhone}
              onChange={(e) => handleChange("emergencyPhone", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={formData.emergencyEmail}
              onChange={(e) => handleChange("emergencyEmail", e.target.value)}
            />
          </Form.Item>

          {/* Local Contact */}
          <Form.Item label="Local Contact Name (in Cameroon)">
            <Input
              value={formData.localContactName}
              onChange={(e) => handleChange("localContactName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Local Contact Relationship">
            <Input
              value={formData.localContactRelation}
              onChange={(e) =>
                handleChange("localContactRelation", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Local Contact Phone / WhatsApp">
            <Input
              value={formData.localContactPhone}
              onChange={(e) =>
                handleChange("localContactPhone", e.target.value)
              }
            />
          </Form.Item>
        </div>

        {/* ============================
  3. REASON FOR ENROLLMENT
============================ */}
        <Divider orientation="left">Reason for Enrollment in VeriMED</Divider>

        <Form.Item label="Reason for Enrollment">
          <Select
            mode="multiple"
            placeholder="Select reason(s)"
            value={formData.enrollmentReason || []}
            onChange={(value) => handleChange("enrollmentReason", value)}
            options={[
              {
                label: "Ongoing Primary Medical Care",
                value: "Ongoing Primary Medical Care",
              },
              {
                label: "Post-Hospital Follow-Up",
                value: "Post-Hospital Follow-Up",
              },
              {
                label: "Nursing or Rehabilitation at Home",
                value: "Nursing or Rehabilitation at Home",
              },
              {
                label: "Routine Wellness and Aging Support",
                value: "Routine Wellness and Aging Support",
              },
              {
                label: "Memory or Dementia Support",
                value: "Memory or Dementia Support",
              },
              {
                label: "Hospice / Palliative Support",
                value: "Hospice / Palliative Support",
              },
            ]}
          />
        </Form.Item>

        <Form.Item label="Additional Comments">
          <Input.TextArea
            rows={3}
            value={formData.additionalComments}
            onChange={(e) => handleChange("additionalComments", e.target.value)}
          />
        </Form.Item>

        <Divider orientation="left">Medical History</Divider>

        <Form.Item label="Diagnosed Conditions (check all that apply)">
          <Select
            mode="multiple"
            placeholder="Select conditions"
            value={formData.diagnosedConditions || []}
            onChange={(value) => handleChange("diagnosedConditions", value)}
            options={[
              { label: "Hypertension", value: "Hypertension" },
              { label: "Diabetes", value: "Diabetes" },
              { label: "Heart Disease", value: "Heart Disease" },
              {
                label: "Memory Loss / Dementia",
                value: "Memory Loss / Dementia",
              },
              { label: "Arthritis", value: "Arthritis" },
              {
                label: "Vision or Hearing Loss",
                value: "Vision or Hearing Loss",
              },
              { label: "Parkinson’s", value: "Parkinson’s" },
              { label: "Kidney Disease", value: "Kidney Disease" },
              {
                label: "Respiratory Conditions",
                value: "Respiratory Conditions",
              },
              { label: "Cancer", value: "Cancer" },
              { label: "Psychiatric Illness", value: "Psychiatric Illness" },
            ]}
          />
        </Form.Item>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item label="Cancer (Type)">
            <Input
              value={formData.cancerType}
              onChange={(e) => handleChange("cancerType", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Other (please list)">
            <Input
              value={formData.otherConditions}
              onChange={(e) => handleChange("otherConditions", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Doctor(s) Providing Recent Care (Name & Phone)">
            <Input
              value={formData.recentDoctors}
              onChange={(e) => handleChange("recentDoctors", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Major Surgeries or Hospitalizations (include year)">
            <Input.TextArea
              rows={2}
              value={formData.majorSurgeries}
              onChange={(e) => handleChange("majorSurgeries", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Current Symptoms or Concerns">
            <Input.TextArea
              rows={2}
              value={formData.currentSymptoms}
              onChange={(e) => handleChange("currentSymptoms", e.target.value)}
            />
          </Form.Item>
        </div>
        <Divider orientation="left">Medications</Divider>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item label="Medication Name">
            <Input
              value={formData.medicationName}
              onChange={(e) => handleChange("medicationName", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Dose">
            <Input
              value={formData.medicationDose}
              onChange={(e) => handleChange("medicationDose", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Frequency">
            <Input
              value={formData.medicationFrequency}
              onChange={(e) =>
                handleChange("medicationFrequency", e.target.value)
              }
            />
          </Form.Item>

          <Form.Item label="Reason">
            <Input
              value={formData.medicationReason}
              onChange={(e) => handleChange("medicationReason", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Any Issues With Taking Medications?">
            <Select
              placeholder="Select"
              value={formData.medicationIssues}
              onChange={(value) => handleChange("medicationIssues", value)}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
            />
          </Form.Item>

          {formData.medicationIssues === "Yes" && (
            <Form.Item label="If Yes, Explain">
              <Input.TextArea
                rows={2}
                value={formData.medicationIssueExplanation}
                onChange={(e) =>
                  handleChange("medicationIssueExplanation", e.target.value)
                }
              />
            </Form.Item>
          )}
        </div>
        <Divider orientation="left">Allergies</Divider>

        <Form.Item label="No Known Allergies?">
          <Select
            value={formData.noAllergies}
            onChange={(value) => handleChange("noAllergies", value)}
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
          />
        </Form.Item>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item label="Drug Allergies">
            <Input
              value={formData.drugAllergies}
              onChange={(e) => handleChange("drugAllergies", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Food or Environmental Allergies">
            <Input
              value={formData.foodAllergies}
              onChange={(e) => handleChange("foodAllergies", e.target.value)}
            />
          </Form.Item>
        </div>

        <Divider orientation="left">Functional & Cognitive Status</Divider>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {[
            "Bathe",
            "Dress",
            "Eat / Feed Self",
            "Walk / Use Assistive Device",
            "Use Bathroom",
            "Remember Daily Activities",
            "Manage Finances / Medications",
          ].map((activity) => (
            <Form.Item key={activity} label={`Can the patient ${activity}?`}>
              <Select
                value={formData[`can${activity.replace(/[^a-z]/gi, "")}`]}
                onChange={(value) =>
                  handleChange(`can${activity.replace(/[^a-z]/gi, "")}`, value)
                }
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "Needs Help", value: "Needs Help" },
                  { label: "Cannot Do", value: "Cannot Do" },
                ]}
              />
            </Form.Item>
          ))}

          <Form.Item label="Any Falls in the Last 6 Months?">
            <Select
              value={formData.recentFalls}
              onChange={(value) => handleChange("recentFalls", value)}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
            />
          </Form.Item>

          {formData.recentFalls === "Yes" && (
            <Form.Item label="If Yes, How Many?">
              <Input
                value={formData.fallCount}
                onChange={(e) => handleChange("fallCount", e.target.value)}
              />
            </Form.Item>
          )}

          <Form.Item label="Memory Problems Noted?">
            <Select
              value={formData.memoryProblems}
              onChange={(value) => handleChange("memoryProblems", value)}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
            />
          </Form.Item>
        </div>

        <Divider orientation="left">Lifestyle and Wellness</Divider>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item label="Typical Daily Routine">
            <Input.TextArea
              rows={2}
              value={formData.dailyRoutine}
              onChange={(e) => handleChange("dailyRoutine", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Dietary Habits / Restrictions">
            <Input.TextArea
              rows={2}
              value={formData.dietaryHabits}
              onChange={(e) => handleChange("dietaryHabits", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Sleep Quality">
            <Select
              value={formData.sleepQuality}
              onChange={(value) => handleChange("sleepQuality", value)}
              options={[
                { label: "Good", value: "Good" },
                { label: "Fair", value: "Fair" },
                { label: "Poor", value: "Poor" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Physical Activity Level">
            <Select
              value={formData.activityLevel}
              onChange={(value) => handleChange("activityLevel", value)}
              options={[
                { label: "Active", value: "Active" },
                { label: "Some", value: "Some" },
                { label: "None", value: "None" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Tobacco / Alcohol Use">
            <Select
              value={formData.tobaccoAlcoholUse}
              onChange={(value) => handleChange("tobaccoAlcoholUse", value)}
              options={[
                { label: "Never", value: "Never" },
                { label: "Occasionally", value: "Occasionally" },
                { label: "Regularly", value: "Regularly" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Pain Complaints">
            <Select
              value={formData.painLevel}
              onChange={(value) => handleChange("painLevel", value)}
              options={[
                { label: "None", value: "None" },
                { label: "Mild", value: "Mild" },
                { label: "Moderate", value: "Moderate" },
                { label: "Severe", value: "Severe" },
              ]}
            />
          </Form.Item>

          {formData.painLevel !== "None" && (
            <Form.Item label="If Pain, Where?">
              <Input
                value={formData.painLocation}
                onChange={(e) => handleChange("painLocation", e.target.value)}
              />
            </Form.Item>
          )}
        </div>

        <Divider orientation="left">
          Social / Emotional / Cultural Considerations
        </Divider>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Form.Item label="Mood & Emotional Health">
            <Select
              value={formData.mood}
              onChange={(value) => handleChange("mood", value)}
              options={[
                { label: "Happy", value: "Happy" },
                { label: "Anxious", value: "Anxious" },
                { label: "Depressed", value: "Depressed" },
                { label: "Withdrawn", value: "Withdrawn" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Spiritual Needs or Beliefs Impacting Care">
            <Input.TextArea
              rows={2}
              value={formData.spiritualNeeds}
              onChange={(e) => handleChange("spiritualNeeds", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Do They Have a Trusted Person Who Helps Make Decisions?">
            <Select
              value={formData.trustedPersonExists}
              onChange={(value) => handleChange("trustedPersonExists", value)}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
            />
          </Form.Item>

          {formData.trustedPersonExists === "Yes" && (
            <Form.Item label="Name of Trusted Person">
              <Input
                value={formData.trustedPersonName}
                onChange={(e) =>
                  handleChange("trustedPersonName", e.target.value)
                }
              />
            </Form.Item>
          )}
        </div>

        <Divider orientation="left">
          Goals of Care & Family Expectations
        </Divider>

        <Form.Item label="What Does Your Family Hope To Achieve Through VeriMED?">
          <Input.TextArea
            rows={3}
            value={formData.familyGoals}
            onChange={(e) => handleChange("familyGoals", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Specific Instructions or Preferences for How Care Is Delivered">
          <Input.TextArea
            rows={3}
            value={formData.carePreferences}
            onChange={(e) => handleChange("carePreferences", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Preferred Type of Care">
          <Select
            value={formData.preferredCareType}
            onChange={(value) => handleChange("preferredCareType", value)}
            options={[
              {
                label: "Long-Term Concierge Wellness",
                value: "Long-Term Concierge Wellness",
              },
              {
                label: "Short-Term Recovery Support",
                value: "Short-Term Recovery Support",
              },
              { label: "Not Sure", value: "Not Sure" },
            ]}
          />
        </Form.Item>
        <Divider orientation="left">Uploads / Attachments</Divider>

        <Form.Item label="Select Documents to Upload">
          <Select
            mode="multiple"
            placeholder="Select documents"
            value={formData.uploadedDocTypes || []}
            onChange={(value) => handleChange("uploadedDocTypes", value)}
            options={[
              { label: "Recent Lab Reports", value: "Recent Lab Reports" },
              { label: "Doctor's Notes", value: "Doctor's Notes" },
              { label: "Discharge Summary", value: "Discharge Summary" },
              {
                label: "Photos of Medications",
                value: "Photos of Medications",
              },
              {
                label: "Health Insurance or ID Card",
                value: "Health Insurance or ID Card",
              },
            ]}
          />
        </Form.Item>

        <Upload
          multiple
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleImageChange}
        >
          {uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>

        <Form.Item label={<span style={labelStyle}>Status</span>}>
          <Select
            value={formData.status}
            onChange={(value) => handleChange("status", value)}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
              { label: "Pending", value: "Pending" },
            ]}
          />
        </Form.Item>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <Space>
            <SecondaryBtn name="cancel" onClick={onCancel} />
            <PrimaryBtn
              type="button"
              onClick={handleSave}
              name={mode === "edit" ? "Save Changes" : "Add Patient"}
            />
          </Space>
        </div>
      </Form>
    );
  }

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
        <div>
          <p style={labelStyle}>Caretaker Name</p>
          <Input
            value={editedData.name}
            onChange={(e) =>
              setEditedData({ ...editedData, name: e.target.value })
            }
          />
          <p style={labelStyle}>Shift</p>
          <Input
            value={editedData.shift}
            onChange={(e) =>
              setEditedData({ ...editedData, shift: e.target.value })
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
                {/* <PrimaryBtn
                  name={`Add ${activeTab.slice(0, -1)}`}
                  icon={<PlusOutlined />}
                  onClick={() => setDrawerVisible(true)}
                /> */}
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
                  {activeTab === "sponsors" && <SponsorForm mode="add" />}
                  {activeTab === "doctors" && <DoctorForm mode="add" />}
                  {activeTab === "caretakers" && <CaretakerForm mode="add" />}
                  {activeTab === "patients" && (
                    <PatientForm
                      mode="add"
                      onCancel={() => setAddDrawerVisible(false)}
                      onSave={(values) => {
                        console.log("Saved Patient:", values);
                        setAddDrawerVisible(false);
                      }}
                    />
                  )}
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
                  name="Edit Sponsor"
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
