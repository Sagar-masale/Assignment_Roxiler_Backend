import express from "express";
import protect from "../middleware/authMiddleware.js";
import { submitRating } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/submit", protect, submitRating);

export default router;