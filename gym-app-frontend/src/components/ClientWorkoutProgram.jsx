import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"
export default function ClientWorkoutProgramsTable({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null); // For modal

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/assign-program/${user.id}`
        );
        console.log("Fetched assignments:", res.data);
        setAssignments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      }
    };

    fetchAssignments();
  }, [user.id]);

  const renderProgress = (progress) => {
    if (!Array.isArray(progress) || progress.length === 0) return "No progress yet";
    const completed = progress.filter((p) => p.completed).length;
    const total = progress.length;
    const percentage = Math.round((completed / total) * 100);

    return (
      <div className="w-full bg-gray-700 rounded-full h-3 mt-1">
        <div
          className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="bg-gray-800 border-yellow-400 p-4 rounded-xl">
      {assignments.length === 0 ? (
        <div className="bg-gray-700 p-4 rounded-xl text-gray-200">
          <p>No assigned programs found.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-yellow-400">
                  {a.workout?.name || `Program ${a.programId}`}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    a.status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-gray-600 text-gray-200"
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <p>
                <strong>Progress:</strong>
              </p>
              {renderProgress(a.progress)}

              <p className="mt-2 text-gray-300 text-sm">
                <strong>Created By:</strong> {a.createdBy} |{" "}
                <strong>Created At:</strong>{" "}
                {new Date(a.createdAt).toLocaleString()}
              </p>

              <button
                onClick={() => setSelectedAssignment(a)}
                className="mt-3 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
              >
                View Workout
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full p-6 relative shadow-lg">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-yellow-400 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              {selectedAssignment.workout?.name || `Program ${selectedAssignment.programId}`}
            </h2>
            <p className="text-gray-300 mb-4">
              {selectedAssignment.workout?.description}
            </p>

            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Exercises:</h3>
            <ul className="space-y-2">
              {selectedAssignment.workout?.exercises?.map((ex, idx) => (
                <li
                  key={idx}
                  className="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-400"
                >
                  <p className="font-semibold">{ex.name}</p>
                  <p>
                    Sets: {ex.sets} | Reps: {ex.reps}{" "}
                    {ex.weight ? `| Weight: ${ex.weight}` : ""}
                  </p>
                  {ex.notes && <p className="text-gray-400 text-sm">Notes: {ex.notes}</p>}
                  {ex.link && <p className="text-gray-400 text-sm"><a
      href={ex.link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-yellow-400 underline hover:text-yellow-300"
    >
      {ex.link}
    </a></p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
