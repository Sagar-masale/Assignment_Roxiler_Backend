import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Store from "../models/store.model.js";
import Rating from "../models/rating.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalStores = await Store.countDocuments();

    const totalRatings = await Rating.countDocuments();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStores = async (req, res) => {
  try {
    const stores = await Store.find();

    const updatedStores = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({
          store: store._id,
        });

        const avgRating =
          ratings.length > 0
            ? ratings.reduce((acc, item) => acc + item.rating, 0) /
              ratings.length
            : 0;

        return {
          ...store._doc,
          avgRating,
        };
      }),
    );

    res.status(200).json(updatedStores);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters and include one uppercase letter and one special character",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createStore = async (req, res) => {
  try {
    const { name, email, address, owner } = req.body;

    await Store.create({
      name,
      email,
      address,
      owner,
    });

    res.status(201).json({
      message: "Store created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let rating = 0;

    if (user.role === "owner") {
      const store = await Store.findOne({
        owner: user._id,
      });

      if (store) {
        const ratings = await Rating.find({
          store: store._id,
        });

        rating =
          ratings.length > 0
            ? ratings.reduce((acc, item) => acc + item.rating, 0) /
              ratings.length
            : 0;
      }
    }

    res.status(200).json({
      ...user._doc,
      rating,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getStoreOwners = async (req, res) => {
  try {
    const owners = await User.find({
      role: "owner",
    }).select("-password");

    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
