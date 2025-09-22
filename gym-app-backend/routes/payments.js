import express from "express";
import { getPayments, createPayment, getPaymentById } from "../controllers/paymentController.js";
import { getUserById } from "../services/userService.js";

const router = express.Router();
// Middleware to check admin role
const isAdmin = (req, res, next) => {
  console.log("isAdmin middleware called", req.body);
  const userId = req.body.userId; // pass userId in request body
  const user = getUserById(userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.post("/", isAdmin, createPayment);

export default router;
