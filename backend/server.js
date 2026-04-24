import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import toolRoutes from "./routes/toolRoutes.js";
import "./db/db.js"; // DB connection
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import toolAnalyticsRoutes from "./routes/toolAnalyticsRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
dotenv.config();

const app = express();

// Middleware
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/tools", toolRoutes);
app.use("/auth", authRoutes);
app.use("/reviews", reviewRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/analytics", toolAnalyticsRoutes);
app.use("/assets", assetRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", adminRoutes);
app.use("/payments", paymentRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/categories", categoryRoutes);

// Port config
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import toolRoutes from "./routes/toolRoutes.js";
// import "./db/db.js"; // DB connection
// import cookieParser from "cookie-parser";
// import authRoutes from "./routes/authRoutes.js";


// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());

// // Routes
// app.use("/tools", toolRoutes);
// app.use("/auth", authRoutes);

// // --- START: Route Logging (FIXED) ---
// // This section will log all defined routes to the console when the server starts.
// function printRoutes(app) {
//     console.log("\n--- Registered Routes ---");
//     app._router.stack.forEach(function (middleware) {
//         if (middleware.route) {
//             // This handles routes directly attached to the app (e.g., app.get('/'))
//             // Note: Your current app doesn't have direct routes outside of routers,
//             // but this is good practice for general route logging.
//             console.log(`${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
//         } else if (middleware.name === 'router') {
//             // This handles mounted routers (e.g., app.use('/auth', authRoutes))
//             const routerPath = middleware.regexp.source.replace(/\\|\^|\$|\/\?\(\?\:|\)/g, ''); // Extract base path
//             middleware.handle.stack.forEach(function (handler) {
//                 if (handler.route) {
//                     // Log routes within the mounted router
//                     console.log(`${handler.route.stack[0].method.toUpperCase()} ${routerPath}${handler.route.path}`);
//                 }
//             });
//         }
//     });
//     console.log("-----------------------\n");
// }
// // --- END: Route Logging ---


// // Port config
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//     console.log(`🚀 Server running on port ${port}`);
//     printRoutes(app); // Call the function to print routes after the server starts
// });
