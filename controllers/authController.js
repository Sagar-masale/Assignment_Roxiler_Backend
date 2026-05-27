import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";



export const signup = async (req, res) => {
  try {
    const { name, email, address, password } =
      req.body;

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters and include one uppercase letter and one special character",
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updatePassword =
  async (req, res) => {
    try {
      const { password } = req.body

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be 8-16 characters and include uppercase and special character",
        })
      }

      const hashedPassword =
        await bcrypt.hash(password, 10)

      await User.findByIdAndUpdate(
        req.user._id,
        {
          password: hashedPassword,
        }
      )

      res.status(200).json({
        message:
          "Password updated successfully",
      })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      })
    }
  }