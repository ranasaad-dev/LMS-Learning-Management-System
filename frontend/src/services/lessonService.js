import apiClient from "../utils/apiClient";

const getLessonsByCourse = async (courseId) => {
  // Backend: GET /lessons/:id (course id)
  const response = await apiClient.get(`/lessons/${courseId}`);
  return response.data;
};
const addLesson = async (lessonData) => {
  const response = await apiClient.post("/lessons", lessonData);
  return response.data;
};

const deleteLesson = async (lessonId) => {
  const response = await apiClient.delete(`/lessons/${lessonId}`);
  return response.data;
};

const updateLesson = async (lessonId,lessonData) => {
  const response = await apiClient.put(`/lessons/${lessonId}`, lessonData)
}


export default {
  getLessonsByCourse, 
  addLesson,
  deleteLesson,
  updateLesson
};