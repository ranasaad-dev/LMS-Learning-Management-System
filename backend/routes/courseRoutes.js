const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");


// PUBLIC ROUTES

// Get all courses
router.get("/", courseController.getCourses);

// Get single course
router.get("/:id", courseController.getCourseById);


// PROTECTED ROUTES (Instructor only)

// Create course
router.post("/", protect(["instructor", "admin"])  , courseController.createCourse);

// Update course
router.put("/:id", protect(["instructor", "admin"]) , courseController.updateCourse);

// Delete course
router.delete("/:id", protect(["instructor", "admin"]) , courseController.deleteCourse);


module.exports = router;