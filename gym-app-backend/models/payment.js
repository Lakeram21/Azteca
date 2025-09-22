export function createPayment({ id, userId, amount, type, startDate, endDate, status = "active" }) {
  return { id, userId, amount, type, startDate, endDate, status };
}
