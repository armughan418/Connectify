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

const friendService = {
  addFriend: async (friendId) => {
    try {
      const response = await axios.post(
        API.addFriend,
        { friendId },
        {
          headers: getAuthHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removeFriend: async (friendId) => {
    try {
      const response = await axios.post(
        API.removeFriend,
        { friendId },
        {
          headers: getAuthHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getFriends: async () => {
    try {
      const response = await axios.get(API.getFriends, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  acceptFriend: async (friendId) => {
    try {
      const response = await axios.post(
        API.acceptFriend,
        { friendId },
        {
          headers: getAuthHeader(),
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default friendService;
