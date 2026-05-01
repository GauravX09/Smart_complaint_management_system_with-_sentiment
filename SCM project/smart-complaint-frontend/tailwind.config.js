/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ================= COLORS ================= */
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

        accent: "#06B6D4",
        success: "#22C55E",
        warning: "#FACC15",
        danger: "#EF4444",

        /* 🔥 UI SYSTEM COLORS */
        surface: "#FFFFFF",
        background: "#F9FAFB",
        muted: "#6B7280",
      },

      /* ================= SHADOW SYSTEM ================= */
      boxShadow: {
        "soft-sm": "0 2px 8px rgba(15,23,42,0.04)",
        "soft-md": "0 6px 18px rgba(15,23,42,0.06)",
        "soft-lg": "0 10px 30px rgba(15,23,42,0.08)",
        "glow-indigo": "0 8px 30px rgba(79,70,229,0.12)",
      },

      /* ================= BORDER RADIUS ================= */
      borderRadius: {
        "xl-2": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      /* ================= TRANSITIONS ================= */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        250: "250ms",
        350: "350ms",
      },

      /* ================= ANIMATIONS ================= */
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        scaleIn: "scaleIn 0.25s ease-out",
      },
    },
  },

  plugins: [],
};