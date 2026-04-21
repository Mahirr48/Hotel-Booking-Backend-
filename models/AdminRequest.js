import mongoose from "mongoose";

const adminRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  hotelName: String,
  location: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true }); // 🔥 REQUIRED

export default mongoose.model("AdminRequest", adminRequestSchema);