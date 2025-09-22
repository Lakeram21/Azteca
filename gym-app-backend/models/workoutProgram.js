export function createWorkoutProgram({ id, name, description, exercises = [], createdBy }) {
  return { id, name, description, exercises, createdBy, createdAt: new Date().toISOString() };
}
