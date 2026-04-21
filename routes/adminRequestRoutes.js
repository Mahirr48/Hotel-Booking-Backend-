import express from "express";
import AdminRequest from "../models/AdminRequest.js";
import User from "../models/User.js";

const router = express.Router();


// 🔹 APPLY FOR ADMIN
router.post("/", async (req, res) => {
  try {
    const { name, email, hotelName, location } = req.body;

    // 🔥 prevent duplicate pending requests
    const existing = await AdminRequest.findOne({
      email: email.toLowerCase(),
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a pending request",
      });
    }

    const request = await AdminRequest.create({
      name,
      email: email.toLowerCase(), // 🔥 normalize email
      hotelName,
      location,
      status: "pending",
    });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 GET ALL REQUESTS (SUPER ADMIN)
router.get("/", async (req, res) => {
  try {
    const requests = await AdminRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 GET CURRENT USER REQUEST (IMPORTANT)
router.get("/my-request/:email", async (req, res) => {
  try {
    const request = await AdminRequest.findOne({
      email: req.params.email.toLowerCase(),
    }).sort({ createdAt: -1 }); // 🔥 latest request

    res.json(request); // null OR object
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 APPROVE REQUEST
router.post("/approve/:id", async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 🔥 update request first
    request.status = "approved";
    await request.save();

    // 🔥 find user
    const user = await User.findOne({
      email: request.email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 update role
    user.role = "admin";
    await user.save();

    res.json({
      message: "Approved successfully",
      request,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// 🔹 REJECT REQUEST
router.post("/reject/:id", async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      message: "Rejected successfully",
      request,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;