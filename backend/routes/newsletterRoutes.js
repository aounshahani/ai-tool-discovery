import express from "express";
import Newsletter from "../model/Newsletter.js";

const router = express.Router();

// Subscribe to newsletter
router.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                await existing.save();
                return res.status(200).json({ message: "Welcome back! Subscription reactivated." });
            }
            return res.status(400).json({ message: "Email already subscribed" });
        }

        const subscriber = new Newsletter({ email });
        await subscriber.save();

        res.status(201).json({ message: "Successfully subscribed to newsletter!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
