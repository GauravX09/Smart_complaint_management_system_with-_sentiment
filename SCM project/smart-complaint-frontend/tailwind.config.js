/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ REQUIRED FOR DARK MODE

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          50: "#EEF2FF",
          100: "#EDEBFF",
          200: "#D6DBFF",
          300: "#B8B8FF",
          400: "#8F86FF",
          500: "#4F46E5",
          600: "#3E3BD6",
        },
        accent: {
          DEFAULT: "#06B6D4",
        },
        success: "#22C55E",
        warning: "#FACC15",
        softbg: "#F3F4F6",
        cardshadow: "rgba(15, 23, 42, 0.06)",
      },

      boxShadow: {
        "soft-lg": "0 10px 30px rgba(15,23,42,0.06)",
        "glow-indigo": "0 8px 30px rgba(79,70,229,0.12)",
      },

      borderRadius: {
        "xl-2": "1rem",
        "round-3xl": "1.5rem",
      },
    },
  },

  plugins: [],
};
