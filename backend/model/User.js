import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    role: { type: String, enum: ["user", "admin", "startup"], default: "user" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    // Admin control fields
    isBanned: { type: Boolean, default: false },
    bannedAt: { type: Date },
    bannedReason: { type: String },
    bannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: { type: Date, default: Date.now },
    refreshToken: { type: String }
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method
userSchema.methods.generateAuthToken = function () {
    const payload = {
        id: this._id,
        email: this.email,
        role: this.role,
        name: this.name,
        status: this.status
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET || "your-secret-key",
        {
            expiresIn: process.env.JWT_EXPIRE || "1d",
            issuer: "ai-tool-discovery"
        }
    );
};

// Generate refresh token method
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret",
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
    );
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    return user;
};

export default mongoose.model("User", userSchema);