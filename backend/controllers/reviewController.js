const Review = require("../models/reviewModel");
const Course = require("../models/courseModel");
const mongoose = require("mongoose");

// ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.id;
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
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    const reviews = await Review.find({ course: req.params.id })
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
      return res.status(403).json({ message: "Not allowed to edit seomeone else's review !" });
    }

    // Whitelist updatable fields to avoid tampering (e.g. changing `student` or `course`)
    const allowedFields = ["rating", "comment"];
    const extraFields = Object.keys(req.body || {}).filter(
      (key) => !allowedFields.includes(key)
    );
    if (extraFields.length) {
      return res.status(400).json({
        message: `Invalid fields: ${extraFields.join(", ")}`
      });
    }

    const updatePayload = {};
    if (req.body.rating !== undefined) {
      const parsedRating = Number(req.body.rating);
      if (Number.isNaN(parsedRating)) {
        return res.status(400).json({ message: "Invalid rating" });
      }
      updatePayload.rating = parsedRating;
    }
    if (req.body.comment !== undefined) {
      if (typeof req.body.comment !== "string") {
        return res.status(400).json({ message: "Invalid comment" });
      }
      updatePayload.comment = req.body.comment;
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: "No valid fields provided" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );
    return res.json(updatedReview);
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
      return res.status(403).json({ message: "Not your review !" });
    }
    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};