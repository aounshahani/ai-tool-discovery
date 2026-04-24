import Asset from "../model/Asset.js";
import { uploadImage, deleteImage } from "../cloudinary/config.js";

/**
 * Create a new asset record in the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createAsset = async (req, res) => {
    try {
        const { assetType, tags } = req.body;

        // Get userId from authenticated user (JWT token)
        const userId = req.user._id;

        // Validate required fields
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User authentication required"
            });
        }

        if (!req.file && !req.body.fileUrl) {
            return res.status(400).json({
                success: false,
                message: "No file provided"
            });
        }

        // Upload to Cloudinary
        const file = req.file ? req.file.path : req.body.fileUrl;
        const uploadOptions = {
            folder: `ai-tool-discovery/${assetType || 'other'}`,
            tags: tags ? (Array.isArray(tags) ? tags : [tags]) : []
        };

        const uploadResult = await uploadImage(file, uploadOptions);

        if (!uploadResult.success) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image",
                error: uploadResult.error
            });
        }

        // Create asset record in database
        const asset = new Asset({
            cloudinaryId: uploadResult.cloudinaryId,
            userId,
            imageUrl: uploadResult.imageUrl,
            thumbnailUrl: uploadResult.thumbnailUrl,
            originalFilename: uploadResult.originalFilename,
            format: uploadResult.format,
            width: uploadResult.width,
            height: uploadResult.height,
            size: uploadResult.size,
            resourceType: uploadResult.resourceType,
            assetType: assetType || 'other',
            tags: uploadOptions.tags,
            publicId: uploadResult.publicId,
            version: uploadResult.version,
            signature: uploadResult.signature,
            etag: uploadResult.etag
        });

        await asset.save();

        res.status(201).json({
            success: true,
            message: "Asset created successfully",
            data: asset
        });
    } catch (error) {
        console.error("Create asset error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create asset",
            error: error.message
        });
    }
};

/**
 * Save asset metadata to database (for when upload is done separately)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const saveAssetMetadata = async (req, res) => {
    try {
        const assetData = req.body;

        // Validate required fields
        if (!assetData.cloudinaryId || !assetData.userId || !assetData.imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: cloudinaryId, userId, and imageUrl"
            });
        }

        const asset = new Asset(assetData);
        await asset.save();

        res.status(201).json({
            success: true,
            message: "Asset metadata saved successfully",
            data: asset
        });
    } catch (error) {
        console.error("Save asset metadata error:", error);

        // Handle duplicate cloudinaryId
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Asset with this Cloudinary ID already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to save asset metadata",
            error: error.message
        });
    }
};

/**
 * Get all assets for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserAssets = async (req, res) => {
    try {
        const { userId } = req.params;
        const { assetType, limit = 50, page = 1 } = req.query;

        const query = { userId };
        if (assetType) {
            query.assetType = assetType;
        }

        const skip = (page - 1) * limit;

        const assets = await Asset.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Asset.countDocuments(query);

        res.status(200).json({
            success: true,
            data: assets,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get user assets error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve assets",
            error: error.message
        });
    }
};

/**
 * Get a single asset by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;

        const asset = await Asset.findById(id).populate('userId', 'name email');

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.status(200).json({
            success: true,
            data: asset
        });
    } catch (error) {
        console.error("Get asset by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve asset",
            error: error.message
        });
    }
};

/**
 * Delete an asset (from both Cloudinary and database)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const asset = await Asset.findById(id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        // Delete from Cloudinary
        const cloudinaryResult = await deleteImage(asset.cloudinaryId, asset.resourceType);

        if (!cloudinaryResult.success) {
            console.warn("Failed to delete from Cloudinary:", cloudinaryResult.error);
            // Continue with database deletion even if Cloudinary deletion fails
        }

        // Delete from database
        await Asset.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully",
            cloudinaryDeleted: cloudinaryResult.success
        });
    } catch (error) {
        console.error("Delete asset error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete asset",
            error: error.message
        });
    }
};

/**
 * Update asset metadata
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updating critical fields
        delete updates.cloudinaryId;
        delete updates.userId;
        delete updates._id;

        const asset = await Asset.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset updated successfully",
            data: asset
        });
    } catch (error) {
        console.error("Update asset error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update asset",
            error: error.message
        });
    }
};
