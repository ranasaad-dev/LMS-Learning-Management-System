const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  enrollCourse,
  getMyCourses,
  updateProgress,
  unenrollCourse,
  getStudents
} = require("../controllers/enrollmentController");

// Enroll in a course
router.post("/:id", protect(["student"])  , enrollCourse);

// Get all enrolled courses of logged-in user
router.get("/", protect(["student"]) , getMyCourses);

// Update course progress
router.put("/:id", protect(["student"]) , updateProgress);

// Unenroll from a course
router.delete("/:id", protect(["student"]) , unenrollCourse);

// Get enrolled students of a course
router.get("/:id/students", protect(["instructor"]) , getStudents);
module.exports = router;