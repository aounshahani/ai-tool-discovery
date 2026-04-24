import jwt from "jsonwebtoken";
import User from "../model/User.js";

// JWT verification middleware
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: "Access token required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        
        // Check if user still exists and is active
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user || user.status !== "active") {
            return res.status(401).json({ message: "User not found or inactive" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            res.status(403).json({ message: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            res.status(403).json({ message: "Token expired" });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
};

// Role-based authorization middleware
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Insufficient permissions. Required roles: ${roles.join(", ")}` 
            });
        }

        next();
    };
};

// Refresh token middleware
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }

        const decoded = jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret"
        );

        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newAccessToken = user.generateAuthToken();
        
        res.json({
            accessToken: newAccessToken,
            expiresIn: process.env.JWT_EXPIRE || "1d"
        });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};