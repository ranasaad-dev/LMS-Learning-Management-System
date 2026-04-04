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
    // ✅ Expected from frontend:
    // {
    //   lessonId: "lesson_id_here",
    //   watchedSeconds: number,
    //   duration: number (optional, only if lesson.duration is missing)
    // }

    const { lessonId, duration } = req.body;
    const watchedSeconds = Number(req.body.watchedSeconds);

    // 🔒 Validation
    if (!lessonId || Number.isNaN(watchedSeconds)) {
      return res.status(400).json({ message: "lessonId and watchedSeconds are required" });
    }

    // 🔍 Find enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // 🔍 Find lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // ✅ Determine duration (important for progress calc)
    let lessonDuration = lesson.duration || 0;

    // If duration missing, accept frontend value
    if (lessonDuration <= 0 && duration && duration > 0) {
      lessonDuration = duration;

      // Save it for future use
      lesson.duration = lessonDuration;
      await lesson.save();
    }

    // 🛑 Prevent invalid progress
    if (lessonDuration > 0 && watchedSeconds > lessonDuration) {
      return res.status(400).json({
        message: `watchedSeconds exceeds lesson duration (${lessonDuration})`
      });
    }

    // 🔁 Find existing lesson progress
    let entry = enrollment.lessonProgress.find(
      lp => lp.lesson.toString() === lessonId
    );

    // ➕ Create if not exists
    if (!entry) {
      entry = {
        lesson: lessonId,
        watchedSeconds: 0,
        completed: false,
        lastWatchedAt: new Date()
      };
      enrollment.lessonProgress.push(entry);
    }

    // ⛔ Never go backward
    entry.watchedSeconds = Math.max(entry.watchedSeconds, watchedSeconds);
    entry.lastWatchedAt = new Date();

    // ✅ Completion logic (≥ 95%)
    if (lessonDuration > 0) {
      const ratio = entry.watchedSeconds / lessonDuration;
      entry.completed = ratio >= 0.95;
    }

    // =========================
    // 📊 TOTAL COURSE PROGRESS
    // =========================

    const lessons = await Lesson.find({ course: req.params.id }).select("duration");
  
    const totalDuration = lessons.reduce(
      (sum, l) => sum + (l.duration || 0),
      0
    );

    const totalWatched = enrollment.lessonProgress.reduce(
      (sum, lp) => sum + lp.watchedSeconds,
      0
    );

    enrollment.progress = totalDuration
      ? Math.min(100, (totalWatched / totalDuration) * 100)
      : 0;

    await enrollment.save();

    // 📤 Response
    res.json({
      success: true,
      progress: Math.round(enrollment.progress), // overall %
      lessonProgress: enrollment.lessonProgress
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
    course.studentsEnrolled = Math.max(0, (course.studentsEnrolled || 0) - 1);
    await course.save();
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