import express from "express";
import { getAllCategories } from "../controllers/adminController.js";

const router = express.Router();

// Get all categories (Public)
router.get("/", getAllCategories);

export default router;
