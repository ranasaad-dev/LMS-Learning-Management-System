import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaDollarSign, FaImage } from "react-icons/fa";
import { useAuth } from "/src/context/AuthContext";
import courseService from "../../../../services/courseService";
import Input from "../../../../components/ui/input/Input";
import Label from "/src/components/ui/label/Label";
import "./CreateCourse.css";

export default function CreateCourse() {

  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: "", description: "", price: "", category: "", thumbnail: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { title, description, price, category, thumbnail } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      setError("Please fill all required fields.");
      return; 
    }

    try {
      setLoading(true);
      setError("");
      const newCourse = await courseService.createCourse(formData);
      navigate(`/dashboard/${user._id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-container">
        <h2>Create New Course</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit} className="create-course-form">
          <div className="form-group">
            <Label>Course Title</Label>
            <div className="input-group">
              <FaBook />
              <Input t="text" n="title" p="Enter course title" v={formData.title} o={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <Label>Description</Label>
            <textarea name="description" p="Write course description..." value={description} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <Label>Price ($)</Label>
              <div className="input-group">
                <FaDollarSign />
                <Input t="number" n="price" p="49" v={price} o={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <Label>Category</Label>
              <Input t="text" n="category" p="Web Development" v={formData.category} o={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <Label>Thumbnail URL</Label>
            <div className="input-group">
              <FaImage />
              <Input t="text" n="thumbnail" p="https://image-url.com/course.jpg" v={thumbnail} o={handleChange} />
            </div>
          </div>

          <button t="submit" className="create-course-btn" disabled={loading} >
            {loading ? "Creating Course..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}

