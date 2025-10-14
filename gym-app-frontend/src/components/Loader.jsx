// src/components/Loader.js
import React from "react";
import { useLoader } from "../context/LoaderContext";

export default function Loader() {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
        <p className="text-white font-semibold">Loading...</p>
      </div>
      <style>{`
        .loader {
          border-top-color: #facc15; /* yellow spinner */
        }
      `}</style>
    </div>
  );
}
