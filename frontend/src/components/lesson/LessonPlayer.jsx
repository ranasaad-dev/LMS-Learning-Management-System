import "./LessonPlayer.css";
import { FaPlayCircle } from "react-icons/fa";
import { useEffect, useRef } from "react";

function LessonPlayer({ lesson, onComplete, setProgress }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!lesson?.videoUrl) return;

    const getVideoId = (url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get("v");
      } catch {
        return null;
      }
    };

    const videoId = getVideoId(lesson.videoUrl);
    if (!videoId) return;

    // Cleanup
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    const createPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        playerVars: {
          autoplay: 0, // ✅ FIXED
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            intervalRef.current = setInterval(() => {
              if (!playerRef.current) return;

              const current = playerRef.current.getCurrentTime();
              const duration = playerRef.current.getDuration();

              if (!duration) return;

              const percent = (current / duration) * 100;
              const cleanPercent = Math.min(100, Math.round(percent));

              setProgress(cleanPercent);

              // ✅ COMPLETE ONLY AT 95%
              if (percent >= 95) {
                onComplete();
                clearInterval(intervalRef.current);
              }
            }, 1000);
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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

      <div className="video-container">
        <div id="yt-player"></div>
      </div>
    </div>
  );
}

export default LessonPlayer;