import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CourseList.css";
import { FaUserGraduate, FaDollarSign } from "react-icons/fa";
import Loading from "../../../components/ui/Loading";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/courses`);
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="course-list-error">{error}</div>;
  }

  return (
    <div className="course-list-container">
      {courses.map((course) => (
        <Link
          to={`/courses/${course._id}`}
          className="course-card"
          key={course._id}
        >
          <div className="course-card-image">
            <img src={course.thumbnail} alt={course.title} />
          </div>
          <div className="course-card-content">
            <h3 className="course-card-title">{course.title}</h3>
            <p className="course-card-desc">{course.description}</p>
            <div className="course-card-meta">
              <span className="course-instructor">
                <FaUserGraduate /> {course.instructor.name}
              </span>
              <span className="course-price">
                <FaDollarSign /> {course.price}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CourseList;