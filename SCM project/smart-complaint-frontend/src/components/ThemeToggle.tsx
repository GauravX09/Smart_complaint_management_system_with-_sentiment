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
      className="p-2 rounded-md bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30"
    >
      {theme === "dark" ? (
        <FaSun className="text-yellow-400 text-xl" />
      ) : (
        <FaMoon className="text-gray-200 text-xl" />
      )}
    </button>
  );
};

export default ThemeToggle;
