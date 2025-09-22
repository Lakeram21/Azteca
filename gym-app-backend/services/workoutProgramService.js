import fs from "fs";
import path from "path";

const programsFile = path.join(process.cwd(), "data", "workoutPrograms.json");

export function getAllPrograms() {
  if (!fs.existsSync(programsFile)) return [];
  const raw = fs.readFileSync(programsFile, "utf-8");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse workoutPrograms.json:", err);
    return [];
  }
}

export function addProgram({ name, description, exercises, createdBy }) {
  const programs = getAllPrograms();

  const newProgram = {
    id: programs.length + 1,
    name,
    description,
    exercises: exercises || [],
    createdBy,
    createdAt: new Date().toISOString(),
  };

  programs.push(newProgram);
  fs.writeFileSync(programsFile, JSON.stringify(programs, null, 2));
  return newProgram;
}

export function updateProgram(id, updatedData) {
  const programs = getAllPrograms();
  const index = programs.findIndex(p => p.id === id);
  if (index === -1) return null;

  programs[index] = { ...programs[index], ...updatedData, updatedAt: new Date().toISOString() };
  fs.writeFileSync(programsFile, JSON.stringify(programs, null, 2));
  return programs[index];
}

export function deleteProgram(id) {
  const programs = getAllPrograms();
  const filtered = programs.filter(p => p.id !== id);
  fs.writeFileSync(programsFile, JSON.stringify(filtered, null, 2));
  return true;
}
