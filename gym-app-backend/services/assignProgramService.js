import fs from "fs";
import path from "path";

const assignFile = path.join(process.cwd(), "data", "assignPrograms.json");
const workoutFile = path.join(process.cwd(), "data", "workoutPrograms.json");

// Helper to read JSON safely
function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${filePath}:`, err);
    return [];
  }
}

export function getAllAssignments() {
  return readJson(assignFile);
}

export function getAllWorkouts() {
  return readJson(workoutFile);
}

// Include workout when returning assignments
export function getAssignmentsByClient(clientId) {
  const assignments = getAllAssignments().filter(
    (a) => String(a.clientId) === String(clientId)
  );

  const workouts = getAllWorkouts();

  // Attach workout to each assignment
  return assignments.map((a) => {
    console.log("Finding workout for programId:", a.programId);
    console.log("Available workouts:", workouts);
    const workout = workouts.find((w) => String(w.id) === String(a.programId)) || null;
    console.log("Found workout:", workout);
    return {
      ...a,
      workout,
    };
  });
}

export function createAssignProgram({ createdBy, clientId, programId }) {
  const assignments = getAllAssignments();

  const newAssignment = {
    id: assignments.length + 1,
    programId,
    clientId,
    status: "assigned", // assigned, in-progress, completed
    progress: [],       // { exerciseId, date, sets, reps, weight, notes }
    createdBy,
    createdAt: new Date().toISOString(),
  };

  assignments.push(newAssignment);
  fs.writeFileSync(assignFile, JSON.stringify(assignments, null, 2));
  return newAssignment;
}

export function updateAssignment(id, updatedData) {
  const assignments = getAllAssignments();
  const index = assignments.findIndex((a) => a.id === id);
  if (index === -1) return null;

  assignments[index] = {
    ...assignments[index],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(assignFile, JSON.stringify(assignments, null, 2));
  return assignments[index];
}

export function addProgress(id, progressEntry) {
  const assignments = getAllAssignments();
  const index = assignments.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const entry = {
    ...progressEntry,
    date: progressEntry.date || new Date().toISOString(),
  };

  assignments[index].progress.push(entry);
  assignments[index].updatedAt = new Date().toISOString();

  fs.writeFileSync(assignFile, JSON.stringify(assignments, null, 2));
  return assignments[index];
}

export function deleteAssignment(id) {
  const assignments = getAllAssignments();
  const filtered = assignments.filter((a) => a.id !== id);
  fs.writeFileSync(assignFile, JSON.stringify(filtered, null, 2));
  return true;
}
