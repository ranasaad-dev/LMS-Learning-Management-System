const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const Lesson = require("../models/lessonModel");
const mongoose = require("mongoose");

// ENROLL IN COURSE
exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      progress: 0,
      lessonProgress: []
    });
    course.studentsEnrolled += 1;
    await course.save();
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET MY COURSES
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        populate: { path: "lessons", select: "title order duration" } // optional
      });
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROGRESS
exports.updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const watchedSeconds = Number(req.body.watchedSeconds);

    if (!lessonId || watchedSeconds == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id
    });

    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Find or create lesson progress entry
    let entry = enrollment.lessonProgress.find(l => l.lesson.toString() === lessonId);
    if (!entry) {
      entry = {
        lesson: lessonId,
        watchedSeconds: watchedSeconds,
        completed: false,
        lastWatchedAt: new Date()
      };
      enrollment.lessonProgress.push(entry);
    }

    // Anti-cheat: cannot watch more than lesson duration + buffer
    if (watchedSeconds > lesson.duration) {
      return res.status(400).json({ message: `Invalid progress detected. Lesson Duration = ${lesson.duration}` });
    }

    // Never go backward
    entry.watchedSeconds = Math.max(entry.watchedSeconds, watchedSeconds);
    entry.lastWatchedAt = new Date();

    // Mark complete if watched >= 95%
    if (entry.watchedSeconds >= lesson.duration * 0.95) {
      entry.completed = true;
    }

    // Update total progress
    const lessons = await Lesson.find({ course: req.params.id });
    const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
    const totalWatched = enrollment.lessonProgress.reduce((sum, l) => sum + l.watchedSeconds, 0);

    enrollment.progress = totalDuration ? Math.min(100, (totalWatched / totalDuration) * 100) : 0;
    enrollment.currentLesson = lessonId;

    await enrollment.save();

    res.json({
      progress: Math.round(enrollment.progress),
      lessonProgress: enrollment.lessonProgress,
      currentLesson: enrollment.currentLesson
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// UNENROLL FROM COURSE
exports.unenrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    const enrollment = await Enrollment.findOneAndDelete({
      student: req.user.id,
      course: req.params.id
    });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    course.studentsEnrolled -+ 1;
    await course.save()
    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET STUDENTS OF A COURSE
exports.getStudents = async (req, res) => {
  try {
    const students = await Enrollment.find({ course: req.params.id })
      .populate("student", "name email"); // only select essential fields
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};