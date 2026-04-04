import apiClient from "../utils/apiClient";

const enrollInCourse = async (courseId) => {
  const response = await apiClient.post(`/enroll/${courseId}`);
  return response.data;
};

const getMyCourses = async () => {
  // Backend: GET /enroll
  const response = await apiClient.get("/enroll");
  return response.data;
};

const unenrollInCourse = async (courseId) => {
  const response = await apiClient.delete(`/enroll/${courseId}`);
  return response.data;
};

const courseProgress = async (courseId, progress) => {

  const response = await apiClient.put(`/enroll/${courseId}`, progress);
  return response.data;
};

const getCourseStudents = async (courseId) => {
  // Backend: GET /enroll/:id/students
  const response = await apiClient.get(`/enroll/${courseId}/students`);
return response.data;
}

const lessonProgress = async (id, data) => {
const response = await apiClient.put(`/enroll/${id}`, data);
return response.data;
}

export default {
  enrollInCourse,
  getMyCourses,
unenrollInCourse,
getCourseStudents,
courseProgress,
lessonProgress
};