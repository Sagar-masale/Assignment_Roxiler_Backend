import bcrypt from "bcryptjs";

import Store from "../models/store.model.js";
import Rating from "../models/rating.model.js";
import User from "../models/user.model.js";

export const getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      email: req.user.email,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const ratings = await Rating.find({
      store: store._id,
    });

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length
        : 0;

    res.status(200).json({
      avgRating,
      totalRatings: ratings.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOwnerRatings = async (req, res) => {
  try {
    const store = await Store.findOne({
      owner: req.user._id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const ratings = await Rating.find({
      store: store._id,
    }).populate("user", "name email");

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.user._id, {
      password: hashedPassword,
    });

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
