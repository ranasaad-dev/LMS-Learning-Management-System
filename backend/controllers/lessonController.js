const Lesson = require("../models/lessonModel");
const Course = require("../models/courseModel");
const mongoose = require("mongoose");

// CREATE LESSON (Instructor only)
exports.createLesson = async (req, res) => {
  try {
    const { title, videoUrl, duration, course } = req.body;
    if (!mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Verify course exists
    const foundCourse = await Course.findById(course);
    if (!foundCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (req.user.role != "admin") {
      if (foundCourse.instructor.toString() !== req.user.id) {
        const error = new Error("Not your course !");
        error.statusCode = 403;
        throw error;
      }
    }


    // Safe numeric duration
    const lessonDuration = Number(duration) || 0;

    // Create lesson
    const lesson = await Lesson.create({
      title,
      videoUrl,
      duration: lessonDuration,
      course: course,

    });

    // Update course
    foundCourse.lessons.push(lesson._id);
    foundCourse.totalDuration += lessonDuration;
    await foundCourse.save();

    res.status(201).json(lesson);

  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// GET LESSONS BY COURSE
exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ "course": req.params.id })
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LESSON
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    // Authorization
    if (lesson.course.instructor.toString() !== req.user.id) {
      const error = new Error("Not your course !");
      error.statusCode = 403;
      throw error;
    }
    // Safe duration handling
    if (req.body.duration !== undefined) {
      req.body.duration = Number(req.body.duration) || 0;
      // Update course totalDuration
      lesson.course.totalDuration = lesson.course.totalDuration - lesson.duration + req.body.duration;
      await lesson.course.save();
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedLesson);

  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// DELETE LESSON
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Authorization
    if (lesson.course.instructor.toString() !== req.user.id) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }
    await lesson.deleteOne();
    // Update course: remove lesson ID and adjust totalDuration
    lesson.course.lessons.pull(lesson._id);
    lesson.course.totalDuration -= lesson.duration;
    await lesson.course.save();

    // Delete lesson

    res.json({ message: "Lesson deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
