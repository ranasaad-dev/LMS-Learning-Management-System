import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import enrollmentService from "/src/services/enrollmentService.js";
import CourseProgressCard from "/src/components/course/course-progress-card/CourseProgressCard";
import Loading from "../../../../components/ui/Loading";
import "./MyCourses.css";

function MyCourses() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchCourses = async () => {

      try {
        const data = await enrollmentService.getMyCourses();
        setCourses(data);

      } catch {
        setError("Failed to load enrolled courses");
      }

      setLoading(false);
    };

    fetchCourses();

  }, []);

  if (loading) {
    return (
      <div className="mycourses-loading">
<Loading />
      </div>
    );
  }


  return (
    <div className="mycourses-container">
      <div className="mycourses-header">
        <h2>My Courses</h2>
        <p>Continue learning where you left off</p>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <h4>No enrolled courses yet</h4>
          <p>Browse courses and start learning today.</p>
          <Link to="/courses" className="dashboard-link"> Explore </Link>
        </div>
      ) : (
        <div className="courses-grid">

          {courses.map((enrollment) => (
            <CourseProgressCard
              key={enrollment._id}
              enrollment={enrollment}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default MyCourses;