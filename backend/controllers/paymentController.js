import Stripe from "stripe";
import Payment from "../model/Payment.js";
import Tool from "../model/Tool.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
export const createCheckoutSession = async (req, res) => {
    try {
        const { toolId, duration } = req.body; // duration in days

        const tool = await Tool.findOne({ _id: toolId, userId: req.user.id });
        if (!tool) {
            return res.status(404).json({ message: "Tool not found or unauthorized" });
        }

        // Pricing in PKR (cents/paisa not usually supported for PKR in Stripe, but amount is integer)
        // Stripe requires smallest currency unit. For PKR, it's usually just PKR amount * 100 if it supports decimals,
        // but Stripe treats zero-decimal currencies differently. 
        // Actually Stripe supports PKR. It is a 2-decimal currency. So 5000 PKR = 500000 cents.

        const pricing = {
            7: 500000,   // 5,000.00 PKR
            30: 1500000, // 15,000.00 PKR
            90: 4000000  // 40,000.00 PKR
        };

        const amount = pricing[duration];

        if (!amount) {
            return res.status(400).json({ message: "Invalid duration selected" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "pkr",
                    product_data: {
                        name: `Featured Listing - ${tool.name}`,
                        description: `${duration} days featured placement on AI Tool Discovery`
                    },
                    unit_amount: amount
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/creator/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/creator/dashboard?payment=cancelled`,
            metadata: {
                toolId: toolId.toString(),
                userId: req.user.id.toString(),
                duration: duration.toString()
            }
        });

        // Create pending payment record
        const payment = new Payment({
            userId: req.user.id,
            toolId,
            stripeSessionId: session.id,
            amount: amount / 100, // Store as main unit
            currency: "pkr",
            duration,
            status: "pending"
        });

        await payment.save();

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ message: "Error creating checkout session", error: error.message });
    }
};

// Handle Stripe Webhook
export const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody || req.body, // Use rawBody if available (from verify middleware)
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { toolId, duration } = session.metadata;

        try {
            const payment = await Payment.findOne({ stripeSessionId: session.id });

            if (payment) {
                payment.status = "completed";
                payment.stripePaymentIntentId = session.payment_intent;
                payment.startDate = new Date();
                // Calculate end date
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + parseInt(duration));
                payment.endDate = endDate;

                await payment.save();

                // Update tool featured status
                await Tool.findByIdAndUpdate(toolId, {
                    featured: true,
                    featuredUntil: endDate
                });

                console.log(`Payment successful for tool ${toolId}. Featured until ${endDate}`);
            }
        } catch (error) {
            console.error("Error processing webhook:", error);
        }
    }

    res.json({ received: true });
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const payment = await Payment.findOne({ stripeSessionId: sessionId });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json({ status: payment.status, toolId: payment.toolId });
    } catch (error) {
        res.status(500).json({ message: "Error fetching payment status", error: error.message });
    }
};
