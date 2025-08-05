import { useEffect, useState } from "react";

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
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-pressed={darkMode}
        onClick={toggleDarkMode}
        className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          darkMode ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform ${
            darkMode ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>

      <span className="select-none text-gray-900 dark:text-gray-100 font-medium">
        {darkMode ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}
