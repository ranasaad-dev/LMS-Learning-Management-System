const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, "Course title is required"]
  },

  description: {
    type: String,
    required: [true, "Course description is required"]
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  price: {
    type: Number,
    default: 0
  },

  category: {
    type: String,
    required: true
  },

  thumbnail: {
    type: String
  },

  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson"
    }
  ],

  studentsEnrolled: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;