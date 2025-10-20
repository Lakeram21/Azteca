import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const t = (en, es) => (language === "en" ? en : es);

  const navLinkClasses =
    "block px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-700";

  const buttonClasses =
    "block px-4 py-2 rounded-lg font-semibold transition-transform duration-200 transform hover:scale-105 shadow-md";

  return (
    <nav className="bg-gray-900 text-gray-100 px-4 sm:px-6 py-3 flex flex-wrap sm:flex-nowrap justify-between items-center shadow-lg sticky top-0 z-50">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold tracking-wide text-white flex items-center justify-between w-full sm:w-auto">
        <Link to="/">
          <span className="text-yellow-400">Azteca</span>Gym
        </Link>

        {/* Hamburger Menu Button for Mobile */}
        <button
          className="sm:hidden ml-2 text-gray-200 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Links / Actions */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } w-full sm:flex sm:w-auto sm:items-center sm:space-x-4 mt-3 sm:mt-0`}
      >
        <Link to="/dashboard" className={navLinkClasses}>
          {t("Dashboard", "Panel")}
        </Link>
        <Link to="/profile" className={navLinkClasses}>
          {t("Profile", "Perfil")}
        </Link>

        {user ? (
          <button
            onClick={handleSignOut}
            className={`${buttonClasses} bg-red-600 hover:bg-red-700 text-white mt-2 sm:mt-0`}
          >
            {t("Sign Out", "Cerrar Sesión")}
          </button>
        ) : (
          <Link
            to="/login"
            className={`${buttonClasses} bg-blue-600 hover:bg-blue-700 text-white mt-2 sm:mt-0`}
          >
            {t("Login", "Iniciar Sesión")}
          </Link>
        )}

        {/* 🌐 Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="ml-4 bg-yellow-500 text-gray-900 px-3 py-1 mt-2 rounded-lg font-bold"
        >
          {language === "en" ? "ES" : "EN"}
        </button>
      </div>
    </nav>
  );
}
