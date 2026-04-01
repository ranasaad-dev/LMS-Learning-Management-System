const Course = require("../models/courseModel");


// CREATE COURSE (Instructor only)
exports.createCourse = async (req, res) => {

  try {

    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      thumbnail: req.body.thumbnail,
      instructor: req.user.id
    });

    res.status(201).json(course);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



// GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE COURSE
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("lessons");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE COURSE
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // only instructor who created course can update
    if(req.user.role != "admin"){
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }}

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE COURSE
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // only instructor who created course can delete
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};