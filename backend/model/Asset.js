import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    // Cloudinary identifiers
    cloudinaryId: {
        type: String,
        required: true,
        unique: true
    },

    // User reference
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // URLs
    imageUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: String,

    // File metadata
    originalFilename: String,
    format: String, // jpg, png, webp, etc.
    width: Number,
    height: Number,
    size: Number, // in bytes

    // Resource information
    resourceType: {
        type: String,
        enum: ["image", "video", "raw", "auto"],
        default: "image"
    },

    // Application-specific categorization
    assetType: {
        type: String,
        enum: ["tool_logo", "profile_picture", "banner", "screenshot", "other"],
        default: "other"
    },

    // Organization
    tags: [String],

    // Additional Cloudinary metadata
    publicId: String, // Alternative storage for public_id
    version: Number,
    signature: String,
    etag: String
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
assetSchema.index({ userId: 1, createdAt: -1 });
assetSchema.index({ cloudinaryId: 1 });
assetSchema.index({ assetType: 1 });

// Virtual for file size in readable format
assetSchema.virtual('readableSize').get(function () {
    if (!this.size) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(this.size) / Math.log(1024));
    return Math.round(this.size / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for aspect ratio
assetSchema.virtual('aspectRatio').get(function () {
    if (!this.width || !this.height) return null;
    return (this.width / this.height).toFixed(2);
});

// Ensure virtuals are included in JSON
assetSchema.set('toJSON', { virtuals: true });
assetSchema.set('toObject', { virtuals: true });

export default mongoose.model("Asset", assetSchema);
