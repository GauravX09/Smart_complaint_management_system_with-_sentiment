import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

interface ThemeToggleProps {
  theme: string;
  toggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="
        flex items-center justify-center
        w-10 h-10
        rounded-lg
        border border-gray-200
        bg-white
        hover:bg-gray-100
        transition
        dark:bg-gray-900
        dark:border-gray-700
        dark:hover:bg-gray-800
      "
    >
      {theme === "dark" ? (
        <FaSun className="text-yellow-400 text-lg" />
      ) : (
        <FaMoon className="text-gray-600 text-lg dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;