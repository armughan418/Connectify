import axios from "axios";
import api from "../utils/api";

const API = api();

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const adminService = {
  getStats: async () => {
    try {
      const response = await axios.get(API.adminStat, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default adminService;
