import mongoose from "mongoose";

// 📌 Schema for Bookmarks/Collections
const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "My AI Tools"
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner of the collection
  tools: [
    {
      tool: { type: mongoose.Schema.Types.ObjectId, ref: "Tool", required: true },
      savedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Collection", collectionSchema);

