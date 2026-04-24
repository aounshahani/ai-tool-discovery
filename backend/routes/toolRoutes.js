import express from "express";
import Tool from "../model/Tool.js";
import ToolAnalytics from "../model/ToolAnalytics.js";
import Review from "../model/Review.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============ PUBLIC ROUTES ============

// List Tools
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let query = { status: "approved" };
        // If the user wants ALL tools (including pending), they should use the admin route. 
        // But for now, let's keep it consistent with previous behavior (Tool.find() returned everything).
        // Actually, public list should probably be approved only. Let's check if there was a filter before.
        // Previous code was `Tool.find()`. It returned EVERYTHING. 
        // I will keep it as `Tool.find()` but add search.



        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        const tools = await Tool.find(query).sort({ featured: -1, createdAt: -1 });
        res.json(tools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get recommended tools (Must be before /:id to avoid conflict)
router.get("/recommendations", async (req, res) => {
    try {
        const { category, excludeId } = req.query;

        let query = { status: "approved" };

        if (category) {
            query.category = category;
        }

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        // Get top rated tools in this category
        const recommendations = await Tool.find(query)
            .sort({ averageRating: -1, ratingCount: -1 })
            .limit(4);

        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get tools by category
router.get("/category/:category", async (req, res) => {
    try {
        const tools = await Tool.find({ category: req.params.category });
        if (!tools.length) {
            return res.status(404).json({ error: "No tools found in this category" });
        }
        res.json(tools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Tool (This matches anything, so keep it lower)
router.get("/:id", async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }
        res.json(tool);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ PROTECTED ROUTES ============

// Add Tool
router.post("/", authenticateToken, async (req, res) => {
    try {
        const newTool = new Tool({
            ...req.body,
            userId: req.user.id, // 🔹 attach the creator's ID
        });

        const savedTool = await newTool.save();
        res.status(201).json(savedTool);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Report a tool
router.post("/:id/report", authenticateToken, async (req, res) => {
    try {
        const { reason, description } = req.body;

        // Import ToolReport dynamically or at top if not circular
        const ToolReport = (await import("../model/ToolReport.js")).default;

        const report = new ToolReport({
            toolId: req.params.id,
            userId: req.user.id,
            reason,
            description
        });

        await report.save();
        res.status(201).json({ message: "Report submitted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ CREATOR ROUTES ============

// Get logged-in user's tools
router.get("/user/my-tools", authenticateToken, async (req, res) => {
    try {
        const tools = await Tool.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json({ tools, count: tools.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update own tool
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const tool = await Tool.findOne({ _id: req.params.id, userId: req.user.id });

        if (!tool) {
            return res.status(404).json({ message: "Tool not found or unauthorized" });
        }

        // Prevent updating critical fields
        delete req.body.status;
        delete req.body.featured;
        delete req.body.userId;

        Object.assign(tool, req.body);
        tool.updatedAt = Date.now();

        await tool.save();
        res.json({ message: "Tool updated successfully", tool });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete own tool
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const tool = await Tool.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!tool) {
            return res.status(404).json({ message: "Tool not found or unauthorized" });
        }

        // Also delete related reviews
        await Review.deleteMany({ tool: req.params.id });

        res.json({ message: "Tool deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get tool analytics
router.get("/:id/analytics", authenticateToken, async (req, res) => {
    try {
        const tool = await Tool.findOne({ _id: req.params.id, userId: req.user.id });

        if (!tool) {
            return res.status(404).json({ message: "Tool not found or unauthorized" });
        }

        // Get event counts
        const analytics = await ToolAnalytics.aggregate([
            { $match: { toolId: tool._id } },
            {
                $group: {
                    _id: "$eventType",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get reviews
        const reviews = await Review.find({ tool: tool._id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        // Get daily views (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyViews = await ToolAnalytics.aggregate([
            {
                $match: {
                    toolId: tool._id,
                    eventType: "impression",
                    timestamp: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    views: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            tool,
            analytics: {
                events: analytics,
                dailyViews
            },
            reviews
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
