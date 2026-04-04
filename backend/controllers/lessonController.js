const Lesson = require("../models/lessonModel");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollmentModel");
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
    if (req.user.role !== "admin") {
      if (foundCourse.instructor.toString() !== req.user.id) {
        const error = new Error("Not your course !");
        error.statusCode = 403;
        throw error;
      }
    }


    // Safe numeric duration (no negatives)
    const parsedDuration = duration === undefined || duration === null ? 0 : Number(duration);
    if (Number.isNaN(parsedDuration)) {
      return res.status(400).json({ message: "Invalid duration" });
    }
    if (parsedDuration < 0) {
      return res.status(400).json({ message: "Duration must be >= 0" });
    }
    const lessonDuration = parsedDuration;

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
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Authorization: instructor can only read their own course lessons
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (req.user.role === "student") {
      // Students can read lessons only for courses they are enrolled in
      const enrollment = await Enrollment.findOne({
        student: req.user.id,
        course: courseId
      });
      if (!enrollment) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }
    } else if (req.user.role !== "admin") {
      // Instructors can only read lessons of their own courses
      if (course.instructor.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    const lessons = await Lesson.find({ course: courseId }).sort({ createdAt: -1 });
    return res.json(lessons);
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
    if (req.user.role !== "admin" && lesson.course.instructor.toString() !== req.user.id) {
      const error = new Error("Not your course !");
      error.statusCode = 403;
      throw error;
    }

    const allowedFields = ["title", "videoUrl", "duration"];
    const extraFields = Object.keys(req.body || {}).filter(
      (key) => !allowedFields.includes(key)
    );
    if (extraFields.length) {
      return res.status(400).json({
        message: `Invalid fields: ${extraFields.join(", ")}`
      });
    }

    const updatePayload = {};
    if (req.body.title !== undefined) updatePayload.title = req.body.title;
    if (req.body.videoUrl !== undefined) updatePayload.videoUrl = req.body.videoUrl;

    let deltaDuration = 0;
    if (req.body.duration !== undefined) {
      const parsed = Number(req.body.duration);
      if (Number.isNaN(parsed)) {
        return res.status(400).json({ message: "Invalid duration" });
      }
      if (parsed < 0) {
        return res.status(400).json({ message: "Duration must be >= 0" });
      }
      updatePayload.duration = parsed;
      deltaDuration = parsed - lesson.duration;
    }

    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const updatedLesson = await Lesson.findByIdAndUpdate(
        req.params.id,
        updatePayload,
        { new: true, runValidators: true, session }
      );
      // Keep Course.totalDuration in sync with Lesson.duration
      if (req.body.duration !== undefined) {
        await Course.findByIdAndUpdate(
          lesson.course._id,
          { $inc: { totalDuration: deltaDuration } },
          { session }
        );
      }

      await session.commitTransaction();
      return res.json(updatedLesson);
    } catch (txnError) {
      if (session) await session.abortTransaction().catch(() => {});
      throw txnError;
    } finally {
      if (session) await session.endSession().catch(() => {});
    }

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
    if (req.user.role !== "admin" && lesson.course.instructor.toString() !== req.user.id) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      // Delete lesson + update course in a single transaction
      await Lesson.deleteOne({ _id: lesson._id }, { session });
      await Course.findByIdAndUpdate(
        lesson.course._id,
        { $pull: { lessons: lesson._id }, $inc: { totalDuration: -lesson.duration } },
        { session }
      );
      await session.commitTransaction();
      return res.json({ message: "Lesson deleted successfully" });
    } catch (txnError) {
      if (session) await session.abortTransaction().catch(() => {});
      throw txnError;
    } finally {
      if (session) await session.endSession().catch(() => {});
    }

  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
