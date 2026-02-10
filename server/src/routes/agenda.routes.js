import express from "express";
import { generateAgenda } from "../controllers/agenda.controller.js";

const router = express.Router();

router.post("/generate", generateAgenda);

export default router;
