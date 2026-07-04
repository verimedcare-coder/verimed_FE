import React from "react";

export default function BannerIllustration() {
  return (
    <svg
      width="320"
      height="220"
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "relative",
        top: "10px",
        filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15))",
      }}
    >
      {/* Background Glow */}
      <circle cx="160" cy="110" r="95" fill="url(#bgGlow)" opacity="0.6" />
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#004C91" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F0F8FF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#007F5F" />
          <stop offset="100%" stopColor="#004C91" />
        </linearGradient>
      </defs>

      {/* Main Tablet / Video Call Frame */}
      <rect
        x="40"
        y="25"
        width="240"
        height="160"
        rx="16"
        fill="url(#screenGrad)"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      <rect x="50" y="35" width="220" height="120" rx="10" fill="#003366" />

      {/* Video Call Doctor Avatar inside Screen */}
      <circle cx="160" cy="85" r="32" fill="#007F5F" />
      <circle cx="160" cy="78" r="14" fill="#E0F7FA" />
      <path
        d="M138 112 C138 98, 182 98, 182 112 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Medical Cross on Doctor's Coat */}
      <rect x="157" y="102" width="6" height="14" fill="#FF4545" rx="1" />
      <rect x="153" y="106" width="14" height="6" fill="#FF4545" rx="1" />

      {/* Stethoscope Arc */}
      <path
        d="M148 85 Q160 105 172 85"
        stroke="#A0E6FF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Screen Header / Status Bar */}
      <circle cx="65" cy="48" r="4" fill="#FF5252" />
      <circle cx="77" cy="48" r="4" fill="#FFB142" />
      <circle cx="89" cy="48" r="4" fill="#2ED573" />
      <text
        x="135"
        y="51"
        fill="#FFFFFF"
        fontSize="10"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        Live Consultation
      </text>

      {/* Call Control Buttons at bottom of screen */}
      <rect x="110" y="130" width="24" height="16" rx="8" fill="#FF4545" />
      <rect x="148" y="130" width="24" height="16" rx="8" fill="#2ED573" />
      <rect x="186" y="130" width="24" height="16" rx="8" fill="#1E90FF" />

      {/* Floating Card 1: Heart Rate / Pulse */}
      <g transform="translate(15, 60)">
        <rect
          x="0"
          y="0"
          width="75"
          height="45"
          rx="10"
          fill="#FFFFFF"
          stroke="#E0E0E0"
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
        />
        <path
          d="M10 25 L20 25 L25 15 L32 35 L38 20 L44 25 L65 25"
          stroke="#FF4545"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="10"
          y="12"
          fill="#555"
          fontSize="8"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          Vitals: Normal
        </text>
      </g>

      {/* Floating Card 2: Verified Badge */}
      <g transform="translate(230, 115)">
        <rect
          x="0"
          y="0"
          width="80"
          height="45"
          rx="10"
          fill="url(#cardGrad)"
          style={{ filter: "drop-shadow(0 6px 12px rgba(0,127,95,0.3))" }}
        />
        <circle cx="20" cy="22" r="10" fill="#FFFFFF" />
        <path
          d="M15 22 L19 26 L26 18"
          stroke="#007F5F"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <text
          x="36"
          y="20"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          Verified
        </text>
        <text
          x="36"
          y="31"
          fill="#E0F7FA"
          fontSize="7"
          fontFamily="sans-serif"
        >
          Specialists
        </text>
      </g>

      {/* Floating Chat Bubble */}
      <g transform="translate(225, 25)">
        <rect
          x="0"
          y="0"
          width="65"
          height="32"
          rx="8"
          fill="#004C91"
          style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
        />
        <text
          x="10"
          y="18"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="500"
          fontFamily="sans-serif"
        >
          💬 24/7 Care
        </text>
      </g>

      {/* Base Stand */}
      <path d="M120 185 L200 185 L210 195 L110 195 Z" fill="#B0C4DE" />
      <rect x="140" y="185" width="40" height="4" fill="#8A9BA8" />
    </svg>
  );
}
