import express from "express";
import ToolAnalytics from "../model/ToolAnalytics.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Record an analytics event
router.post("/tools", authenticateToken, async (req, res) => {
  try {
    const { toolId, eventType, page, sessionId } = req.body;

    // Ignore admin events
    if (req.user && req.user.role === 'admin') {
      return res.status(200).json({ message: "Admin event ignored" });
    }

    const event = new ToolAnalytics({
      toolId,
      userId: req.user ? req.user.id : null, // if logged in
      eventType,
      page,
      sessionId,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
