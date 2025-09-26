import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import paymentsRouter from "./routes/payments.js";
import workoutRouter from "./routes/workoutProgram.js";
import assignworkoutRouter from "./routes/assignProgram.js";

const app = express();

// CORS configuration for your React frontend
app.use(cors({
  origin: [
    "https://azteca-1.onrender.com", // deployed frontend
    "http://localhost:5173"           // local dev frontend
  ]// React dev server
}));

// JSON body parser
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});
app.use("/users", usersRouter);
app.use("/payments", paymentsRouter);
app.use("/workout-programs", workoutRouter);
app.use("/assign-program", assignworkoutRouter);

// Start server on a port that’s free
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));