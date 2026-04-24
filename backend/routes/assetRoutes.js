import express from "express";
import multer from "multer";
import {
    createAsset,
    saveAssetMetadata,
    getUserAssets,
    getAssetById,
    deleteAsset,
    updateAsset
} from "../controllers/assetController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.'));
        }
    }
});

// Create asset (upload to Cloudinary and save to DB)
router.post("/upload", authenticateToken, upload.single('file'), createAsset);

// Save asset metadata (for when upload is done separately)
router.post("/metadata", authenticateToken, saveAssetMetadata);

// Get all assets for a user
router.get("/user/:userId", authenticateToken, getUserAssets);

// Get asset by ID
router.get("/:id", authenticateToken, getAssetById);

// Update asset metadata
router.patch("/:id", authenticateToken, updateAsset);

// Delete asset
router.delete("/:id", authenticateToken, deleteAsset);

export default router;
