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
router.post("/:courseId", protect, enrollCourse);

// Get all enrolled courses of logged-in user
router.get("/my-courses", protect, getMyCourses);

// Update course progress
router.put("/:courseId/progress", protect, updateProgress);

// Unenroll from a course
router.delete("/:courseId", protect, unenrollCourse);

// Get enrolled students of a course
router.get("/course/:id/students", protect, getStudents);
module.exports = router;