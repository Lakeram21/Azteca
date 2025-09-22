import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-700";

  const buttonClasses = "px-4 py-2 rounded-lg font-semibold transition-transform duration-200 transform hover:scale-105 shadow-md";

  return (
    <nav className="bg-gray-900 text-gray-100 px-6 py-4 flex justify-between items-center shadow-lg">
      
      {/* Logo / Brand */}
      <div className="text-2xl font-bold tracking-wide text-white">
        <Link to ="/">
         <span className="text-yellow-400">Azteca</span>Gym
        </Link>
       
      </div>
      
      {/* Links / Actions */}
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className={navLinkClasses}>
          Dashboard
        </Link>
        <Link to="/profile" className={navLinkClasses}>
          Profile
        </Link>

        {user ? (
          <button
            onClick={handleSignOut}
            className={`${buttonClasses} bg-red-600 hover:bg-red-700 text-white`}
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/login"
            className={`${buttonClasses} bg-blue-600 hover:bg-blue-700 text-white`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
