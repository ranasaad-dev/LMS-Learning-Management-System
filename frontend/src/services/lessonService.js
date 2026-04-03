import apiClient from "../utils/apiClient";

const getLessonsByCourse = async (courseId) => {
  const response = await apiClient.get(`/lessons/course/${courseId}`);
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


export default {
  getLessonsByCourse, 
  addLesson,
  deleteLesson,
};