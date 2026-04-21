import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import hotelRoutes from "./routes/hotelRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRequestRoutes from "./routes/adminRequestRoutes.js";
import helmet from "helmet";


import path from "path";





dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();



// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// connect DB
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

app.use("/api/hotels", hotelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/admin-requests", adminRequestRoutes);
app.use(helmet());
app.get("/debug", (req, res) => {
  res.send("NEW SERVER RUNNING");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});