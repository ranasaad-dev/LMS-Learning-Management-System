import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import courseService from "../../../../services/courseService";
import Label from "/src/components/ui/label/Label";
import "./ManageCourse.css";

function ManageCourses({ adminId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Digital",
    thumbnail: "",
  });
  const [saving, setSaving] = useState(false);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Open form for create or edit
  const openForm = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || 0,
        category: course.category || "Digital",
        thumbnail: course.thumbnail || "",
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "Digital",
        thumbnail: "",
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "Digital",
      thumbnail: "",
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Only send changed fields
      const payload = {};
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== "" &&
          (!editingCourse || formData[key] !== editingCourse[key])
        ) {
          payload[key] = formData[key];
        }
      });

      if (!editingCourse) {
        // Set instructor for new course (admin creating)
        payload.instructor = adminId;
      }

      if (editingCourse) {
        await courseService.updateCourse(editingCourse._id, payload);
      } else {
        await courseService.createCourse(payload);
      }

      fetchCourses();
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseService.deleteCourse(id);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete course");
    }
  };

  return (
    <div className="manage-courses-container">
      <h2>Manage Courses</h2>
      <button className="add-btn" onClick={() => openForm()}>
        <FaPlus /> Create New Course
      </button>

      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="courses-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price ($)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.price}</td>
                <td>{course.category}</td>
                <td>
                  <button className="edit-btn" onClick={() => openForm(course)}>
                    <FaEdit className="edit-icon" />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(course._id)}>
                    <FaTrash className="delete-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal-wrapper">
          <div className="modal-content">
            <h3>{editingCourse ? "Edit Course" : "Create Course"}</h3>
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-group">
                <Label>Title</Label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <Label>Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <Label>Price ($)</Label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <Label>Category</Label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <Label>Thumbnail URL</Label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingCourse ? "Update" : "Create"}
                </button>
                <button type="button" className="cancel-btn" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCourses;