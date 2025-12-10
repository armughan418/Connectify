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

const userService = {
  getProfile: async () => {
    try {
      const response = await axios.get(API.getUserProfile, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axios.put(API.updateUserProfile, userData, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axios.get(API.getUserById(userId), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchUsers: async (query) => {
    try {
      const response = await axios.get(API.searchUsers(query), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axios.get(API.getUsers, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(API.updateUser(userId), userData, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(API.deleteUser(userId), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
