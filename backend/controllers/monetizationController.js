import Tool from "../model/Tool.js";

// Get all featured tools
export const getFeaturedTools = async (req, res) => {
    try {
        const now = new Date();

        const featuredTools = await Tool.find({
            featured: true,
            $or: [
                { featuredUntil: null },
                { featuredUntil: { $gte: now } }
            ]
        })
            .populate('userId', 'name email')
            .sort({ featuredUntil: 1 });

        res.json({ featuredTools, count: featuredTools.length });
    } catch (error) {
        res.status(500).json({ message: "Error fetching featured tools", error: error.message });
    }
};

// Set tool as featured
export const setFeaturedTool = async (req, res) => {
    try {
        const { id } = req.params;
        const { featuredUntil } = req.body;

        const updates = {
            featured: true
        };

        if (featuredUntil) {
            updates.featuredUntil = new Date(featuredUntil);
        }

        const tool = await Tool.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).populate('userId', 'name email');

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Tool set as featured successfully", tool });
    } catch (error) {
        res.status(500).json({ message: "Error setting featured tool", error: error.message });
    }
};

// Remove featured status
export const removeFeaturedTool = async (req, res) => {
    try {
        const { id } = req.params;

        const tool = await Tool.findByIdAndUpdate(
            id,
            {
                featured: false,
                featuredUntil: null
            },
            { new: true }
        );

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Featured status removed successfully", tool });
    } catch (error) {
        res.status(500).json({ message: "Error removing featured status", error: error.message });
    }
};

// Update affiliate link
export const updateAffiliateLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { affiliateLink } = req.body;

        if (!affiliateLink) {
            return res.status(400).json({ message: "Affiliate link is required" });
        }

        const tool = await Tool.findByIdAndUpdate(
            id,
            { affiliateLink },
            { new: true }
        );

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Affiliate link updated successfully", tool });
    } catch (error) {
        res.status(500).json({ message: "Error updating affiliate link", error: error.message });
    }
};

// Get sponsored tools
export const getSponsoredTools = async (req, res) => {
    try {
        const sponsoredTools = await Tool.find({
            sponsoredBy: { $ne: null, $exists: true }
        })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ sponsoredTools, count: sponsoredTools.length });
    } catch (error) {
        res.status(500).json({ message: "Error fetching sponsored tools", error: error.message });
    }
};

// Set tool as sponsored
export const setSponsoredTool = async (req, res) => {
    try {
        const { id } = req.params;
        const { sponsoredBy } = req.body;

        if (!sponsoredBy) {
            return res.status(400).json({ message: "Sponsor name is required" });
        }

        const tool = await Tool.findByIdAndUpdate(
            id,
            { sponsoredBy },
            { new: true }
        ).populate('userId', 'name email');

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Tool set as sponsored successfully", tool });
    } catch (error) {
        res.status(500).json({ message: "Error setting sponsored tool", error: error.message });
    }
};

// Remove sponsored status
export const removeSponsoredTool = async (req, res) => {
    try {
        const { id } = req.params;

        const tool = await Tool.findByIdAndUpdate(
            id,
            { sponsoredBy: null },
            { new: true }
        );

        if (!tool) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Sponsored status removed successfully", tool });
    } catch (error) {
        res.status(500).json({ message: "Error removing sponsored status", error: error.message });
    }
};
