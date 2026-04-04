import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import reviewService from "/src/services/reviewService";
import notify from "/src/components/ui/notify/Notify";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Input from "/src/components/ui/input/Input.jsx";
import "./Review.css";

function ReviewList({ r }) {
  const { user } = useAuth();
  const [reviews, setreviews] = useState([]);
  const [editText, setEditText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { courseId } = useParams();
  const [reviewLoading, setReviewLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const data = await reviewService.getCourseReviews(courseId);
      setreviews(data);
    } catch (err) {
      notify(`Failed to load reviews: ${err}`, "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditText(review.comment);
    setIsEditing(true);
  };


  const handleUpdate = async (id) => {
    try {
      await reviewService.updateReview(id, { comment: editText });

      // update UI locally (important!)
      setreviews(prev =>
        prev.map(r => r._id === id ? { ...r, comment: editText } : r)
      );

      setEditText("");
      setIsEditing(false);
    } catch (err) {
      notify(err, "error");
    }
  };

  const deleteReview = async (id) => {
    var confirm = prompt("Type \"delete\" to delete the review.");
    if(confirm === "delete"){
    
    try {
      setReviewLoading(true);
      await reviewService.deleteReview(id);
      fetchReviews();
    } catch (err) {
      notify(`Failed to delete reviews: ${err}`, "error");
    } finally {
      setReviewLoading(false);
    }
  }else{
    notify("Review not deleted. Try again!!!", "warning");
  }
    
  }

  useEffect(() => {
    fetchReviews();
  }, [courseId, r]);


  return (
    <div className="review-list">
      <h3 className="review-heading">Reviews</h3>
      {reviewLoading ? (
        <p className="review-loading">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="review-empty">No reviews yet.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev._id} className="review-card">



            <div className="review-header">
              <span className="review-user">
                {rev.student?.name || "Student"}
                <span >
                  {"⭐".repeat(rev.rating)}
                </span>
              </span>
              {rev.student && rev.student._id === user._id ?
                isEditing ?
                  <span>
                    <button className="tick-btn" onClick={() => handleUpdate(rev._id)}>✔</button>
                    <button className="cross-btn" onClick={() => setIsEditing(false)}>✖</button>
                  </span> :
                  <span>
                    <FaEdit className="edit-icon" onClick={() => { handleEditClick(rev) }} />
                    <FaTrash className="delete-icon" onClick={() => deleteReview(rev._id)} />
                  </span>
                : null

              }

            </div>
            {
              rev.student && rev.student._id === user._id && isEditing ?
                <Input t="text" v={editText} o={(e) => setEditText(e.target.value)} className="edit-input" />
                :
                <p className="review-comment">{rev.comment}</p>
            }
          </div >
        ))
      )
      }
    </div >
  );
}

export default ReviewList;