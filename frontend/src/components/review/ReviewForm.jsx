import { useState } from "react";
import { useParams } from "react-router-dom";
import reviewService from "../../services/reviewService.js";
import Label from "/src/components/ui/label/Label";

function ReviewForm({ update, onReviewCreated }) {
  
  const { courseId } = useParams();
  const [review, setReview] = useState({
    rating: 5,
    comment: ""
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!review.comment.trim()) return;
    try {
  
      const newReview = await reviewService.createReview(courseId, review);
     
      if (typeof update === "function") {
        update((prev) => [newReview, ...prev]);
      }

      if (typeof onReviewCreated === "function") {
        onReviewCreated();
      }
      setReview({
        rating: 5,
        comment: ""
      });
  
    } catch {
      alert("Already Submited Review.");
   
    }
  };

  return (
    <div className="review-section">
      <div className="review-form">
        <div className="rating-select">
      <h3 className="review-title">Rating</h3>
          <select className="review-rating" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })} >
            <option value={5}>5 ⭐</option>
            <option value={4}>4 ⭐</option>
            <option value={3}>3 ⭐</option>
            <option value={2}>2 ⭐</option>
            <option value={1}>1 ⭐</option>
          </select>

        </div>

        <textarea id="opinion" className="review-input" placeholder="Write your review..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />

        <button
          className="review-submit"
          onClick={handleSubmit}
        >
          Submit Review
        </button>

      </div>


    </div>
  );
}

export default ReviewForm;