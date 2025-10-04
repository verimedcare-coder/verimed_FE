import React, { useState } from "react";
import LoginBg from "../assets/images/loginBg.jpg";
import VerimedLogo from "../assets/icons/VerimedLogo.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    let userData = null;

    if (email === "admin@verimed.com" && password === "Admin@123") {
      userData = {
        email,
        type: "admin",
      };
      window.location.href = "/overview";
    } else if (email === "sponsor@verimed.com" && password === "Sponsor@123") {
      userData = {
        email,
        type: "sponsor",
      };
      window.location.href = "/overview";
    } else if (email === "patient@verimed.com" && password === "Patient@123") {
      userData = {
        email,
        type: "patient",
      };
      window.location.href = "/overview";
    } else if (email === "care@verimed.com" && password === "Care@123") {
      userData = {
        email,
        type: "care",
      };
      window.location.href = "/overview";
    } else if (email === "doctor@verimed.com" && password === "Doctor@123") {
      userData = {
        email,
        type: "doctor",
      };
      window.location.href = "/overview";
    } else {
      alert("Invalid credentials. Please try again.");
    }

    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Section */}
      <div style={{ display: "flex", width: "50%", position: "relative" }}>
        <img
          src={LoginBg}
          alt="Doctor and patient"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            color: "white",
            maxWidth: "80%",
          }}
        >
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Welcome to Verimed!
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: "1.5",
              fontWeight: 400,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate
            ut laoreet velit ma.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9f9f9",
          padding: "40px 40px",
        }}
      >
        {/* Logo at the top */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={VerimedLogo}
            alt="Verimed Logo"
            style={{
              width: 140,
            }}
          />
        </div>

        {/* Centered Form */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFFFFF",
            border: "1px solid #E7E8EB",
            borderRadius: 8,
          }}
        >
          <div style={{ width: "100%", maxWidth: 400 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Sign In
            </h2>
            <p
              style={{
                color: "#666",
                marginBottom: 30,
              }}
            >
              Please enter below details to access the dashboard
            </p>

            <form onSubmit={onSubmit}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Email Address"
                style={{
                  width: "93%",
                  padding: 12,
                  marginBottom: 20,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 14,
                }}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  style={{
                    width: "93%",
                    padding: 12,
                    marginBottom: 20,
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 10,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 30,
                  fontSize: 14,
                }}
              >
                <label
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <input type="checkbox" />
                  Remember Me
                </label>
                <a
                  href="#"
                  style={{
                    color: "red",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: 14,
                  background: "linear-gradient(to right, #f1c40f, #d4a017)",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Footer at the bottom */}
        <footer
          style={{
            fontSize: 12,
            color: "#888",
            textAlign: "center",
            paddingTop: 20,
          }}
        >
          © 2025 Verimed — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
