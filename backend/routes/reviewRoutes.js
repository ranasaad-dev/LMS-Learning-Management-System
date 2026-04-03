const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");


// ADD REVIEW TO COURSE
router.post("/:id", protect(["student"]) , reviewController.addReview);


// GET REVIEWS FOR A COURSE
router.get("/:id", reviewController.getCourseReviews);


// UPDATE REVIEW
router.put("/:id", protect(["student"])  , reviewController.updateReview);


// DELETE REVIEW
router.delete("/:id", protect(["student"])  , reviewController.deleteReview);


module.exports = router;
