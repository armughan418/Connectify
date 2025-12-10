import axios from "axios";
import api from "../utils/api";
import authService from "./authService";

const API = api();

const getAuthHeader = () => {
  const token = authService.getToken();
  if (!token) {
    throw new Error("Authentication token not found. Please login.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

const messageService = {
  sendMessage: async (messageData) => {
    try {
      const response = await axios.post(API.sendMessage, messageData, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMessages: async (friendId) => {
    try {
      const response = await axios.get(API.getMessages(friendId), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getConversations: async () => {
    try {
      const response = await axios.get(API.getConversations, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await axios.get(API.getUnreadCount, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default messageService;
