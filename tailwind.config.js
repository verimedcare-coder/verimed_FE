/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  // CRITICAL: Disable preflight so Tailwind does NOT alter or reset existing Ant Design table/modal/heading styling
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        verimed: {
          goldLight: "#F0C330",
          goldDark: "#B78520",
          headerBg: "#282c34",
          cyanLink: "#61dafb",
          darkText: "#1F2937",
          lightGray: "#F9FAFB",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
