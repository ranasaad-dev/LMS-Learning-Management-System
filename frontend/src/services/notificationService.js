import apiClient from "../utils/apiClient";

const getNotification = async () => {
  const response = await apiClient.get("/notification");
  return response.data;
};

const createNotification = async (data) => {
    const response = await apiClient.post("/notification", data);
    return response.data;
  };

  const updateNotification = async (id, data) => {
    const response = await apiClient.put(`/notification/${id}`, data);
    return response.data;
  };
  
  const deleteNotification = async (id) => {
      const response = await apiClient.delete(`/notification/${id}`);
      return response.data;
    };
  export default {
    getNotification,
    createNotification,
    updateNotification,
    deleteNotification
  }