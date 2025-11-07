import UserModel from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// 🔐 Create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🔐 Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check user existence
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Create token
    const token = createToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    console.error("Login Error:", error);
    res.json({ success: false, message: "Error during login" });
  }
};

// 📝 Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already registered" });
    }

    // Validate email and password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new UserModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    // Create token
    const token = createToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    console.error("Register Error:", error);
    res.json({ success: false, message: "Error during registration" });
  }
};
