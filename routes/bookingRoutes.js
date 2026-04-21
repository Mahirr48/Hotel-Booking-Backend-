import express from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// 🔥 CREATE BOOKING
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { hotelId, roomId, checkIn, checkOut } = req.body;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      hotelId,
      roomId, // optional but important
      checkIn,
      checkOut,
    });

    res.json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 GET MY BOOKINGS (USER SIDE)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    })
      .populate("hotelId", "name location price image") // only needed fields
      .sort({ createdAt: -1 }); // latest first

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 ADMIN BOOKINGS (ONLY THEIR HOTELS)
router.get("/admin-bookings", authMiddleware, async (req, res) => {
  try {
    // ❗ safety check
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const hotels = await Hotel.find({ ownerId: req.user.id });

    const hotelIds = hotels.map(h => h._id);

    const bookings = await Booking.find({
      hotelId: { $in: hotelIds },
    })
    .populate("hotelId")
    .populate("userId", "name email"); // 🔥 useful for admin

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;