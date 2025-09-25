import * as PaymentService from "../services/paymentService.js";

export function createPayment(req, res) {

  const { userId, clientId, type, amount, date, durationDays, selectedDates } = req.body;
  console.log("createPayment called with:", req.body);
  
  if (!clientId || !type || !amount || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const payment = PaymentService.addPayment({ userId, clientId, type, amount, date, durationDays, selectedDates });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export function getPayments(req, res) {
  const payments = PaymentService.getAllPayments();
  res.json(payments);
}


export function getPaymentById(req, res) {
  const { id } = req.params;
  const payment = PaymentService.getPaymentById(Number(id));
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  res.json(payment);
}