import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SponserScreen from "./screens/SponserScreen";
import LoginScreen from "./screens/LoginScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/sponseroverview" element={<SponserScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
