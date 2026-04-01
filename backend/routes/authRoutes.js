const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/profile", protect(["instructor", "admin","student"])  , authController.getProfile);

router.put("/profile/:id", protect(["instructor", "admin","student"]) , authController.updateUser);


module.exports = router;