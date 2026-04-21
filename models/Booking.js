import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  checkIn: Date,
  checkOut: Date,
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed",
  },
});
export default mongoose.model("Booking", bookingSchema);