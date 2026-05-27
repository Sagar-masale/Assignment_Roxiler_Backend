import express from "express"
import protect from "../middleware/authMiddleware.js";
import { getStores } from "../controllers/storeController.js";

const router = express.Router();

router.get("/all", protect, getStores);

export default router;