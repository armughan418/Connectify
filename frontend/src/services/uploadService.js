import axios from "axios";
import api from "../utils/api";

const API = api();

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
};

const uploadService = {
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(API.uploadFile, formData, {
        headers: getAuthHeader(),
        withCredentials: true,
      });

      if (response.data.status && response.data.data?.url) {
        return response.data.data.url;
      }
      throw new Error(response.data.message || "Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      throw (
        error.response?.data?.message ||
        error.message ||
        "Failed to upload file"
      );
    }
  },
};

export default uploadService;
