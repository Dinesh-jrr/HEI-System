import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
    >
      <div className="relative w-6 h-6">
        <SunIcon
          className={`absolute inset-0 h-6 w-6 text-yellow-400 transform transition-all duration-500 ${
            darkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
          }`}
        />
        <MoonIcon
          className={`absolute inset-0 h-6 w-6 text-gray-200 transform transition-all duration-500 ${
            darkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        />
      </div>
    </button>
  );
}
