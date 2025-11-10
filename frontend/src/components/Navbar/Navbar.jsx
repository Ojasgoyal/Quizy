import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "../../ThemeToggle";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function Navbar({ theme, setTheme }) {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const navClass =
    "relative text-xs md:text-sm font-semibold after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-px after:bg-current after:rounded-full after:w-0 after:opacity-0 after:transition-all after:duration-300 after:ease-out";
  const activeUnderline = "after:w-full after:opacity-100";

  return (
    <>
      <div className="navbar max-w-7xl mx-auto pl-5 pr-10 py-0 bg-transparent shadow-sm ">
        <div className="navbar-start text-3xl font-bold">
          <Link to="/">Quizy</Link>
        </div>
        <div className="navbar-end">
          <ul className="flex items-center gap-2 md:gap-10">
            <li>
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </li>
            {!isSignedIn && (
              <>
                <li key="nav-signup">
                  <NavLink
                    to="/signup"
                    end
                    className={({ isActive }) =>
                      `${navClass} ${isActive ? activeUnderline : ""}`
                    }
                  >
                    Signup
                  </NavLink>
                </li>
                <li key="nav-login">
                  <NavLink
                    to="/login"
                    end
                    className={({ isActive }) =>
                      `${navClass} ${isActive ? activeUnderline : ""}`
                    }
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
            {isSignedIn && (
              <>
            <li key="nav-play">
              <NavLink
                to="/results"
                end
                className={({ isActive }) =>
                  `${navClass} ${isActive ? activeUnderline : ""}`
                }
              >
                Results
              </NavLink>
            </li>
                <li key="nav-dashboard">
                  <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                      `${navClass} ${isActive ? activeUnderline : ""}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li key="nav-user" className="flex items-end ">
                  <UserButton />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
