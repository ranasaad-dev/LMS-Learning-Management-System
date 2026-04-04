import apiClient from "../utils/apiClient";

const getAllCourses = async () => {
  const response = await apiClient.get("/courses");
  return response.data;
};

const getCourseById = async (id) => {
  const response = await apiClient.get(`/courses/${id}`);
  return response.data;
};

const createCourse = async (courseData) => {
  const response = await apiClient.post("/courses", courseData);
  return response.data;
};

// Update a course by ID (Instructor only)
const updateCourse = async (id, courseData) => {
  const response = await apiClient.put(`/courses/${id}`, courseData);
  return response.data;
};

// Delete a course by ID (Instructor only)
const deleteCourse = async (id) => {
  const response = await apiClient.delete(`/courses/${id}`);
  return response.data;
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  updateCourse,
};