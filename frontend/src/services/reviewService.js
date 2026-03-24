import apiClient from "./apiClient";

const getCourseReviews = async (courseId) => {
  const response = await apiClient.get(`/reviews/course/${courseId}`);
  return response.data;
};

const createReview = async (courseId, review) => {
  const response = await apiClient.post(`/reviews/${courseId}`, review);
  return response.data;
};

const updateReview = async (id, data) => {
  const response = await apiClient.put(`/reviews/${id}`, data);
  return response.data;
};

const deleteReview = async (id, review) => {
  const response = await apiClient.delete(`/reviews/${id}`);
  return response.data;
};


export default {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview
};