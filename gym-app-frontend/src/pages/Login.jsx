import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseSignup, firebaseSignin } from "../firebaseAuth";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login({ setUser }) {
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userData;

      if (isSignup) {
        userData = await firebaseSignup(email, password, name);
      } else {
        userData = await firebaseSignin(email, password);
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || t("Firebase error", "Error de Firebase"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-2xl rounded-2xl p-8 w-96 flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 tracking-wide">
          {isSignup ? t("Sign Up", "Registrarse") : t("Login", "Iniciar Sesión")}
        </h2>

        {isSignup && (
          <input
            type="text"
            placeholder={t("Full Name", "Nombre Completo")}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder={t("Email", "Correo Electrónico")}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t("Password", "Contraseña")}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition duration-200 mb-4"
        >
          {isSignup ? t("Sign Up", "Registrarse") : t("Login", "Iniciar Sesión")}
        </button>

        <p
          className="text-gray-300 text-sm cursor-pointer hover:text-yellow-400 transition"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? t("Already have an account? Login", "¿Ya tienes cuenta? Iniciar Sesión")
            : t("Don't have an account? Sign Up", "¿No tienes cuenta? Registrarse")}
        </p>
      </form>
    </div>
  );
}
