// import mongoose from "mongoose";

// const toolSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     logo: String,
//     category: String,
//     description: String,
//     pricing: String,
//     useCases: [String],
//     link: String,
//     createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("Tool", toolSchema);


import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: String,
    category: String,
    description: String,
    pricing: String,
    useCases: [String],
    integrationOptions: [String],
    link: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Admin moderation fields
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    rejectionReason: { type: String },
    approvedAt: { type: Date },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // Monetization fields
    featured: { type: Boolean, default: false },
    featuredUntil: { type: Date },
    sponsoredBy: { type: String },
    affiliateLink: { type: String },
    // Rating fields
    ratingCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Tool", toolSchema);
