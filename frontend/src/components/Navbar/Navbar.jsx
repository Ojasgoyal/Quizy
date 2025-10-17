import { Link } from "react-router-dom";
import ThemeToggle from "../../ThemeToggle";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function Navbar({ theme, setTheme }) {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <div className="navbar max-w-7xl mx-auto px-6 py-0 bg-transparent shadow-sm ">
        <div className="navbar-start text-3xl font-bold">
          <Link to="/">Quizy</Link>
        </div>
        <div className="navbar-end">
          <ul className="flex items-center gap-2 md:gap-5">
            <li key="nav-play">
              <Link className="text-xs md:text-sm font-semibold" to="/play">
                Play
              </Link>
            </li>
            {!isSignedIn && (
              <>
                <li key="nav-signup">
                  <Link
                    className="text-xs md:text-sm font-semibold"
                    to="/signup"
                  >
                    Signup
                  </Link>
                </li>
                <li key="nav-login">
                  <Link
                    className="text-xs md:text-sm font-semibold"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
            {isSignedIn && (
              <>
                <li key="nav-create">
                  <Link
                    className="text-xs md:text-sm font-semibold"
                    to="/create"
                  >
                    Create
                  </Link>
                </li>
                <li key="nav-dashboard">
                  <Link
                    className="text-xs md:text-sm font-semibold"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li key="nav-user" class="flex items-end ">
                  <UserButton />
                </li>
              </>
            )}
            <li>
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
