import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlusCircle, FaTrash, FaPlayCircle } from "react-icons/fa";
import Label from "/src/components/ui/label/Label";
import lessonService from "../../../../services/lessonService";
import { useAuth } from "/src/context/AuthContext";

import "./AddLesson.css";

function AddLesson() {
  const { id: courseId } = useParams();
  const {user} = useAuth();
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch lessons for this course
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await lessonService.getLessonsByCourse(courseId);
        setLessons(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Add new lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();

    if (!title || !videoUrl) {
      setError("Please enter both title and video URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const newLesson = await lessonService.addLesson({
        title,
        videoUrl,
        course: courseId,
        user: user
      });
      setLessons([...lessons, newLesson]);
      setTitle("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
      setError("Failed to add lesson.");
    } finally {
      setLoading(false);
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (lessonId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson?"
    );
    if (!confirmDelete) return;

    try {
      await lessonService.deleteLesson(lessonId);
      setLessons(lessons.filter((lesson) => lesson._id !== lessonId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="add-lesson-page">
      <h2>Add Lessons</h2>

      <form className="lesson-form" onSubmit={handleAddLesson}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <Label>Lesson Title</Label>
          <input
            type="text"
            placeholder="Intro to React"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <Label>Video URL</Label>
          <input
            type="text"
            placeholder="https://video.com/react-intro"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="add-lesson-btn">
          <FaPlusCircle />
          {loading ? "Adding..." : "Add Lesson"}
        </button>
      </form>

      <div className="lesson-list">
        <h3>Lessons ({lessons.length})</h3>
        {lessons.length === 0 && <p>No lessons yet.</p>}

        {lessons.map((lesson, index) => (
          <div className="lesson-card" key={lesson._id}>
            <div className="lesson-info">
              <FaPlayCircle className="lesson-icon" />
              <div>
                <h4>{index + 1}. {lesson.title}</h4>
                <p>{lesson.videoUrl}</p>
              </div>
            </div>

            <button
              className="delete-lesson-btn"
              onClick={() => handleDeleteLesson(lesson._id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddLesson;