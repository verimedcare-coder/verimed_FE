import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import Overview from "./screens/Overview";
import MyLovedOnes from "./screens/MyLovedOnes";
import Appointments from "./screens/Appointments";
import CareTeam from "./screens/CareTeam";
import BillingAndMembership from "./screens/BillingAndMembership";
import Messages from "./screens/Messages";
import MyReports from "./screens/MyReports";
import MyCareTaker from "./screens/MyCareTaker";
import MyPatients from "./screens/MyPatients";
import DailyReports from "./screens/DailyReports";
import HealthMonitoring from "./screens/HealthMonitoring";
import MyAppointments from "./screens/MyAppointments";
import ReportsToReview from "./screens/ReportsToReview";
import UserManagement from "./screens/UserManagement";
import Departments from "./screens/Departments";
import MembershipPlans from "./screens/MembershipPlans";
import Support from "./screens/Support";
import ViewPatientDetails from "./screens/ViewPatientDetails";
import DoctorForm from "./screens/DoctorForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/my_loved_ones" element={<MyLovedOnes />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/care_team" element={<CareTeam />} />
        <Route
          path="/billing_and_membership"
          element={<BillingAndMembership />}
        />
        <Route path="/messages" element={<Messages />} />
        <Route path="/my_reports" element={<MyReports />} />
        <Route path="/my_care_taker" element={<MyCareTaker />} />
        <Route path="/my_patients" element={<MyPatients />} />
        <Route path="/daily_reports" element={<DailyReports />} />
        <Route path="/health_monitoring" element={<HealthMonitoring />} />
        <Route path="/my_appointments" element={<MyAppointments />} />
        <Route path="/reports_to_review" element={<ReportsToReview />} />
        <Route path="/user_management" element={<UserManagement />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/membership_plans" element={<MembershipPlans />} />
        <Route path="/support" element={<Support />} />
        <Route path="/view_patient_details" element={<ViewPatientDetails />} />
        <Route path="/doctor_form" element={<DoctorForm />} />
      </Routes>
    </Router>
  );
}

export default App;
