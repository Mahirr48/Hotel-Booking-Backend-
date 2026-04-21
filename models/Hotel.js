import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  image: String,
  description: String,
  amenities: [String],

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  rooms: [
    {
      title: String,
      price: Number,
      maxGuests: Number,
    },
  ],
});

export default mongoose.model("Hotel", hotelSchema);