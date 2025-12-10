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

const postService = {
  createPost: async (postData) => {
    try {
      console.log("PostService - Creating post:", postData);
      console.log("PostService - Auth header:", getAuthHeader());

      const response = await axios.post(API.createPost, postData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("PostService - Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PostService - Error:", error);
      console.error("PostService - Error response:", error.response);

      if (error.response?.data) {
        throw error.response.data;
      }
      throw { message: error.message || "Failed to create post" };
    }
  },

  getAllPosts: async () => {
    try {
      const response = await axios.get(API.getAllPosts, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      if (response.data.status) {
        return response.data;
      }
      return { status: true, data: response.data };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPostById: async (postId) => {
    try {
      const response = await axios.get(API.getPostById(postId), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePost: async (postId, postData) => {
    try {
      const response = await axios.put(API.updatePost(postId), postData, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deletePost: async (postId) => {
    try {
      const response = await axios.delete(API.deletePost(postId), {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  likePost: async (postId) => {
    try {
      const response = await axios.post(
        API.likePost(postId),
        {},
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

  unlikePost: async (postId) => {
    try {
      const response = await axios.post(
        API.unlikePost(postId),
        {},
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

export default postService;
