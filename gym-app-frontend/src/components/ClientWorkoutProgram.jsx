import React, { useEffect, useState } from "react";
import { getAssignedWorkouts, getWorkouts } from "../firebaseWorkouts";
import { useLanguage } from "../context/LanguageContext";

export default function ClientWorkoutProgramsTable({ user }) {
  const { language } = useLanguage();
  const t = (en, es) => (language === "en" ? en : es);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null); // For modal

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assigned = await getAssignedWorkouts(user.uid);

        // Fetch workout details for each assigned program
        const workouts = await getWorkouts(); // all workouts
        const enriched = assigned.map((a) => ({
          ...a,
          workout: workouts.find((w) => w.id === a.workoutId) || null,
        }));

        setAssignments(enriched);
      } catch (err) {
        console.error(t("Failed to fetch assignments", "Error al obtener asignaciones"), err);
      }
    };

    fetchAssignments();
  }, [user.id, language]);

  const renderProgress = (progress) => {
    if (!Array.isArray(progress) || progress.length === 0) return t("No progress yet", "Sin progreso aún");
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
          <p>{t("No assigned programs found.", "No se encontraron programas asignados.")}</p>
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
                  {a.workout?.name || `${t("Program", "Programa")} ${a.programId}`}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    a.status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-gray-600 text-gray-200"
                  }`}
                >
                  {t(a.status, a.status === "completed" ? "completado" : "en progreso")}
                </span>
              </div>

              <p>
                <strong>{t("Progress:", "Progreso:")}</strong>
              </p>
              {renderProgress(a.progress)}

              <p className="mt-2 text-gray-300 text-sm">
                <strong>{t("Assigned At:", "Asignado el:")}</strong>{" "}
                {new Date(a.assignedAt).toLocaleString()}
              </p>

              <button
                onClick={() => setSelectedAssignment(a)}
                className="mt-3 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
              >
                {t("View Workout", "Ver Rutina")}
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
              {selectedAssignment.workout?.name || `${t("Program", "Programa")} ${selectedAssignment.programId}`}
            </h2>
            <p className="text-gray-300 mb-4">
              {selectedAssignment.workout?.description}
            </p>

            <h3 className="text-lg font-semibold text-yellow-300 mb-2">
              {t("Exercises:", "Ejercicios:")}
            </h3>
            <ul className="space-y-2">
              {selectedAssignment.workout?.exercises?.map((ex, idx) => (
                <li
                  key={idx}
                  className="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-400"
                >
                  <p className="font-semibold">{ex.name}</p>
                  <p>
                    {t("Sets", "Series")}: {ex.sets} | {t("Reps", "Repeticiones")}: {ex.reps}{" "}
                    {ex.weight ? `| ${t("Weight", "Peso")}: ${ex.weight}` : ""}
                  </p>
                  {ex.notes && <p className="text-gray-400 text-sm">{t("Notes", "Notas")}: {ex.notes}</p>}
                  {ex.link && (
                    <p className="text-gray-400 text-sm">
                      <a
                        href={ex.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 underline hover:text-yellow-300"
                      >
                        {ex.link}
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
