const express = require("express");
const router = express.Router();

const lessonController = require("../controllers/lessonController");
const { protect } = require("../middleware/authMiddleware");


// CREATE LESSON (Instructor)
router.post("/", protect(["instructor", "admin"])  , lessonController.createLesson);


// GET LESSONS BY COURSE
router.get("/:id", protect(["student", "instructor", "admin"]) , lessonController.getLessonsByCourse);


// UPDATE LESSON
router.put("/:id", protect(["instructor", "admin"])  , lessonController.updateLesson);


// DELETE LESSON
router.delete("/:id", protect(["instructor", "admin"])  , lessonController.deleteLesson);


module.exports = router;
