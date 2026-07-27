import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

// Dashboard Screens
import Overview from "../screens/dashboard/Overview";
import DailyReports from "../screens/dashboard/DailyReports";
import HealthMonitoring from "../screens/dashboard/HealthMonitoring";

// Appointments Screens
import Appointments from "../screens/appointments/Appointments";
import MyAppointments from "../screens/appointments/MyAppointments";
import DoctorForm from "../screens/appointments/DoctorForm";

// Patients Screens
import MyPatients from "../screens/patients/MyPatients";
import ViewPatientDetails from "../screens/patients/ViewPatientDetails";

// Family Screens
import MyLovedOnes from "../screens/family/MyLovedOnes";
import MyCareTaker from "../screens/family/MyCareTaker";
import CareTeam from "../screens/family/CareTeam";

// Billing Screens
import BillingAndMembership from "../screens/billing/BillingAndMembership";
import MembershipPlans from "../screens/billing/MembershipPlans";

// Messages & Reports Screens
import Messages from "../screens/messages/Messages";
import MyReports from "../screens/messages/MyReports";
import ReportsToReview from "../screens/messages/ReportsToReview";
import Support from "../screens/messages/Support";

// Admin Screens
import UserManagement from "../screens/admin/UserManagement";
import Departments from "../screens/admin/Departments";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

      {/* Protected Routes (Require Authentication) */}
      <Route element={<ProtectedRoute />}>
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
        <Route path="/departments" element={<Departments />} />
        <Route path="/membership_plans" element={<MembershipPlans />} />
        <Route path="/support" element={<Support />} />
        <Route path="/view_patient_details" element={<ViewPatientDetails />} />
        <Route path="/doctor_form" element={<DoctorForm />} />
        <Route path="/user_management" element={<UserManagement />} />

        {/* Admin Only Protected Routes */}
        <Route element={<RoleRoute requireAdmin />}></Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

// last update: 27/07/2026, 09:46PM
