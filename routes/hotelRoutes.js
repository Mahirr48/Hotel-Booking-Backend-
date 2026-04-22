import express from "express";
import Hotel from "../models/Hotel.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ PUBLIC (NO AUTH)
router.get("/public", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADMIN ONLY
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    let hotels;

    if (req.user.role === "super_admin") {
      hotels = await Hotel.find();
    } else {
      hotels = await Hotel.find({ ownerId: req.user.id });
    }

    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SINGLE HOTEL
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE HOTEL
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const hotel = await Hotel.create({
      name: req.body.name,
      location: req.body.location,
      price: req.body.price,
      description: req.body.description,
      amenities: JSON.parse(req.body.amenities || "[]"),
      image: req.file.path,
      ownerId: req.user.id, // 🔥 IMPORTANT
    });

    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE HOTEL
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // super admin → delete anything
    if (req.user.role === "super_admin") {
      await hotel.deleteOne();
      return res.json({ message: "Deleted by super admin" });
    }

    // admin → only own
    if (hotel.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await hotel.deleteOne();
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // ❌ admin can't edit others
    if (
      req.user.role !== "super_admin" &&
      hotel.ownerId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        location: req.body.location,
        price: req.body.price,
        description: req.body.description,
        amenities: req.body.amenities,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;