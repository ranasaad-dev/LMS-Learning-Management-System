import React from "react";
import "./ProgressBar.css";
import { FaCheckCircle } from "react-icons/fa";

function ProgressBar({ progress = 0 }) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="progress-wrapper">
      <div className="progress-header">
        <label>Course Progress</label>

        <div className="progress-percentage">
          {safeProgress === 100 && <FaCheckCircle className="complete-icon" />}
          <span>{safeProgress}%</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;