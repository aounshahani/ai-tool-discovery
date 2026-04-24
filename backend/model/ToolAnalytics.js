import mongoose from "mongoose";

const toolAnalyticsSchema = new mongoose.Schema({
  toolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tool",
    required: true,
  }, // Which tool was engaged

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }, // Optional: track logged-in user

  eventType: {
    type: String,
    enum: ["impression", "click", "engagement", "view"],
    required: true,
  }, // Type of event

  timestamp: {
    type: Date,
    default: Date.now,
  }, // When event occurred

  sessionId: {
    type: String,
    default: null,
  }, // For guests, can track via session/cookie

  page: {
    type: String,
    default: null,
  }, // Optional: which page triggered the event
});

export default mongoose.model("ToolAnalytics", toolAnalyticsSchema);
