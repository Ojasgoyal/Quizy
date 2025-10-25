import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme: propTheme, setTheme: propSetTheme }) {
  const darkTheme = "night"
  const lightTheme = "corporate"

  const [internalTheme, setInternalTheme] = useState(
    localStorage.getItem("theme") || darkTheme
  );

  const theme = propTheme ?? internalTheme;
  const setTheme = propSetTheme ?? setInternalTheme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };


  return (
    <button className="btn btn-xs btn-accent" onClick={toggleTheme}>
      {theme === darkTheme ? <Sun size={15}/> : <Moon size={15}/>}
    </button>
  );
}
