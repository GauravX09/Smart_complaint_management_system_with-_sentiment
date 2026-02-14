// src/components/Button.tsx
import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "danger" | "default";
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = "default" }) => {
  let colorClass = "";

  switch (variant) {
    case "primary":
      colorClass = "bg-blue-600 hover:bg-blue-700 text-white";
      break;
    case "danger":
      colorClass = "bg-red-600 hover:bg-red-700 text-white";
      break;
    default:
      colorClass = "bg-gray-200 hover:bg-gray-300 text-black";
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold shadow transition ${colorClass}`}
    >
      {label}
    </motion.button>
  );
};

export default Button;
