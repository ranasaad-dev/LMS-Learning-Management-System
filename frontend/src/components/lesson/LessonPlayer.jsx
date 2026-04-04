import "./LessonPlayer.css";
import { FaPlayCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ProgressBar from "../ui/ProgressBar";

function LessonPlayer({ lesson, onComplete, setProgress, onProgress }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const completionFiredRef = useRef(false);
  const [lessonProgress, setLessonProgress] = useState(0);

  useEffect(() => {
    if (!lesson?.videoUrl) return;
    completionFiredRef.current = false;

    // Extract a YouTube id from common URL formats.
    const extractYouTubeId = (input) => {
      if (!input) return null;

      // Sometimes we store just the id.
      if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

      try {
        const urlObj = new URL(input);
        const host = urlObj.hostname.replace(/^www\./, "");
        const pathname = urlObj.pathname || "";

        // youtu.be/<id>
        if (host === "youtu.be") {
          const id = pathname.split("/").filter(Boolean)[0];
          return id || null;
        }

        // youtube.com/watch?v=<id>
        const v = urlObj.searchParams.get("v");
        if (v) return v;

        // youtube.com/embed/<id>, /shorts/<id>, /live/<id>
        const parts = pathname.split("/").filter(Boolean);
        const idx = ["embed", "shorts", "live"].indexOf(parts[0]);
        if (idx !== -1 && parts[1]) return parts[1];

        // Fallback: if the path is just "<id>"
        if (parts[0] && /^[a-zA-Z0-9_-]{11}$/.test(parts[0])) return parts[0];
      } catch {
        // ignore
      }

      return null;
    };

    setLessonProgress(0);
    if (typeof setProgress === "function") setProgress(0);

    const videoId = extractYouTubeId(lesson.videoUrl);
    if (!videoId) return;

    // Cleanup
    if (playerRef.current) {
      if (typeof playerRef.current.destroy === "function") playerRef.current.destroy();
      playerRef.current = null;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
console.log(lessonProgress);
    const createPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0, 
          rel: 0,
          disablekb:1,
          color:"red",
          start: 0,
          fs: 1, // hide fullscreen button when controls are minimal
        },
        events: {
          onReady: () => {
            intervalRef.current = setInterval(() => {
              if (!playerRef.current) return;

              const current = playerRef.current.getCurrentTime();
              const ytDuration = playerRef.current.getDuration();

              // Use the lesson duration from the backend (prevents anti-cheat 400s)
              // but fall back to YouTube duration if it wasn't provided.
              const lessonDuration = Number(lesson.duration);
              const effectiveDuration =
                lessonDuration && lessonDuration > 0 ? lessonDuration : ytDuration;

              if (!effectiveDuration) return;

              const watchedSeconds = Math.min(current, effectiveDuration);
              const percent = (watchedSeconds / effectiveDuration) * 100;
              const cleanPercent = Math.min(100, Math.round(percent));

              setLessonProgress(cleanPercent);
              if (typeof setProgress === "function") setProgress(cleanPercent);

              if (typeof onProgress === "function") {
                onProgress({ watchedSeconds, duration: effectiveDuration });
              }

              // Complete at ≥95% (single fire); show full bar at 100%
              if (percent >= 95) {
                if (!completionFiredRef.current) {
                  completionFiredRef.current = true;
                  setLessonProgress(100);
                  if (typeof setProgress === "function") setProgress(100);
                  if (typeof onComplete === "function") {
                    onComplete({ watchedSeconds, duration: effectiveDuration });
                  }
                }
                clearInterval(intervalRef.current);
              }
            }, 1000);
          },
        },
      });
    };

    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }
      playerRef.current = null;
    };
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="lesson-player-empty">
        <FaPlayCircle className="empty-icon" />
        <p>Select a lesson to start learning</p>
      </div>
    );
  }

  return (
    <div className="lesson-player">
      <h2 className="lesson-title">{lesson.title}</h2>

      <div className="lesson-progress">
        <ProgressBar progress={lessonProgress} label="Lesson Progress" />
      </div>

      <div className="video-container">
        <div id="yt-player"></div>
      </div>
    </div>
  );
}

export default LessonPlayer;