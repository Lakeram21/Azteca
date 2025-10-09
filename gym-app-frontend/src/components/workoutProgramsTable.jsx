import React, { useEffect, useState } from "react";
import { getWorkouts } from "../firebaseWorkouts";
import WorkoutProgramForm from "./WorkoutProgramForm";
import { getAllUsers } from "../firebaseUsers"; // assuming you have this helper
import { assignWorkout } from "../firebaseWorkouts";


export default function WorkoutProgramsTable({ user }) {
  const [programs, setPrograms] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [assignClients, setAssignClients] = useState([]);
  const [editWorkout, setEditWorkout] = useState(null);

  const fetchPrograms = async () => {
    try {
      const data = await getWorkouts(user.id);
      setPrograms(data);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    }
  };

  const fetchClients = async () => {
    try {
      const users = await getAllUsers();
      setClients(users);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchClients();
  }, []);

  const handleAssignClick = (program) => {
    setSelectedProgram(program);
    setAssignClients([]);
  };

  const toggleClientSelection = (id) => {
    setAssignClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleAssignSubmit = async () => {
  if (assignClients.length === 0) return alert("Select at least one client!");
  try {
    await assignWorkout(selectedProgram.id, assignClients, user.id);
    alert(`Assigned "${selectedProgram.name}" to clients: ${assignClients.join(", ")}`);
    setSelectedProgram(null);
  } catch (err) {
    console.error("Failed to assign program", err);
  }
};

  return (
    <div className="bg-gray-900 text-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-extrabold mb-4 text-yellow-400">Current Programs</h2>

      {/* Render Edit Form */}
      {editWorkout && (
        <WorkoutProgramForm
          user={user}
          workoutToEdit={editWorkout}
          onCreated={(updatedWorkout) => {
            fetchPrograms();
            setEditWorkout(null);
          }}
        />
      )}

      {programs.length === 0 ? (
        <p className="text-gray-400">No programs found.</p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {programs.map((p) => (
            <div
              key={p.id}
              className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition-all duration-150 relative"
            >
              {/* Buttons top-right */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setEditWorkout(p)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded font-semibold text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => console.log("Delete TODO")}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAssignClick(p)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded font-semibold text-sm"
                >
                  Assign
                </button>
              </div>

              <h3 className="text-lg font-bold text-yellow-300">{p.name}</h3>
              <p className="text-gray-300 mt-1">{p.description}</p>

              <div className="mt-3">
                <span className="font-semibold text-yellow-400">Exercises:</span>
                <ul className="ml-4 mt-1 list-disc text-gray-200">
                  {p.exercises.map((e, idx) => (
                    <li key={idx}>
                      {e.name} — {e.sets} sets of {e.reps} reps
                      {e.link && (
                        <p className="text-gray-400 text-sm">
            Link:{" "}
            <a
              href={e.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline hover:text-yellow-300"
            >
              {e.link.length > 40 ? e.link.slice(0, 37) + "..." : e.link}
            </a>
          </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">
              Assign "{selectedProgram.name}" to clients
            </h3>
            <div className="max-h-48 overflow-y-auto border border-gray-700 p-2 rounded mb-4 custom-scrollbar">
              {clients.map((c) => (
                <label key={c.id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={assignClients.includes(c.id)}
                    onChange={() => toggleClientSelection(c.id)}
                    className="accent-yellow-400"
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #facc15; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #eab308; }
      `}</style>
    </div>
  );
}
