import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true // One document per day
    },
    // Traffic metrics
    pageViews: {
        type: Number,
        default: 0
    },
    uniqueVisitors: {
        type: Number,
        default: 0
    },
    // User metrics
    newSignups: {
        type: Number,
        default: 0
    },
    totalUsers: {
        type: Number,
        default: 0
    },
    // Engagement metrics
    bounceRate: {
        type: Number, // percentage
        default: 0
    },
    avgSessionDuration: {
        type: Number, // in seconds
        default: 0
    },
    // Top content
    topSearchQueries: [{
        query: String,
        count: Number
    }],
    topTools: [{
        toolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tool"
        },
        views: Number,
        clicks: Number
    }],
    // Tool metrics
    totalTools: {
        type: Number,
        default: 0
    },
    newTools: {
        type: Number,
        default: 0
    },
    // Review metrics
    totalReviews: {
        type: Number,
        default: 0
    },
    newReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient date queries
analyticsSchema.index({ date: -1 });

export default mongoose.model("Analytics", analyticsSchema);
