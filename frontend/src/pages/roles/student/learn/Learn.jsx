import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import lessonService from "../../../../services/lessonService";
import LessonPlayer from "../../../../components/lesson/LessonPlayer";
import { FaPlayCircle } from "react-icons/fa";
import "./Learn.css";
import ReviewForm from "../../../../components/review/ReviewForm";
import ReviewList from "../../../../components/review/ReviewList";

function Learn() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getLessonsByCourse(courseId);
      setLessons(data);
      if (data.length > 0) {
        setCurrentLesson(data[0]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const handleLessonClick = async (lesson) => {
    setCurrentLesson(lesson);
  };

  if (loading) {
    return <div className="course-player-loading">Loading lessons...</div>;
  }

  if (error) {
    return <div className="course-player-error">{error}</div>;
  }

  return (
    <div className="course-player">
      <div className="lesson-sidebar">
        <h3 className="sidebar-title">Lessons</h3>
        <div className="lesson-list">
          {lessons.map((lesson, index) => (
            <div key={lesson._id} className={`lesson-item ${currentLesson?._id === lesson._id ? "active" : ""}`} onClick={() => handleLessonClick(lesson, index)} >
              <FaPlayCircle className="lesson-icon" />
              <span className="lesson-title">
                {index + 1}. {lesson.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="lesson-content">
        {/* <ProgressBar progress={progress} /> */}
        <div className="video-wrapper">
          <LessonPlayer lesson={currentLesson} />
        </div>

        <ReviewList r={reviews}/>
      </div>

      <ReviewForm update={setReviews} />
    </div>

  );
}

export default Learn;