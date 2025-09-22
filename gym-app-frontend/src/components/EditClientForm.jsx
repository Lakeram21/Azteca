import React, { useState } from "react";
import axios from "axios";

export default function EditClientForm({ client, onClose }) {
  const [formData, setFormData] = useState({ ...client });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/clients/${client.id}`, formData);
      setMessage("Client updated successfully!");
      setTimeout(onClose, 1000); // Auto-close after 1 second
    } catch (err) {
      console.error("Failed to update client", err);
      setMessage("Failed to update client");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0  backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="relative bg-gray-900 text-white rounded-2xl shadow-2xl p-6 w-96 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-red-500 font-bold text-xl hover:scale-110 transition-transform"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-extrabold mb-4 text-yellow-400 text-center">
          Edit Client
        </h2>

        {message && (
          <p className="text-green-400 font-semibold mb-3 text-center">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-gray-300 font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300 font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
            />
          </div>

          {/* Add other fields here with same style */}

          <div className="flex justify-between mt-4 gap-2">
            <button
              type="submit"
              className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full w-full hover:scale-105 transition-transform"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 text-white px-4 py-2 rounded-full w-full hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
