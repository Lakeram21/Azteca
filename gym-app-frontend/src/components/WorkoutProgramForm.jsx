// components/WorkoutProgramForm.jsx
import React, { useState } from "react";
import axios from "axios";

export default function WorkoutProgramForm({ user, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]);

  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddExercise = () => {
    if (!exerciseName.trim()) return;

    setExercises([
      ...exercises,
      {
        name: exerciseName.trim(),
        sets: Number(sets) || 0,
        reps: Number(reps) || 0,
        notes: notes.trim(),
      },
    ]);

    setExerciseName("");
    setSets("");
    setReps("");
    setNotes("");
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdAt = new Date().toISOString();
      const res = await axios.post("http://localhost:5001/workout-programs", {
        userId: user.id,
        name,
        description,
        exercises,
        createdBy: user.id,
        createdAt,
      });

      onCreated(res.data);
      setName("");
      setDescription("");
      setExercises([]);
    } catch (err) {
      console.error("Failed to create program:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg mb-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">New Workout Program</h2>

      {/* Program Info */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Program Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Add Exercise */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Add Exercise:</label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          <input
            type="text"
            placeholder="Exercise Name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <button
          type="button"
          onClick={handleAddExercise}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold mb-2"
        >
          Add Exercise
        </button>

        {exercises.length > 0 && (
          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded p-2 custom-scrollbar">
            <ul className="space-y-1">
              {exercises.map((ex, idx) => (
                <li key={idx} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                  <span>{`${ex.name} - Sets: ${ex.sets}, Reps: ${ex.reps}${ex.notes ? `, Notes: ${ex.notes}` : ""}`}</span>
                  <button
                    type="button"
                    className="text-red-500 font-bold ml-2 hover:text-red-400"
                    onClick={() => handleRemoveExercise(idx)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
      >
        Add Program
      </button>

      {/* Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #facc15;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #eab308;
        }
      `}</style>
    </form>
  );
}
