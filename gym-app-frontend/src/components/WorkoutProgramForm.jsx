import React, { useState } from "react";
import { createWorkout, editWorkout } from "../firebaseWorkouts";
import { useLanguage } from "../context/LanguageContext";
import { useLoader } from "../context/LoaderContext";
export default function WorkoutProgramForm({ user, workoutToEdit, onCreated }) {
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const isEdit = !!workoutToEdit;

  const [name, setName] = useState(workoutToEdit?.name || "");
  const [description, setDescription] = useState(workoutToEdit?.description || "");
  const [exercises, setExercises] = useState(workoutToEdit?.exercises || []);

  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");

  const handleAddExercise = () => {
    if (!exerciseName.trim()) return;

    setExercises([
      ...exercises,
      {
        name: exerciseName.trim(),
        sets: Number(sets) || 0,
        reps: Number(reps) || 0,
        notes: notes.trim(),
        link: link.trim() || null,
      },
    ]);

    setExerciseName("");
    setSets("");
    setReps("");
    setNotes("");
    setLink("");
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: user.id,
      name,
      description,
      exercises,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    try {
      if (isEdit) {
        await editWorkout(workoutToEdit.id, payload);
        onCreated({ id: workoutToEdit.id, ...payload });
      } else {
        const newWorkout = await createWorkout(payload);
        onCreated(newWorkout);
        setName("");
        setDescription("");
        setExercises([]);
      }
    } catch (err) {
      console.error(t("Failed to save workout", "Error al guardar el programa"), err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg mb-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">
        {isEdit ? t("Edit Workout Program", "Editar Programa de Entrenamiento") : t("New Workout Program", "Nuevo Programa de Entrenamiento")}
      </h2>

      {/* Program Name */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">{t("Program Name:", "Nombre del Programa:")}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">{t("Description:", "Descripción:")}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Add Exercise */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">{t("Add Exercise:", "Agregar Ejercicio:")}</label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          <input
            type="text"
            placeholder={t("Exercise Name", "Nombre del Ejercicio")}
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="number"
            placeholder={t("Sets", "Series")}
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="number"
            placeholder={t("Reps", "Repeticiones")}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            placeholder={t("Notes", "Notas")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            placeholder={t("Link", "Enlace")}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <button
          type="button"
          onClick={handleAddExercise}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold mb-2"
        >
          {t("Add Exercise", "Agregar Ejercicio")}
        </button>

        {exercises.length > 0 && (
          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded p-2 custom-scrollbar">
            <ul className="space-y-1">
              {exercises.map((ex, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-800 p-2 rounded"
                >
                  <span>{`${ex.name} - ${t("Sets", "Series")}: ${ex.sets}, ${t("Reps", "Repeticiones")}: ${ex.reps}${ex.notes ? `, ${t("Notes", "Notas")}: ${ex.notes}` : ""}`}</span>
                  <button
                    type="button"
                    className="text-red-500 font-bold ml-2 hover:text-red-400"
                    onClick={() => handleRemoveExercise(idx)}
                  >
                    {t("Remove", "Eliminar")}
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
        {isEdit ? t("Save Changes", "Guardar Cambios") : t("Add Program", "Agregar Programa")}
      </button>
    </form>
  );
}
