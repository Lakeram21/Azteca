import * as ProgramService from "../services/workoutProgramService.js";

export function getPrograms(req, res) {
  const programs = ProgramService.getAllPrograms();
  res.json(programs);
}

export function createProgram(req, res) {
  const { userId, name, description, exercises } = req.body;
  if (!userId || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const program = ProgramService.addProgram({ name, description, exercises, createdBy: userId });
  res.status(201).json(program);
}

export function updateProgram(req, res) {
  const { id } = req.params;
  const updated = ProgramService.updateProgram(Number(id), req.body);
  if (!updated) return res.status(404).json({ error: "Program not found" });
  res.json(updated);
}

export function deleteProgram(req, res) {
  const { id } = req.params;
  ProgramService.deleteProgram(Number(id));
  res.json({ success: true });
}
