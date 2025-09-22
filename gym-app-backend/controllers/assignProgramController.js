import * as assignProgramService from "../services/assignProgramService.js";

export function getAssignPrograms(req, res) {
  const { id } = req.params;
  const programs = assignProgramService.getAssignmentsByClient(id);
  res.json(programs);
}

export function createAssignProgram(req, res) {
  const { clientId, programId,createdBy} = req.body;
  if (!clientId || !programId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const program = assignProgramService.createAssignProgram({ createdBy, clientId, programId });
  res.status(201).json(program);
}

export function updateAssignProgram(req, res) {
  const { id } = req.params;
  const updated = assignProgramService.updateAssignment(Number(id), req.body);
  if (!updated) return res.status(404).json({ error: "Program not found" });
  res.json(updated);
}

export function deleteAssignProgram(req, res) {
  const { id } = req.params;
  ProgramService.deleteProgram(Number(id));
  res.json({ success: true });
}
