import axios from "axios";
import api from "../utils/api";

const API = api();

const authService = {
  registerUser: async (userData) => {
    try {
      const response = await axios.post(API.registerUser, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await axios.post(API.loginUser, credentials, {
        withCredentials: true,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logoutUser: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  forgetPassword: async (email) => {
    try {
      const response = await axios.post(API.forgetPassword, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await axios.post(API.verifyOtp, { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePassword: async (email, token, newPassword) => {
    try {
      const response = await axios.post(API.updatePassword, {
        email,
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAccess: async () => {
    try {
      const response = await axios.get(API.getAcess, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  },

  isAuthenticated: () => {
    return !!(
      localStorage.getItem("token") || localStorage.getItem("authToken")
    );
  },
};

export default authService;
