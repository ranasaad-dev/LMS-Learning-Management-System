import { Link } from "react-router-dom";
import ProgressBar from "../../ui/ProgressBar";
import enrollmentService from "/src/services/enrollmentService.js";
import "./CourseProgressCard.css";
import notify from "../../ui/notify/Notify.js";
import { useEffect } from "react";

function CourseProgressCard({ enrollment }) {
  const { course, progress } = enrollment;

  const unenroll = async () => {
    if (!course || !course._id) {
      notify("Course information is missing.", "error");
      return;
    }
  
    try {
      const response = await enrollmentService.unenrollInCourse(course._id);
  
      if (response) {
        notify("Successfully unenrolled from the course.", "success");
        window.location.reload(); // refresh page
      } else {
        notify("Unenrollment failed. Please try again.", "error");
      }
  
    } catch (error) {
      console.error("Unenroll error:", error);
      notify("Something went wrong while unenrolling.", "error");
    }
  };

  return (
    course?<div className="course-progress-card">

      <div className="card-body">

        <h3 className="course-title">{course.title}</h3>

        <p className="course-description">
          {course.description?.substring(0, 100)}...
        </p>

        <ProgressBar progress={Math.floor(progress) || 0} />

        <Link
          to={`/learn/${course._id}`}
          className="continue-btn"
        >
          Continue Learning
        </Link>
<button className="continue-btn" onClick={unenroll}>Unenroll</button>
      </div>

    </div>:null
    
  );
}

export default CourseProgressCard;