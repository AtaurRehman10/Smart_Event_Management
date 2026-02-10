import express from "express";
import { ask, indexDocs } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/index", indexDocs);
router.post("/ask", ask);

export default router;
