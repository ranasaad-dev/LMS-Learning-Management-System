const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, "Lesson title is required"]
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  videoUrl: {
    type: String,
    required: true
  },

  duration: {
    type: Number,
    required: true,
    default: 0
  },
}, 
{
  timestamps: true
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;