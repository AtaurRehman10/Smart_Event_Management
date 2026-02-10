import express from "express";
import { matches, graph } from "../controllers/matching.controller.js";

const router = express.Router();

router.get("/matches", matches);
router.get("/graph", graph);

export default router;
