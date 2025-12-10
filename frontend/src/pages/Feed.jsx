import React, { useState, useEffect } from "react";
import {
  Plus,
  Loader,
  Image as ImageIcon,
  Video,
  X,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import postService from "../services/postService";
import uploadService from "../services/uploadService";
import PostCard from "../components/PostCard";
import authService from "../services/authService";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
    image: "",
    video: "",
    category: "general",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);

  const getCurrentUserId = () => {
    const user = authService.getCurrentUser();
    return user?._id || user?.id || null;
  };
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast.error("Please login to view feed");
      return;
    }
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      const postsData = response.data || response.posts || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error("Load posts error:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please select an image or video file");
      return;
    }

    const maxImageSize = 10 * 1024 * 1024;
    const maxVideoSize = 50 * 1024 * 1024;

    if (isImage && file.size > maxImageSize) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    if (isVideo && file.size > maxVideoSize) {
      toast.error("Video size should be less than 50MB");
      return;
    }

    setSelectedFile(file);
    setFileType(isImage ? "image" : "video");

    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setFileType(null);
    setNewPost({ ...newPost, image: "", video: "" });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPost.content.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    if (!authService.isAuthenticated()) {
      toast.error("Please login to create a post");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = newPost.image;
      let videoUrl = newPost.video;

      if (selectedFile) {
        setUploading(true);
        try {
          const uploadedUrl = await uploadService.uploadFile(selectedFile);
          if (fileType === "image") {
            imageUrl = uploadedUrl;
          } else {
            videoUrl = uploadedUrl;
          }
          toast.success("File uploaded successfully");
        } catch (uploadError) {
          toast.error(uploadError || "Failed to upload file");
          setIsSubmitting(false);
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      const postData = {
        content: newPost.content.trim(),
        category: newPost.category || "general",
        ...(imageUrl && imageUrl.trim() ? { image: imageUrl.trim() } : {}),
        ...(videoUrl && videoUrl.trim() ? { video: videoUrl.trim() } : {}),
      };

      console.log("Creating post with data:", postData);
      const response = await postService.createPost(postData);
      console.log("Post creation response:", response);

      if (response.status && response.data) {
        await loadPosts();
        setNewPost({ content: "", image: "", video: "", category: "general" });
        setSelectedFile(null);
        setPreview(null);
        setFileType(null);
        setShowCreatePost(false);
        toast.success("Post created successfully");
      } else {
        throw new Error(response.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Create post error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create post. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleUpdatePost = async (post) => {
    toast.info(
      "Edit post feature coming soon! For now, delete and create a new post."
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        {!showCreatePost ? (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 hover:shadow-xl transition cursor-pointer">
            <button
              onClick={() => {
                if (!authService.isAuthenticated()) {
                  toast.error("Please login to create a post");
                  return;
                }
                setShowCreatePost(true);
              }}
              className="w-full flex items-center gap-4 text-gray-600 hover:text-gray-900 transition"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {authService.getCurrentUser()?.name?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
              <span className="flex-1 text-left">What's on your mind?</span>
              <Plus size={24} className="text-blue-500" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
            <h3 className="font-bold text-xl mb-4 text-gray-900">
              Create a Post
            </h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="4"
              ></textarea>

              {preview && (
                <div className="relative">
                  {fileType === "image" ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
                    />
                  ) : (
                    <video
                      src={preview}
                      controls
                      className="w-full max-h-96 rounded-lg border border-gray-200"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({ ...newPost, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="tech">Tech</option>
                    <option value="life">Life</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Media
                  </label>
                  <label className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center gap-2">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : "Choose File"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium shadow-lg hover:shadow-xl"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin" size={18} />
                      Uploading...
                    </span>
                  ) : isSubmitting ? (
                    "Posting..."
                  ) : (
                    "Post"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreatePost(false);
                    setNewPost({
                      content: "",
                      image: "",
                      video: "",
                      category: "general",
                    });
                    setSelectedFile(null);
                    setPreview(null);
                    setFileType(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
                  disabled={isSubmitting || uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500 mb-2 text-lg font-medium">
                No posts yet
              </p>
              <p className="text-gray-400 text-sm">
                Be the first to share something!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
