const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");
const sendOTP = require("../utils/nodemailer.js");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // check existing user
    const user = await User.findOne({ email });

    if (user) { 
      console.log("user found");
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
  
   
    await User.create({
      name: name,
      email: email,
      password: password,
      otp: otp,
      isVerified: false,

    });
 
  
      try {
        console.log(`sending ${otp} on ${email}`);
        await sendOTP(email, otp);
      } catch (err) {
        console.log("Email error:", err.message);
    }
      
    const otpToken = generateToken(email, password);
    res.status(201).json({
      message: "Please verify OTP sent to your email.",
      tkn: otpToken
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  console.log("verification request recieved");
  try {
    const { otp, token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const {id} = decoded;
    const user = await User.findOne({ email:id });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== String(otp)) return res.status(400).json({ message: "Invalid OTP" });
    if(user.isVerified === true) return res.status(200).json({ message: "User already verified" });
    user.isVerified = true;
    user.otp = null; // clear OTP
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.isVerified != true) {
      return res.status(400).json({ message: "User not verified" });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
// PROFILE
exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id);
    if (user.isVerified != true) {
      return res.status(400).json({ message: "User not verified" });
    }
    user.password = undefined;
    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

exports.updateUser = async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;

  // req.user comes from JWT middleware
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (!currentPassword) {
    return res.status(400).json({
      message: "Current password required"
    });
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      message: "Current password is incorrect"
    });
  }
  if (user.isVerified != true) {
    return res.status(400).json({ message: "User not verified" });
  }

  try {

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await user.save();
    updatedUser.password = undefined;
    updatedUser.isVerified = undefined;
    updatedUser.otp = undefined;
    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};