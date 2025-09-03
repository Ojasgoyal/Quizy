import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const darkTheme = "night"
  const lightTheme = "corporate"
  const [theme, setTheme] = useState(localStorage.getItem("theme") || darkTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  return (
    <button className="btn btn-sm" onClick={toggleTheme}>
      {theme === darkTheme ? <Sun size={20}/> : <Moon size={20}/>}
    </button>
  );
}
