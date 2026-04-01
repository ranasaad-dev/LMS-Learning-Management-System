import apiClient from "./apiClient";

const enrollInCourse = async (courseId) => {
  const response = await apiClient.post(`/enroll/${courseId}`);
  return response.data;
};

const getMyCourses = async () => {
  const response = await apiClient.get("/enroll/my-courses");
  return response.data;
};

const unenrollInCourse = async (courseId) => {
  const response = await apiClient.delete(`/enroll/${courseId}`);
  return response.data;
};

const courseProgress = async (courseId, progress) => {
  const response = await apiClient.put(`/enroll/${courseId}/progress`, progress);
  return response.data;
};

const getCourseStudents = async (courseId) => {
  const response = await apiClient.get(`/enroll/course/${courseId}/students`);
return response.data;
}

export default {
  enrollInCourse,
  getMyCourses,
unenrollInCourse,
getCourseStudents,
courseProgress,
};