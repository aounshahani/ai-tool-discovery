import Analytics from "../model/Analytics.js";
import SearchQuery from "../model/SearchQuery.js";
import Tool from "../model/Tool.js";
import User from "../model/User.js";
import Review from "../model/Review.js";
import ToolAnalytics from "../model/ToolAnalytics.js";

// Get overall platform statistics
export const getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTools = await Tool.countDocuments();
        const approvedTools = await Tool.countDocuments({ status: "approved" });
        const pendingTools = await Tool.countDocuments({ status: "pending" });
        const totalReviews = await Review.countDocuments();
        const activeUsers = await User.countDocuments({ status: "active", isBanned: false });

        // Get stats for last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsersLast30Days = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        const newToolsLast30Days = await Tool.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            totalUsers,
            totalTools,
            approvedTools,
            pendingTools,
            totalReviews,
            activeUsers,
            newUsersLast30Days,
            newToolsLast30Days,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching platform stats", error: error.message });
    }
};

// Get tool popularity metrics
export const getToolPopularity = async (req, res) => {
    try {
        const { limit = 10, days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get tool engagement data
        const toolEngagement = await ToolAnalytics.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$toolId",
                    impressions: {
                        $sum: { $cond: [{ $eq: ["$eventType", "impression"] }, 1, 0] }
                    },
                    clicks: {
                        $sum: { $cond: [{ $eq: ["$eventType", "click"] }, 1, 0] }
                    },
                    engagements: {
                        $sum: { $cond: [{ $eq: ["$eventType", "engagement"] }, 1, 0] }
                    },
                    totalEvents: { $sum: 1 }
                }
            },
            {
                $sort: { totalEvents: -1 }
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        // Populate tool details
        const toolIds = toolEngagement.map(item => item._id);
        const tools = await Tool.find({ _id: { $in: toolIds } })
            .select('name logo category averageRating ratingCount');

        const popularTools = toolEngagement.map(item => {
            const tool = tools.find(t => t._id.toString() === item._id.toString());
            return {
                ...item,
                tool
            };
        });

        res.json({ popularTools, period: `${days} days` });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tool popularity", error: error.message });
    }
};

// Get user signups over time
export const getSignupsOverTime = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const signups = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({ signups, period: `${days} days` });
    } catch (error) {
        res.status(500).json({ message: "Error fetching signups data", error: error.message });
    }
};

// Get bounce rate (simplified calculation)
export const getBounceRate = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get sessions with only one event (bounce)
        const sessions = await ToolAnalytics.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate },
                    sessionId: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$sessionId",
                    eventCount: { $sum: 1 }
                }
            }
        ]);

        const totalSessions = sessions.length;
        const bouncedSessions = sessions.filter(s => s.eventCount === 1).length;
        const bounceRate = totalSessions > 0
            ? ((bouncedSessions / totalSessions) * 100).toFixed(2)
            : 0;

        res.json({
            bounceRate: parseFloat(bounceRate),
            totalSessions,
            bouncedSessions,
            period: `${days} days`
        });
    } catch (error) {
        res.status(500).json({ message: "Error calculating bounce rate", error: error.message });
    }
};

// Get top search queries
export const getTopSearches = async (req, res) => {
    try {
        const { limit = 20, days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const topSearches = await SearchQuery.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$query",
                    count: { $sum: 1 },
                    avgResults: { $avg: "$resultCount" },
                    lastSearched: { $max: "$timestamp" }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        res.json({
            topSearches: topSearches.map(item => ({
                query: item._id,
                count: item.count,
                avgResults: Math.round(item.avgResults),
                lastSearched: item.lastSearched
            })),
            period: `${days} days`
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching top searches", error: error.message });
    }
};

// Get traffic statistics
export const getTrafficStats = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get daily analytics data
        const trafficData = await Analytics.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });

        // If no analytics data, generate from ToolAnalytics
        if (trafficData.length === 0) {
            const dailyStats = await ToolAnalytics.aggregate([
                {
                    $match: {
                        timestamp: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                        },
                        pageViews: { $sum: 1 },
                        uniqueVisitors: {
                            $addToSet: {
                                $ifNull: ["$userId", "$sessionId"]
                            }
                        }
                    }
                },
                {
                    $project: {
                        date: "$_id",
                        pageViews: 1,
                        uniqueVisitors: { $size: "$uniqueVisitors" }
                    }
                },
                {
                    $sort: { date: 1 }
                }
            ]);

            return res.json({
                trafficData: dailyStats,
                period: `${days} days`,
                source: "calculated"
            });
        }

        res.json({
            trafficData,
            period: `${days} days`,
            source: "analytics_collection"
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching traffic stats", error: error.message });
    }
};

// Get review statistics
export const getReviewStats = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const totalReviews = await Review.countDocuments();
        const approvedReviews = await Review.countDocuments({ status: "approved" });
        const pendingReviews = await Review.countDocuments({ status: "pending" });
        const reportedReviews = await Review.countDocuments({ reported: true });

        const newReviews = await Review.countDocuments({
            createdAt: { $gte: startDate }
        });

        // Average rating across all reviews
        const avgRatingResult = await Review.aggregate([
            {
                $match: { status: "approved" }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);

        const averageRating = avgRatingResult.length > 0
            ? avgRatingResult[0].averageRating.toFixed(2)
            : 0;

        res.json({
            totalReviews,
            approvedReviews,
            pendingReviews,
            reportedReviews,
            newReviews,
            averageRating: parseFloat(averageRating),
            period: `${days} days`
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching review stats", error: error.message });
    }
};

