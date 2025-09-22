export function createassignProgram({ id, createdBy, clientId, programId, status, progress=[]}) {
  return { id, programId,progress, clientId,status,createdBy, createdAt: new Date().toISOString() };
}
