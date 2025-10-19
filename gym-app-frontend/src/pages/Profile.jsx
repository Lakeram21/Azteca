import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { updateUserProfile } from "../firebaseUsers";

export default function Profile({ user, setUser }) {
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    password: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        password: ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { name, email, phone, currentPassword, password } = formData;

      await updateUserProfile(user.uid, { name, email, phone, password }, currentPassword);

      setMessage({ text: t("Profile updated successfully!", "¡Perfil actualizado con éxito!"), type: "success" });

      setUser({ ...user, name, email, phone });
      setFormData({ ...formData, password: "", currentPassword: "" });

    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || t("Failed to update profile.", "Error al actualizar el perfil."), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-white mt-10">
        {t("Please log in to see your profile.", "Por favor, inicia sesión para ver tu perfil.")}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/profile_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="max-w-3xl w-full p-6 bg-black/80 shadow-xl rounded-2xl border-l-4 border-yellow-400">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          {t("Your Profile", "Tu Perfil")}
        </h2>

        {message.text && (
          <div
            className={`mb-4 px-4 py-2 rounded text-center ${
              message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-gray-200">{t("Name", "Nombre")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-600 px-4 py-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-200">{t("Email", "Correo electrónico")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border border-gray-600 px-4 py-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-200">{t("Phone", "Teléfono")}</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-600 px-4 py-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-200">{t("Current Password (required for email/password changes)", "Contraseña actual (requerida para cambios de correo/contraseña)")}</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full border border-gray-600 px-4 py-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-200">{t("New Password (leave blank to keep)", "Nueva contraseña (deja en blanco para mantenerla)")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-600 px-4 py-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"
            } transition-all duration-200`}
          >
            {loading ? t("Updating...", "Actualizando...") : t("Update Profile", "Actualizar Perfil")}
          </button>
        </form>
      </div>
    </div>
  );
}
