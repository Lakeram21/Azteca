import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Profile({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
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
      const res = await axios.put(`http://localhost:5001/users/${user.id}`, formData);
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-white mt-10">
        Please log in to see your profile.
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
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Your Profile</h2>

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
            <label className="block mb-1 font-semibold text-gray-200">Name</label>
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
            <label className="block mb-1 font-semibold text-gray-200">Email (cannot change)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border border-gray-600 px-4 py-2 rounded bg-gray-700 text-gray-300 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-200">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-600 px-4 py-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-200">
              Password (leave blank to keep)
            </label>
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
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
