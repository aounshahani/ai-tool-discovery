import express from "express";
import {
    getToolReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    reportReview,
    getUserReviews,
    getAllReviews,
    updateReviewStatus,
    getReportedReviews
} from "../controllers/reviewController.js";
import { authenticateToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/tools/:toolId", getToolReviews);

// Protected routes (require authentication)
router.post("/tools/:toolId", authenticateToken, createReview);
router.put("/reviews/:reviewId", authenticateToken, updateReview);
router.delete("/reviews/:reviewId", authenticateToken, deleteReview);
router.put("/reviews/:reviewId/helpful", authenticateToken, markHelpful);
router.post("/reviews/:reviewId/report", authenticateToken, reportReview);
router.get("/users/me/reviews", authenticateToken, getUserReviews);

// Admin routes
router.get("/admin/reviews", authenticateToken, requireRole(["admin"]), getAllReviews);
router.put("/admin/reviews/:reviewId/status", authenticateToken, requireRole(["admin"]), updateReviewStatus);
router.get("/admin/reviews/reported", authenticateToken, requireRole(["admin"]), getReportedReviews);

export default router;