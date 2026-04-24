import Review from "../model/Review.js";
import Tool from "../model/Tool.js";

// @desc    Get all reviews for a tool
// @route   GET /api/tools/:toolId/reviews
// @access  Public
export const getToolReviews = async (req, res) => {
    try {
        const { toolId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // Build query - only show approved reviews to public
        let query = { tool: toolId, status: "approved" };

        // If user is authenticated, they can see their own pending reviews too
        if (req.user) {
            query = {
                tool: toolId,
                $or: [
                    { status: "approved" },
                    { user: req.user._id }
                ]
            };
        }

        const reviews = await Review.find(query)
            .populate("user", "name email")
            .sort({ [sortBy]: sortOrder, helpful: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(query);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Create a new review
// @route   POST /api/tools/:toolId/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { toolId } = req.params;
        const { rating, title, comment } = req.body;

        console.log('🔍 Review submission attempt:', {
            toolId,
            userId: req.user?._id,
            userEmail: req.user?.email,
            rating,
            title
        });

        // Check if tool exists
        const tool = await Tool.findById(toolId);
        if (!tool) {
            console.log('❌ Tool not found:', toolId);
            return res.status(404).json({
                success: false,
                message: "Tool not found"
            });
        }

        // Check if user already reviewed this tool
        const alreadyReviewed = await Review.findOne({
            tool: toolId,
            user: req.user._id
        });

        console.log('🔍 Duplicate check result:', {
            alreadyReviewed: !!alreadyReviewed,
            reviewId: alreadyReviewed?._id
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this tool"
            });
        }

        // Create review
        const review = await Review.create({
            user: req.user._id,
            tool: toolId,
            rating,
            title,
            comment
        });

        // Populate user info for response
        await review.populate("user", "name email");

        console.log('✅ Review created successfully:', review._id);

        res.status(201).json({
            success: true,
            message: "Review submitted successfully. It will be visible after approval.",
            data: review
        });
    } catch (error) {
        console.error('❌ Review creation error:', error);
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private (only review owner or admin)
export const updateReview = async (req, res) => {
    try {
        const { rating, title, comment } = req.body;

        let review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this review"
            });
        }

        review = await Review.findByIdAndUpdate(
            req.params.reviewId,
            {
                rating,
                title,
                comment,
                status: req.user.role === "admin" ? review.status : "pending"
            },
            { new: true, runValidators: true }
        ).populate("user", "name email");

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private (only review owner or admin)
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this review"
            });
        }

        await Review.findByIdAndDelete(req.params.reviewId);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:reviewId/helpful
// @access  Private
export const markHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if user already marked this review as helpful
        // (Implementation would require a separate model to track user votes)

        review.helpful += 1;
        await review.save();

        res.status(200).json({
            success: true,
            message: "Review marked as helpful",
            data: { helpful: review.helpful }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Report a review
// @route   POST /api/reviews/:reviewId/report
// @access  Private
export const reportReview = async (req, res) => {
    try {
        const { reason } = req.body;

        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if user already reported this review
        if (review.reported && review.reportReasons && review.reportReasons.includes(req.user._id.toString())) {
            return res.status(400).json({
                success: false,
                message: "You have already reported this review"
            });
        }

        review.reported = true;
        if (!review.reportReasons) review.reportReasons = [];
        review.reportReasons.push({
            userId: req.user._id,
            reason: reason,
            reportedAt: new Date()
        });

        await review.save();

        res.status(200).json({
            success: true,
            message: "Review reported successfully. Our team will review it shortly."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Get user's reviews
// @route   GET /api/users/me/reviews
// @access  Private
export const getUserReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ user: req.user._id })
            .populate("tool", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ user: req.user._id });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ADMIN FUNCTIONS

// @desc    Get all reviews (for admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status || "all";

        let query = {};
        if (status !== "all") {
            query.status = status;
        }

        const reviews = await Review.find(query)
            .populate("user", "name email")
            .populate("tool", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(query);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Update review status (for admin)
// @route   PUT /api/admin/reviews/:reviewId/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        review.status = status;
        if (status === "approved") {
            review.reported = false;
            review.reportReasons = [];
        }
        await review.save();

        // Recalculate tool rating
        await Review.calculateAverageRating(review.tool);

        res.status(200).json({
            success: true,
            message: `Review ${status} successfully`,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Get reported reviews (for admin)
// @route   GET /api/admin/reviews/reported
// @access  Private/Admin
export const getReportedReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ reported: true })
            .populate("user", "name email")
            .populate("tool", "name slug")
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ reported: true });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Bulk delete reviews (for spam removal)
// @route   DELETE /api/admin/reviews/bulk
// @access  Private/Admin
export const bulkDeleteReviews = async (req, res) => {
    try {
        const { reviewIds } = req.body;

        if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Review IDs array is required"
            });
        }

        const result = await Review.deleteMany({ _id: { $in: reviewIds } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} reviews deleted successfully`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};