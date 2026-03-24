import enrollmentService from "../../../../services/enrollmentService";
import { useParams } from "react-router-dom";
import notify from "/src/components/ui/notify/Notify.js";
import { useState, useEffect } from "react";

export default function ViewStudents() {
    const { id } = useParams();
    const [students, setStudents] = useState([]);
    const fetchStudents = async () => {
        try {
            const students = await enrollmentService.getCourseStudents(id);
            setStudents(students);
            console.log(students);
        } catch (err) {
            notify(err.message, "error")
        }

    }
    useEffect(() => {
        fetchStudents()
    }, [])

    return (<>
        <h1>Total {students.length()} Students</h1>
        <div>
            {students.map((s, i) => {
                
            })}
        </div>
            </>
    )
}