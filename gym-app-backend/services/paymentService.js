import fs from "fs";
import path from "path";

const paymentsFile = path.join(process.cwd(), "data", "payments.json");
const userFile = path.join(process.cwd(), "data", "users.json");

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf-8");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${file}:`, err);
    return [];
  }
}

export function getAllPayments() {
  const payments = readJson(paymentsFile);
  const users = readJson(userFile);

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return payments.map((p) => {
    const user = userMap[p.userId] || null;
    const client = userMap[p.clientId] || null;

    return {
      ...p,
      user: user
        ? { id: user.id, name: user.name, email: user.email, phone: user.phone }
        : null,
      client: client
        ? { id: client.id, name: client.name, email: client.email, phone: client.phone }
        : null,
    };
  });
}

export function getPaymentById(paymentId) {
  const payments = readJson(paymentsFile);
  const users = readJson(userFile);

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const payment = payments.find((p) => p.id === paymentId);
  if (!payment) return null;

  const user = userMap[payment.userId] || null;
  const client = userMap[payment.clientId] || null;

  return {
    ...payment,
    user: user
      ? { id: user.id, name: user.name, email: user.email, phone: user.phone }
      : null,
    client: client
      ? { id: client.id, name: client.name, email: client.email, phone: client.phone }
      : null,
  };
}


export function addPayment({ userId, clientId, type, amount, date, durationDays }) {
  const payments = readJson(paymentsFile);

  const newPayment = {
    id: payments.length + 1,
    userId,
    clientId,
    type,
    amount,
    date,
    durationDays: durationDays || null,
  };

  payments.push(newPayment);
  fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));

  return newPayment;
}
