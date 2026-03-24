const Review = require("../models/reviewModel");
const Course = require("../models/courseModel");


// ADD REVIEW
exports.addReview = async (req, res) => {

  try {

    const { rating, comment } = req.body;
    const courseId = req.params.courseId;

    // check course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const review = await Review.create({
      student: req.user.id,
      course: courseId,
      rating,
      comment
    });

    res.status(201).json(review);

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ message: "You already reviewed this course" });
    }

    res.status(500).json({ message: error.message });

  }

};



// GET REVIEWS FOR A COURSE
exports.getCourseReviews = async (req, res) => {

  try {

    const reviews = await Review.find({ course: req.params.courseId })
      .populate("student", "name").sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



// UPDATE REVIEW
exports.updateReview = async (req, res) => {

  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedReview);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



// DELETE REVIEW
exports.deleteReview = async (req, res) => {

  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};