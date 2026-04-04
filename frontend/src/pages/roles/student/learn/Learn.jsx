import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";

import lessonService from "../../../../services/lessonService";
import enrollmentService from "../../../../services/enrollmentService";

import LessonPlayer from "../../../../components/lesson/LessonPlayer";
import ProgressBar from "../../../../components/ui/ProgressBar";
import ReviewForm from "../../../../components/review/ReviewForm";
import ReviewList from "../../../../components/review/ReviewList";
import Loading from "../../../../components/ui/Loading";
import { FaPlayCircle, FaLock, FaCheckCircle } from "react-icons/fa";
import "./Learn.css";

function Learn() {
  const { courseId } = useParams();

  // ================= STATE =================
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);

  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [progress, setProgress] = useState(0);
  /** Mirrors enrollment.lessonProgress for resume (watchedSeconds per lesson). */
  const [lessonProgressEntries, setLessonProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reviewsVersion, setReviewsVersion] = useState(0);

  const lastProgressRef = useRef(null);

  // ================= INIT ================
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        const [lessonData, enrollments] = await Promise.all([
          lessonService.getLessonsByCourse(courseId),
          enrollmentService.getMyCourses(),
        ]);

        const sortedLessons = (lessonData || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        const enrollment = enrollments?.find(
          (e) => e.course?._id?.toString() === courseId
        );

        setupState(sortedLessons, enrollment);
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  
  }, [courseId]);

  // ================= SETUP =================
  const setupState = (lessons, enrollment) => {
    setLessons(lessons);
    if (!enrollment) {
      setCurrentLesson(lessons[0] || null);
      setCompletedLessonIds(new Set());
      setProgress(0);
      setLessonProgressEntries([]);
      return;
    }

    const lp = enrollment.lessonProgress || [];

    const completed = new Set(
      lp.filter(e => e.completed).map(e => e.lesson.toString())
    );

    setCompletedLessonIds(completed);
    setProgress(enrollment.progress ?? 0);
    setLessonProgressEntries(lp);
    setCurrentLesson(getResumeLesson(lp, lessons));
  };

  // ================= RESUME =================
  const getResumeLesson = (lp, lessons) => {
    if (!lp.length) return lessons[0] || null;

    const incomplete = lp.filter(e => !e.completed);
    const source = incomplete.length ? incomplete : lp;

    const best = source.sort(
      (a, b) =>
        (b.watchedSeconds || 0) - (a.watchedSeconds || 0) ||
        new Date(b.lastWatchedAt || 0) - new Date(a.lastWatchedAt || 0)
    )[0];

    return (
      lessons.find(l => l._id?.toString() === best?.lesson?.toString()) ||
      lessons[0] ||
      null
    );
  };

  // ================= MEMO =================
  const currentIndex = useMemo(() => {
    return lessons.findIndex(
      l => l._id?.toString() === currentLesson?._id?.toString()
    );
  }, [lessons, currentLesson]);

  const isCurrentCompleted = useMemo(() => {
    return currentLesson && completedLessonIds.has(currentLesson._id?.toString());
  }, [currentLesson, completedLessonIds]);

  /** Saved watch position (seconds) for the active lesson — from enrollment.lessonProgress. */
  const startSeconds = useMemo(() => {
    if (!currentLesson?._id || !lessonProgressEntries.length) return 0;
    const entry = lessonProgressEntries.find(
      (e) => e.lesson?.toString() === currentLesson._id.toString()
    );
    const raw = Number(entry?.watchedSeconds);
    if (Number.isNaN(raw) || raw < 0) return 0;
    const cap = Number(currentLesson.duration);
    if (cap > 0 && raw > cap) return cap;
    return raw;
  }, [currentLesson, lessonProgressEntries]);

  // ================= HELPERS =================
  const isCompleted = useCallback(
    (id) => completedLessonIds.has(id?.toString()),
    [completedLessonIds]
  );

  const isUnlocked = useCallback(
    (index) => {
      if (index === 0) return true;
      return isCompleted(lessons[index - 1]?._id);
    },
    [lessons, isCompleted]
  );

  // ================= PROGRESS TRACK =================
  const handleProgress = useCallback((data) => {
    if (!currentLesson) return;

    lastProgressRef.current = {
      lessonId: currentLesson._id,
      watchedSeconds: data.watchedSeconds,
      duration: data.duration,
    };

    setLessonProgressEntries((prev) => {
      const id = currentLesson._id.toString();
      const idx = prev.findIndex((e) => e.lesson?.toString() === id);
      const row = {
        lesson: currentLesson._id,
        watchedSeconds: data.watchedSeconds,
        completed: idx >= 0 ? prev[idx].completed : false,
        lastWatchedAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...row };
        return next;
      }
      return [...prev, row];
    });
  }, [currentLesson]);

  // Auto-save every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      const snap = lastProgressRef.current;
      if (!snap?.lessonId) return;

      enrollmentService.courseProgress(courseId, {
        lessonId: snap.lessonId,
        watchedSeconds: snap.watchedSeconds,
        ...(snap.duration && { duration: snap.duration }),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [courseId]);

  // ================= COMPLETE =================
  const handleComplete = async (payload) => {
    if (!currentLesson || updating || isCurrentCompleted) return;

    try {
      setUpdating(true);

      const watchedSeconds =
        typeof payload === "object"
          ? payload.watchedSeconds
          : payload;

      const duration = typeof payload === "object" ? payload.duration : null;

      // optimistic update
      setCompletedLessonIds(prev => {
        const next = new Set(prev);
        next.add(currentLesson._id.toString());
        return next;
      });

      const updated = await enrollmentService.courseProgress(courseId, {
        lessonId: currentLesson._id,
        watchedSeconds,
        ...(duration && { duration }),
      });

      const lp = updated.lessonProgress || [];

      setCompletedLessonIds(prev => {
        const merged = new Set(prev);
        lp.forEach(e => {
          if (e.completed) merged.add(e.lesson.toString());
        });
        return merged;
      });

      setProgress(updated.progress ?? 0);
      setLessonProgressEntries(lp);
    } catch (err) {
      console.error("Complete error:", err);
    } finally {
      setUpdating(false);
    }
  };

  // ================= NAVIGATION =================
  const goToNextLesson = useCallback(() => {
    if (!isCurrentCompleted) return;

    const next = lessons[currentIndex + 1];
    if (next) setCurrentLesson(next);
  }, [lessons, currentIndex, isCurrentCompleted]);

  const handleLessonClick = useCallback((lesson, locked) => {
    if (!locked) setCurrentLesson(lesson);
  }, []);

  // ================= UI =================
  if (loading) return <Loading />;

  return (
    <div className="course-player">

      {/* SIDEBAR */}
      <div className="lesson-sidebar">
        <h3>Lessons</h3>

        <div className="lesson-list">
          {lessons.map((lesson, index) => {
            const locked = !isUnlocked(index);
            const completed = isCompleted(lesson._id);

            return (
              <div
                key={lesson._id}
                className={`lesson-item 
                  ${currentLesson?._id === lesson._id ? "active" : ""} 
                  ${locked ? "locked" : ""}`}
                onClick={() => handleLessonClick(lesson, locked)}
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
        </div>

        <ReviewForm onReviewCreated={() => setReviewsVersion(v => v + 1)} />
      </div>

      {/* MAIN */}
      <div className="right-sidebar">
    
        <LessonPlayer
          lesson={currentLesson}
          onComplete={handleComplete}
          onProgress={handleProgress}
          start={startSeconds}
        />

        <button
          className="next-btn"
          onClick={goToNextLesson}
          disabled={!isCurrentCompleted}
        >
          Next Lesson →
        </button>

        <ReviewList r={reviewsVersion} />
      </div>
    </div>
  );
}

export default Learn;