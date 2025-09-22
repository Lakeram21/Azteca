import express from "express";
import { getAssignPrograms, createAssignProgram, updateAssignProgram, deleteAssignProgram } from "../controllers/assignProgramController.js";

const router = express.Router();

router.get("/:id", getAssignPrograms);
router.post("/", createAssignProgram);
router.put("/:id", updateAssignProgram);
router.delete("/:id", deleteAssignProgram);

export default router;
