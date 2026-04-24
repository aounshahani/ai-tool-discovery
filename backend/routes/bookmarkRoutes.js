import express from "express";
const router = express.Router();
import { createCollection,  addToolToCollection, removeToolFromCollection, getUserCollections, deleteCollection } from "../controllers/bookmarkController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

// All routes require authentication
router.post("/", authenticateToken, createCollection);
router.post("/add-tool", authenticateToken, addToolToCollection);
router.post("/remove-tool", authenticateToken, removeToolFromCollection);
router.get("/", authenticateToken, getUserCollections);
router.delete("/:collectionId", authenticateToken, deleteCollection);

export default router;
