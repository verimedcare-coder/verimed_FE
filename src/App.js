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
      </Routes>
    </Router>
  );
}

export default App;
