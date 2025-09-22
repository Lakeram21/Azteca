export function createUser({ id, name, email, phone, password, role = "client" }) {
  return { id, name, email, phone, password, role };
}
