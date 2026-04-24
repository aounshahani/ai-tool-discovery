import Tool from "../model/Tool.js";
import User from "../model/User.js";
import Category from "../model/Category.js";
import Review from "../model/Review.js";

// ============ TOOL MODERATION ============

// Get all tools with optional filters
export const getAllTools = async (req, res) => {
    try {
        const { status, category, featured, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (featured !== undefined) query.featured = featured === 'true';

        const tools = await Tool.find(query)
            .populate('userId', 'name email')
            .populate('approvedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Tool.countDocuments(query);

        res.json({
            tools,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tools", error: error.message });
    }
};

// Get pending tools
export const getPendingTools = async (req, res) => {
    try {
        const tools = await Tool.find({ status: "pending" })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ tools, count: tools.length });
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending tools", error: error.message });
    }
};

// Approve tool
export const approveTool = async (req, res) => {
    try {
        const { id } = req.params;

        const tool = await Tool.findByIdAndUpdate(
            id,
            {
                status: "approved",
                approvedAt: Date.now(),
                approvedBy: req.user._id,
                rejectionReason: null
            },
            { new: true }
        ).populate('userId', 'name email');

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Tool approved successfully", tool });
    } catch (error) {
        res.status(500).json({ message: "Error approving tool", error: error.message });
    }
};

// Reject tool
export const rejectTool = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ message: "Rejection reason is required" });
        }

        const tool = await Tool.findByIdAndUpdate(
            id,
            {
                status: "rejected",
                rejectionReason: reason,
                approvedBy: req.user._id
            },
            { new: true }
        ).populate('userId', 'name email');

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Tool rejected successfully", tool });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting tool", error: error.message });
    }
};

// Update tool content
export const updateToolContent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent direct status changes through this endpoint
        delete updates.status;
        delete updates.approvedBy;
        delete updates.approvedAt;

        const tool = await Tool.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Tool updated successfully", tool });
    } catch (error) {
        res.status(500).json({ message: "Error updating tool", error: error.message });
    }
};

// Delete tool
export const deleteTool = async (req, res) => {
    try {
        const { id } = req.params;

        const tool = await Tool.findByIdAndDelete(id);

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        // Also delete related reviews
        await Review.deleteMany({ tool: id });

        res.json({ message: "Tool and related reviews deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting tool", error: error.message });
    }
};

// ============ USER MANAGEMENT ============

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const { role, status, isBanned, isVerified, search, page = 1, limit = 20 } = req.query;

        const query = { _id: { $ne: req.user._id }, role: { $ne: 'admin' } }; // Exclude current admin and all other admins
        if (role) query.role = role;
        if (status) query.status = status;
        if (isBanned !== undefined) query.isBanned = isBanned === 'true';
        if (isVerified !== undefined) query.isVerified = isVerified === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Ban user
export const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ message: "Ban reason is required" });
        }

        // Prevent banning yourself
        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot ban yourself" });
        }

        const user = await User.findByIdAndUpdate(
            id,
            {
                isBanned: true,
                bannedAt: Date.now(),
                bannedReason: reason,
                bannedBy: req.user._id,
                status: "inactive"
            },
            { new: true }
        ).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User banned successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error banning user", error: error.message });
    }
};

// Unban user
export const unbanUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            {
                isBanned: false,
                bannedAt: null,
                bannedReason: null,
                bannedBy: null,
                status: "active"
            },
            { new: true }
        ).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User unbanned successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error unbanning user", error: error.message });
    }
};

// Verify creator
export const verifyCreator = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            {
                isVerified: true,
                verifiedAt: Date.now(),
                verifiedBy: req.user._id
            },
            { new: true }
        ).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Creator verified successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error verifying creator", error: error.message });
    }
};

// Unverify creator
export const unverifyCreator = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            {
                isVerified: false,
                verifiedAt: null,
                verifiedBy: null
            },
            { new: true }
        ).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Creator verification removed", user });
    } catch (error) {
        res.status(500).json({ message: "Error unverifying creator", error: error.message });
    }
};

// Get flagged content (reported reviews)
export const getFlaggedContent = async (req, res) => {
    try {
        const flaggedReviews = await Review.find({ reported: true, status: "pending" })
            .populate('user', 'name email')
            .populate('tool', 'name')
            .sort({ updatedAt: -1 });

        res.json({
            flaggedReviews,
            count: flaggedReviews.length
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching flagged content", error: error.message });
    }
};

// Get tool reports
export const getToolReports = async (req, res) => {
    try {
        // Dynamic import to avoid circular dependency if any
        const ToolReport = (await import("../model/ToolReport.js")).default;

        const reports = await ToolReport.find()
            .populate('toolId', 'name')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ reports });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tool reports", error: error.message });
    }
};

// ============ CATEGORY MANAGEMENT ============

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// Create category
export const createCategory = async (req, res) => {
    try {
        const { name, slug, description, icon } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: "Name and slug are required" });
        }

        const category = new Category({
            name,
            slug,
            description,
            icon
        });

        await category.save();

        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category name or slug already exists" });
        }
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if any tools use this category
        const toolsCount = await Tool.countDocuments({ category: id });
        if (toolsCount > 0) {
            return res.status(400).json({
                message: `Cannot delete category. ${toolsCount} tools are using it.`
            });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};
