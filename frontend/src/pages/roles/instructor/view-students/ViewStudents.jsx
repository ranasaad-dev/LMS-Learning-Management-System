import enrollmentService from "../../../../services/enrollmentService";
import { useParams } from "react-router-dom";
import notify from "/src/components/ui/notify/Notify.js";
import { useState, useEffect } from "react";
import { FaUserGraduate } from "react-icons/fa";
import Loading from "/src/components/ui/Loading.jsx";
import "./ViewStudents.css";

export default function ViewStudents() {
    const { id } = useParams();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const data = await enrollmentService.getCourseStudents(id);
            setStudents(data);
        } catch (err) {
            notify(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="students-container">
            <div className="students-header">
                <h2>Enrolled Students</h2>
                <p>{students.length} students enrolled</p>
            </div>

            {loading ? (<>
                <Loading />
                <div className="students-loading">Loading students...</div>
            </>
            ) : students.length === 0 ? (
                <div className="students-empty">
                    <FaUserGraduate size={40} />
                    <p>No students enrolled yet</p>
                </div>
            ) : (
                <div className="students-grid">
                    {students.map((s) => {
                        const { student, progress, enrolledAt } = s;

                        return (
                            <div key={s._id} className="student-card">
                                <div className="student-avatar">
                                    {student.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="student-info">
                                    <h3>{student.name}</h3>
                                    <p>{student.email}</p>

                                    <div className="student-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <span>{progress}% completed</span>
                                    </div>

                                    <p className="enrolled-date">
                                        Enrolled: {new Date(enrolledAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}