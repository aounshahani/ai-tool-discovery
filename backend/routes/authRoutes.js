import express from "express";
import User from "../model/User.js";
import { authenticateToken, requireRole, refreshToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Prevent admin registration - admins must be created directly in database
        if (role === "admin") {
            return res.status(403).json({
                message: "Cannot register as admin. Admin accounts must be created by system administrators."
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ name, email, password, role });
        await user.save();

        const token = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to database
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            message: "User created successfully",
            user: user.toJSON(),
            token,
            refreshToken
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: "Validation error", errors });
        }

        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if user is banned
        if (user.isBanned) {
            return res.status(403).json({
                message: "Your account has been banned",
                reason: user.bannedReason || "Violation of terms"
            });
        }

        // Check if account is active
        if (user.status !== "active") {
            return res.status(401).json({ message: "Account is inactive" });
        }

        // Generate tokens
        const token = user.generateAuthToken();
        const newRefreshToken = user.generateRefreshToken();

        // Save refresh token to database
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            message: "Login successful",
            user: user.toJSON(),
            token,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Refresh token route
router.post("/refresh", refreshToken);

// Protected route example - get user profile
router.get("/profile", authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// Admin-only route example
router.get("/admin", authenticateToken, requireRole(["admin"]), (req, res) => {
    res.json({ message: "Welcome admin!", user: req.user });
});

// Logout route (optional - client should delete token)
router.post("/logout", authenticateToken, async (req, res) => {
    try {
        // Remove refresh token from database
        req.user.refreshToken = null;
        await req.user.save();

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;