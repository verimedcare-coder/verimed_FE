import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Auth Screens (eager loaded for instant first paint)
import LoginScreen from "../screens/auth/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

// Lazy-loaded Dashboard Screens (avoids heavy chart bundles on initial login screen)
const Overview = lazy(() => import("../screens/dashboard/Overview"));
const DailyReports = lazy(() => import("../screens/dashboard/DailyReports"));
const HealthMonitoring = lazy(() => import("../screens/dashboard/HealthMonitoring"));

// Appointments Screens
const Appointments = lazy(() => import("../screens/appointments/Appointments"));
const MyAppointments = lazy(() => import("../screens/appointments/MyAppointments"));
const DoctorForm = lazy(() => import("../screens/appointments/DoctorForm"));

// Patients Screens
const MyPatients = lazy(() => import("../screens/patients/MyPatients"));
const ViewPatientDetails = lazy(() => import("../screens/patients/ViewPatientDetails"));

// Family Screens
const MyLovedOnes = lazy(() => import("../screens/family/MyLovedOnes"));
const MyCareTaker = lazy(() => import("../screens/family/MyCareTaker"));
const CareTeam = lazy(() => import("../screens/family/CareTeam"));

// Billing Screens
const BillingAndMembership = lazy(() => import("../screens/billing/BillingAndMembership"));
const MembershipPlans = lazy(() => import("../screens/billing/MembershipPlans"));

// Messages & Reports Screens
const Messages = lazy(() => import("../screens/messages/Messages"));
const MyReports = lazy(() => import("../screens/messages/MyReports"));
const ReportsToReview = lazy(() => import("../screens/messages/ReportsToReview"));
const Support = lazy(() => import("../screens/messages/Support"));

// Admin Screens
const UserManagement = lazy(() => import("../screens/admin/UserManagement"));
const Departments = lazy(() => import("../screens/admin/Departments"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      }
    >
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
    </Suspense>
  );
};

export default AppRoutes;
