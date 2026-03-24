const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");


// ENROLL IN COURSE
exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId
    });
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    res.status(500).json({ message: error.message });
  }
};



// GET MY COURSES
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate("course");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE PROGRESS
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findOneAndUpdate(
      { student: req.user.id, course: req.params.courseId },
      { progress },
      { new: true }
    );
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UNENROLL FROM COURSE
exports.unenrollCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndDelete({
      student: req.user.id,
      course: req.params.courseId
    });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET STUDENTS OF A COURSE
exports.getStudents = async (req, res) => {
  const id = req.params.id;
  try {
    const students = await Enrollment.find({ course: id })
      .populate("student");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}