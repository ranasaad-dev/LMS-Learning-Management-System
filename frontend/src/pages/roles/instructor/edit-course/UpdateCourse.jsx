import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import courseService from "../../../../services/courseService";
import Input from "../../../../components/ui/input/Input";
import Label from "/src/components/ui/label/Label";
import "./UpdateCourse.css";

function UpdateCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState({ title: "", description: "", price: "" });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await courseService.getCourseById(id);
                setCourse({
                    title: data.title || "",
                    description: data.description || "",
                    price: data.price || ""
                });
            } catch (err) {
                setError("Failed to load course");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);
    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!course.title || !course.description || !course.price) {
            setError("All fields are required");
            return;
        }
        try {
            setUpdating(true);
            setError("");
            await courseService.updateCourse(id, course);
            setSuccess("Course updated successfully");
            setTimeout(() => navigate(`/courses/${id}`), 1500);
        } catch (err) {
            setError("Failed to update course");
        } finally {
            setUpdating(false);
        }
    };
    if (loading) return <div className="update-course-loading">Loading...</div>;
    return (
        <div className="update-course">
            <div className="update-course-container">
                <h2 className="update-course-title">Update Course</h2>
                {error && <div className="update-course-error">{error}</div>}
                {success && <div className="update-course-success">{success}</div>}
                <form className="update-course-form" onSubmit={handleSubmit}>
                    <div className="form-group"><Label>Title</Label><Input p="Title" t="text" required n="title" v={course.title} o={handleChange} /></div>
                    <div className="form-group"><Label>Description</Label><textarea required name="description" value={course.description} onChange={handleChange}></textarea></div>
                    <div className="form-group"><Label>Price</Label><Input p="Price" t="number" required n="price" v={course.price} o={handleChange} /></div>
                    <button className="update-course-btn" disabled={updating}><FaSave /> {updating ? "Updating..." : "Update Course"}</button>
                </form>
            </div>
        </div>
    );
}
export default UpdateCourse;