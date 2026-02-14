import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const useDarkMode = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () => {
    setTheme((prev: Theme) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggle };
};

export default useDarkMode;
