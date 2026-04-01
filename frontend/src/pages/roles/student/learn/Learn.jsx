import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import lessonService from "../../../../services/lessonService";
import enrollmentService from "../../../../services/enrollmentService";
import LessonPlayer from "../../../../components/lesson/LessonPlayer";
import ProgressBar from "../../../../components/ui/ProgressBar";

import { FaPlayCircle, FaLock, FaCheckCircle } from "react-icons/fa";
import "./Learn.css";
import ReviewForm from "../../../../components/review/ReviewForm";
import ReviewList from "../../../../components/review/ReviewList";

function Learn() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);

  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ================= FETCH ALL =================
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        const lessonData = await lessonService.getLessonsByCourse(courseId);
        setLessons(lessonData);

        const enrollments = await enrollmentService.getMyCourses();

        const course = enrollments.find(
          (c) => c.course._id.toString() === courseId
        );

        if (course) {
          setCompletedLessons(course.completedLessons || []);
          
          setProgress(course.progress || 0);

          const resume =
            lessonData.find(
              (l) => l._id === course.currentLesson
            ) || lessonData[0];

          setCurrentLesson(resume);
        } else {
          setCurrentLesson(lessonData[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [courseId]);

  // ================= HELPERS =================
  const isCompleted = (id) =>
    completedLessons.some((l) => l === id);

  const isUnlocked = (index) => {
    if (index === 0) return true;
    return isCompleted(lessons[index - 1]?._id);
  };

  const currentIndex = lessons.findIndex(
    (l) => l._id === currentLesson?._id
  );

  const isCurrentCompleted = isCompleted(currentLesson?._id);

  // ================= COMPLETE LESSON =================
  const handleComplete = async () => {
    if (!currentLesson || updating || isCurrentCompleted) return;

    try {
      setUpdating(true);

      const updated = await enrollmentService.courseProgress(
        courseId,
        { lessonId: currentLesson._id }
      );

      setCompletedLessons(updated.completedLessons || []);
      setProgress(updated.progress || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // ================= NEXT =================
  const goToNextLesson = () => {
    if (!isCurrentCompleted) return;

    const next = lessons[currentIndex + 1];
    if (next) setCurrentLesson(next);
  };

  // ================= UI =================
  if (loading) return <div>Loading...</div>;

  return (
    <div className="course-player">
      
      {/* SIDEBAR */}
      <div className="lesson-sidebar">
        <h3>Lessons</h3>

        {lessons.map((lesson, index) => {
          const locked = !isUnlocked(index);
          const completed = isCompleted(lesson._id);

          return (
            <div
              key={lesson._id}
              className={`lesson-item ${
                currentLesson?._id === lesson._id ? "active" : ""
              } ${locked ? "locked" : ""}`}
              onClick={() =>
                !locked && setCurrentLesson(lesson)
              }
            >
              {locked ? (
                <FaLock />
              ) : completed ? (
                <FaCheckCircle className="completed" />
              ) : (
                <FaPlayCircle />
              )}

              <span>{lesson.title}</span>
            </div>
          );
        })}

        <ReviewForm />
      </div>

      {/* MAIN */}
      <div className="right-sidebar">
        <ProgressBar progress={lessonProgress} />

        <LessonPlayer
          lesson={currentLesson}
          onComplete={handleComplete}
          setProgress={setLessonProgress}
        />

        <button
          className="next-btn"
          onClick={goToNextLesson}
          disabled={!isCurrentCompleted}
        >
          Next Lesson →
        </button>

        <ReviewList />
      </div>
    </div>
  );
}

export default Learn;