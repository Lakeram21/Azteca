import express from "express";
import { getPrograms, createProgram, updateProgram, deleteProgram } from "../controllers/workoutProgramController.js";

const router = express.Router();

router.get("/", getPrograms);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
