import mongoose from "mongoose";

const searchQuerySchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // null for guest users
    },
    sessionId: {
        type: String, // for tracking guest users
        default: null
    },
    resultCount: {
        type: Number,
        default: 0
    },
    resultsClicked: [{
        toolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tool"
        },
        position: Number // Position in search results
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
searchQuerySchema.index({ query: 1 });
searchQuerySchema.index({ timestamp: -1 });
searchQuerySchema.index({ userId: 1 });

export default mongoose.model("SearchQuery", searchQuerySchema);
