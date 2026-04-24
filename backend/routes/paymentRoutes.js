import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createCheckoutSession, handleWebhook, getPaymentStatus } from "../controllers/paymentController.js";

const router = express.Router();

// Create checkout session
router.post("/checkout", authenticateToken, createCheckoutSession);

// Webhook handler (needs raw body, handled in server.js or here if we use specific middleware)
// Note: In server.js we usually have express.json() globally. 
// For webhooks we need the raw body. We'll handle the route definition here 
// but the parsing logic might need adjustment in server.js to exclude this route from json parsing
// or we use a specific middleware here.
// Webhook handler (needs raw body, handled in server.js via verify option)
router.post("/webhook", handleWebhook);

// Check payment status
router.get("/status/:sessionId", authenticateToken, getPaymentStatus);

export default router;
