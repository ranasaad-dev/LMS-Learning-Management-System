import apiClient from "../utils/apiClient";

const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await apiClient.post("/users", userData);
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};