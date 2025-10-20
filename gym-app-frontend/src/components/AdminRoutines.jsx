import React, { useEffect, useState } from "react";
import { getRoutines, addRoutine, updateRoutine, deleteRoutine } from "../firebaseAds";
import { useLoader } from "../context/LoaderContext";

export default function AdminRoutines() {
  const { showLoader, hideLoader } = useLoader();
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({ title: "", description: "", image: "" });

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    showLoader();
    const data = await getRoutines();
    setRoutines(data);
    hideLoader();
  };

  const handleAdd = async () => {
    if (!newRoutine.title || !newRoutine.description) return alert("Title and description required");
    showLoader();
    await addRoutine(newRoutine);
    setNewRoutine({ title: "", description: "", image: "" });
    await fetchRoutines();
  };

  const handleUpdate = async (id, updated) => {
    showLoader();
    await updateRoutine(id, updated);
    await fetchRoutines();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this routine?")) return;
    showLoader();
    await deleteRoutine(id);
    await fetchRoutines();
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400">Admin Routines</h2>

      {/* Add new routine */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-10">
        <h3 className="text-xl font-semibold mb-4">Add New Routine</h3>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            type="text"
            placeholder="Title"
            className="p-2 rounded-lg bg-gray-700 text-white"
            value={newRoutine.title}
            onChange={(e) => setNewRoutine({ ...newRoutine, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="p-2 rounded-lg bg-gray-700 text-white"
            rows={3}
            value={newRoutine.description}
            onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Guide Url"
            className="p-2 rounded-lg bg-gray-700 text-white"
            value={newRoutine.image}
            onChange={(e) => setNewRoutine({ ...newRoutine, image: e.target.value })}
          />
        </div>

        <div>
          <button
            onClick={handleAdd}
            className="bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-lg hover:scale-105 transition"
          >
            Add Routine
          </button>
        </div>
      </div>

      {/* Existing routines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((r) => (
          <div
            key={r.id}
            className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl border border-slate-200 flex flex-col"
          >
            <input
              type="text"
              value={r.title}
              onChange={(e) => handleUpdate(r.id, { ...r, title: e.target.value })}
              className="text-2xl font-semibold mb-2 w-full bg-transparent border-b border-gray-300 focus:outline-none"
            />
            <textarea
              value={r.description}
              onChange={(e) => handleUpdate(r.id, { ...r, description: e.target.value })}
              className="mb-4 w-full bg-transparent border-b border-gray-300 focus:outline-none"
              rows={3}
            />
            <input
              type="text"
              value={r.image}
              onChange={(e) => handleUpdate(r.id, { ...r, image: e.target.value })}
              className="mb-4 w-full bg-transparent border-b border-gray-300 focus:outline-none"
            />
            {r.image && (
              <img
                src={r.image}
                alt={r.title}
                className="w-full h-48 object-cover rounded-lg border border-gray-200 mb-4"
              />
            )}

            <button
              onClick={() => handleDelete(r.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg self-start"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
