import "./LessonPlayer.css";
import { FaPlayCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ProgressBar from "../ui/ProgressBar";

function LessonPlayer({ lesson, onComplete, setProgress, onProgress, start = 0 }) {
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

    const startSec = Math.max(0, Number(start) || 0);

    const createPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            const player = event.target;

            const ytDuration = player.getDuration();
            const lessonDuration = Number(lesson.duration);
            const effectiveDuration =
              lessonDuration && lessonDuration > 0 ? lessonDuration : ytDuration;

            let seekToTime = startSec;
            if (effectiveDuration > 0) {
              seekToTime = Math.min(startSec, Math.max(0, effectiveDuration - 0.25));
            }

            if (seekToTime > 0 && typeof player.seekTo === "function") {
              player.seekTo(seekToTime, true);
            }

            if (effectiveDuration > 0) {
              const initialWatched = Math.min(seekToTime, effectiveDuration);
              setLessonProgress(
                Math.min(100, Math.round((initialWatched / effectiveDuration) * 100))
              );
            }

            intervalRef.current = setInterval(() => {
              if (!playerRef.current) return;

              const current = playerRef.current.getCurrentTime();
              const ytDur = playerRef.current.getDuration();

              const lessonDur = Number(lesson.duration);
              const effDur =
                lessonDur && lessonDur > 0 ? lessonDur : ytDur;

              if (!effDur) return;

              const watchedSeconds = Math.min(current, effDur);
              const percent = (watchedSeconds / effDur) * 100;
              const cleanPercent = Math.min(100, Math.round(percent));

              setLessonProgress(cleanPercent);
              if (typeof setProgress === "function") setProgress(cleanPercent);

              if (typeof onProgress === "function") {
                onProgress({ watchedSeconds, duration: effDur });
              }

              if (percent >= 95) {
                if (!completionFiredRef.current) {
                  completionFiredRef.current = true;
                  setLessonProgress(100);
                  if (typeof setProgress === "function") setProgress(100);
                  if (typeof onComplete === "function") {
                    onComplete({ watchedSeconds, duration: effDur });
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