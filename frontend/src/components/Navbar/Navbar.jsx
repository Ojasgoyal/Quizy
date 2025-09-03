import React from "react";
import ThemeToggle from "../../ThemeToggle";

export default function Navbar() {
  const links = [
    { title: "Play", href: "/play" },
    { title: "Signup", href: "/signup" },
    { title: "Login", href: "/login" },
  ];

  return (
    <>
      <div className="navbar max-w-7xl mx-auto px-6 py-0 bg-transparent shadow-sm ">
        <div className="navbar-start text-3xl font-bold">Quizy</div>
        <div className="navbar-end">
          <ul className="flex items-center gap-5 md:gap-10">
            {links.map((link) => (
              <li key={link.href}>
                <a className="text-xs md:text-sm font-semibold" href={link.href}>{link.title}</a>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
