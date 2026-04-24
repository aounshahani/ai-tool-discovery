import mongoose from "mongoose";

const reportReasonSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        maxlength: 500
    },
    reportedAt: {
        type: Date,
        default: Date.now
    }
});

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tool",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000
    },
    helpful: {
        type: Number,
        default: 0
    },
    reported: {
        type: Boolean,
        default: false
    },
    reportReasons: [reportReasonSchema],
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update tool rating when a review is saved
reviewSchema.post("save", async function() {
    await this.constructor.calculateAverageRating(this.tool);
});

// Update tool rating when a review is removed
reviewSchema.post("findOneAndDelete", async function(doc) {
    if (doc) {
        await doc.constructor.calculateAverageRating(doc.tool);
    }
});

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(toolId) {
    const stats = await this.aggregate([
        {
            $match: { tool: toolId, status: "approved" }
        },
        {
            $group: {
                _id: "$tool",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model("Tool").findByIdAndUpdate(toolId, {
            ratingCount: stats[0].nRating,
            averageRating: Math.round(stats[0].avgRating * 10) / 10 // Round to 1 decimal
        });
    } else {
        await mongoose.model("Tool").findByIdAndUpdate(toolId, {
            ratingCount: 0,
            averageRating: 0
        });
    }
};

// Index for preventing multiple reviews from same user for same tool
reviewSchema.index({ tool: 1, user: 1 }, { unique: true });

// Update the updatedAt field before saving
reviewSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("Review", reviewSchema);
