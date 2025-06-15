import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, CloudSun } from "lucide-react";
import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/favorites", label: "Favorites" },
  { to: "/history", label: "History" },
];

export default function Navbar({ onLogout, user }) {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle dark mode
  const toggleDark = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-300 dark:bg-slate-700/80 backdrop-blur-md border-b border-border shadow-lg transition-all">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-primary hover:text-blue-600 transition-colors"
        >
          <CloudSun className="w-7 h-7 text-yellow-400 drop-shadow" />
          Weathere
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-full font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-blue-300 shadow"
                    : "hover:bg-blue-50 dark:hover:bg-zinc-800/60 hover:text-blue-600 dark:hover:text-blue-300 text-zinc-700 dark:text-zinc-200"
                }
                group`
              }
            >
              <span className="relative z-10">{link.label}</span>
              <span
                className={`absolute left-4 right-4 bottom-1 h-0.5 rounded bg-blue-400 transition-all duration-300 scale-x-0 group-hover:scale-x-100 ${
                  window.location.pathname === link.to ? "scale-x-100" : ""
                }`}
              />
            </NavLink>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="hover:bg-blue-100 dark:hover:bg-zinc-800 transition"
          >
            {dark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-500" />
            )}
          </Button>
          <ProfileDropdown user={user} onLogout={handleLogout} />
    
          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-2 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-zinc-800 transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6 text-blue-500 dark:text-blue-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-border shadow-lg px-4 py-2">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-blue-300 shadow"
                      : "hover:bg-blue-50 dark:hover:bg-zinc-800/60 hover:text-blue-600 dark:hover:text-blue-300 text-zinc-700 dark:text-zinc-200"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}