import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import {app,server} from "./lib/socket.js";
// Load environment variables
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ;


// CORS should be set before defining routes
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Handle 404 errors
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler (for better debugging)
app.use((err, _req, res, next) => {
    console.error("Error: ", err.message);
    res.status(500).json({ message: err.message || "Something went wrong!" });
});

// Serve frontend in production mode
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (_req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Start the server after DB is connected
async function startServer() {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log("Server is running on PORT: " + PORT);
        });
    } catch (error) {
        console.error("Failed to start the server:", error.message);
    }
}

startServer();
 

// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import path from "path";

// import { connectDB } from "./lib/db.js";

// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
// // import { app, server } from "./lib/socket.js";

// dotenv.config();


// // const __dirname = path.resolve();
// const app = express(); // Initialize the app

// app.use(express.json());
// const PORT = process.env.PORT;

// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5174",
//     credentials: true,
//   })
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // if (process.env.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname, "../frontend/dist")));

// //   app.get("*", (_req, res) => {
// //     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
// //   });
// // }

// app.listen(PORT, () => {
//   console.log("server is running on PORT:" + PORT);
//   connectDB();
// });











