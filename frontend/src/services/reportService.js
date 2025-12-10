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

const reportService = {
  reportPost: async (reportData) => {
    try {
      const response = await axios.post(API.reportPost, reportData, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPendingReports: async () => {
    try {
      const response = await axios.get(API.getPendingReports, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllReports: async () => {
    try {
      const response = await axios.get(API.getAllReports, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resolveReport: async (reportId, action, notes) => {
    try {
      const response = await axios.patch(
        API.resolveReport(reportId),
        { action, notes },
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

export default reportService;
