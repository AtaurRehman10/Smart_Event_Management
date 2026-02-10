import express from "express";
import { trending, recommendedSessions } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/trending", trending);
router.get("/sessions", recommendedSessions);

export default router;
