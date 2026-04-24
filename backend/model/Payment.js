import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tool",
        required: true
    },
    stripeSessionId: {
        type: String,
        required: true
    },
    stripePaymentIntentId: String,
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "pkr"
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    listingType: {
        type: String,
        enum: ["featured"],
        default: "featured"
    },
    duration: {
        type: Number,
        required: true
    }, // days
    startDate: Date,
    endDate: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Payment", paymentSchema);
