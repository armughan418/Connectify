import axios from "axios";
import api from "../utils/api";

const API = api();

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const commentService = {
  createComment: async (commentData) => {
    try {
      const response = await axios.post(API.createComment, commentData, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCommentsByPost: async (postId) => {
    try {
      const response = await axios.get(API.getCommentsByPost(postId), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCommentById: async (commentId) => {
    try {
      const response = await axios.get(API.getCommentById(commentId), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateComment: async (commentId, commentData) => {
    try {
      const response = await axios.put(
        API.updateComment(commentId),
        commentData,
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

  deleteComment: async (commentId) => {
    try {
      const response = await axios.delete(API.deleteComment(commentId), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default commentService;
