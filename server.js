import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";

import hotelRoutes from "./routes/hotelRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRequestRoutes from "./routes/adminRequestRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ TRUST PROXY (important for deployment)
app.set("trust proxy", 1);

// ✅ SECURITY FIRST
app.use(helmet());

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hotel-booking-frontend-one-phi.vercel.app" // ← change this
  ],
  credentials: true
}));

// ✅ BODY PARSER
app.use(express.json());

// ✅ TEST
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ DB
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

// ✅ ROUTES
app.use("/api/hotels", hotelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin-requests", adminRequestRoutes);

// ✅ STATIC FILES

// ✅ DEBUG
app.get("/debug", (req, res) => {
  res.send("NEW SERVER RUNNING");
});

// ✅ START
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});