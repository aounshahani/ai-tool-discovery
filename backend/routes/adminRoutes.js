import express from "express";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";

// Admin controller imports
import {
    getAllTools,
    getPendingTools,
    approveTool,
    rejectTool,
    updateToolContent,
    deleteTool,
    getAllUsers,
    banUser,
    unbanUser,
    verifyCreator,
    unverifyCreator,
    getFlaggedContent,
    getAllCategories,
    createCategory,
    updateCategory,

    deleteCategory,
    getToolReports
} from "../controllers/adminController.js";

// Analytics controller imports
import {
    getPlatformStats,
    getToolPopularity,
    getSignupsOverTime,
    getBounceRate,
    getTopSearches,
    getTrafficStats,
    getReviewStats
} from "../controllers/analyticsController.js";

// Monetization controller imports
import {
    getFeaturedTools,
    setFeaturedTool,
    removeFeaturedTool,
    updateAffiliateLink,
    getSponsoredTools,
    setSponsoredTool,
    removeSponsoredTool
} from "../controllers/monetizationController.js";

// Review controller imports
import {
    getAllReviews,
    updateReviewStatus,
    getReportedReviews,
    bulkDeleteReviews
} from "../controllers/reviewController.js";

const router = express.Router();

// Apply authentication and admin role to all routes
router.use(authenticateToken);
router.use(requireRole(["admin"]));

// ============ TOOL MODERATION ROUTES ============
router.get("/tools", getAllTools);
router.get("/tools/pending", getPendingTools);
router.put("/tools/:id/approve", approveTool);
router.put("/tools/:id/reject", rejectTool);
router.put("/tools/:id", updateToolContent);
router.delete("/tools/:id", deleteTool);

// ============ USER MANAGEMENT ROUTES ============
router.get("/users", getAllUsers);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);
router.put("/users/:id/verify", verifyCreator);
router.put("/users/:id/unverify", unverifyCreator);
router.put("/users/:id/unverify", unverifyCreator);
router.get("/flagged-content", getFlaggedContent);
router.get("/reports", getToolReports);

// ============ CATEGORY MANAGEMENT ROUTES ============
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// ============ ANALYTICS ROUTES ============
router.get("/analytics/platform-stats", getPlatformStats);
router.get("/analytics/tool-popularity", getToolPopularity);
router.get("/analytics/signups", getSignupsOverTime);
router.get("/analytics/bounce-rate", getBounceRate);
router.get("/analytics/top-searches", getTopSearches);
router.get("/analytics/traffic", getTrafficStats);
router.get("/analytics/reviews", getReviewStats);

// ============ MONETIZATION ROUTES ============
router.get("/monetization/featured", getFeaturedTools);
router.put("/monetization/featured/:id", setFeaturedTool);
router.delete("/monetization/featured/:id", removeFeaturedTool);
router.put("/monetization/affiliate/:id", updateAffiliateLink);
router.get("/monetization/sponsored", getSponsoredTools);
router.put("/monetization/sponsored/:id", setSponsoredTool);
router.delete("/monetization/sponsored/:id", removeSponsoredTool);

// ============ REVIEW MANAGEMENT ROUTES ============
router.get("/reviews", getAllReviews);
router.put("/reviews/:reviewId/status", updateReviewStatus);
router.get("/reviews/reported", getReportedReviews);
router.delete("/reviews/bulk", bulkDeleteReviews);

export default router;
