import mongoose from "mongoose";

const toolReportSchema = new mongoose.Schema({
    toolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tool",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // Can be anonymous
    },
    reason: {
        type: String,
        required: true,
        enum: ["broken_link", "inappropriate_content", "incorrect_info", "other"],
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "resolved", "dismissed"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("ToolReport", toolReportSchema);
