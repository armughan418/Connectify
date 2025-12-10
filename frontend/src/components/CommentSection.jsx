import React, { useState, useEffect } from "react";
import {
  Send,
  Edit2,
  Trash2,
  X,
  Check,
  MoreVertical,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import commentService from "../services/commentService";
import authService from "../services/authService";

const CommentSection = ({ postId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const getCurrentUserId = () => {
    const user = authService.getCurrentUser();
    return user?._id || user?.id || null;
  };
  const currentUserId = getCurrentUserId();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenId && !event.target.closest(".comment-menu-container")) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  const loadComments = async () => {
    try {
      const response = await commentService.getCommentsByPost(postId);
      const commentsData =
        response.data?.comments || response.comments || response.data || [];
      const commentsArray = Array.isArray(commentsData) ? commentsData : [];
      setComments(commentsArray);

      if (onCommentCountChange) {
        onCommentCountChange(commentsArray.length);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!authService.isAuthenticated()) {
      toast.error("Please login to comment");
      return;
    }

    setLoading(true);
    try {
      const response = await commentService.createComment({
        postId,
        content: newComment.trim(),
      });

      if (response.status) {
        setNewComment("");
        await loadComments();
        toast.success("Comment added successfully");
      } else {
        throw new Error(response.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "Failed to add comment";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
    setMenuOpenId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await commentService.updateComment(commentId, {
        content: editContent.trim(),
      });

      if (response.status) {
        setEditingId(null);
        setEditContent("");
        await loadComments();
        toast.success("Comment updated successfully");
      } else {
        throw new Error(response.message || "Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "Failed to update comment";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingId(commentId);
    setMenuOpenId(null);
    try {
      const response = await commentService.deleteComment(commentId);

      if (response.status) {
        await loadComments();
        toast.success("Comment deleted successfully");
      } else {
        throw new Error(response.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "Failed to delete comment";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold mb-3 text-gray-800">
        {comments.length === 0
          ? "No comments yet"
          : `${comments.length} ${
              comments.length === 1 ? "comment" : "comments"
            }`}
      </h4>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No comments yet
          </p>
        ) : (
          comments.map((comment) => {
            const isAuthor =
              currentUserId?.toString() === comment.author?._id?.toString() ||
              currentUserId?.toString() === comment.author?.toString();
            const isEditing = editingId === comment._id;
            const isDeleting = deletingId === comment._id;
            const isMenuOpen = menuOpenId === comment._id;

            return (
              <div
                key={comment._id}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(comment._id)}
                        className="flex items-center gap-1 px-3 py-1 p-4 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        <Check size={16} />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 px-3 py-1 p-4 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                        {comment.author?.profilePhoto ? (
                          <img
                            src={comment.author.profilePhoto}
                            alt={comment.author?.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : comment.author?.name ? (
                          <span className="text-blue-600">
                            {comment.author.name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User size={16} className="text-blue-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">
                              {comment.author?.name || "Unknown User"}
                            </p>
                            <p className="text-gray-700 text-sm mt-1">
                              {comment.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {comment.createdAt
                                ? new Date(
                                    comment.createdAt
                                  ).toLocaleDateString()
                                : "Recently"}
                            </p>
                          </div>

                          {isAuthor && (
                            <div className="relative comment-menu-container flex-shrink-0">
                              <button
                                onClick={() =>
                                  setMenuOpenId(isMenuOpen ? null : comment._id)
                                }
                                className="p-1.5 hover:bg-gray-200 rounded-full transition"
                                title="More options"
                              >
                                <MoreVertical
                                  size={16}
                                  className="text-gray-600"
                                />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                  <button
                                    onClick={() => handleStartEdit(comment)}
                                    disabled={isDeleting}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <Edit2 size={14} />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(comment._id)}
                                    disabled={isDeleting}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {isDeleting && (
                          <p className="text-xs text-gray-500 mt-2">
                            Deleting...
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {authService.isAuthenticated() ? (
        <form onSubmit={handleAddComment} className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
            {currentUser?.profilePhoto ? (
              <img
                src={currentUser.profilePhoto}
                alt={currentUser?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : currentUser?.name ? (
              <span className="text-blue-600">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User size={16} className="text-blue-600" />
            )}
          </div>

          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            title="Add comment"
          >
            <Send size={18} />
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">
          Please login to add a comment
        </p>
      )}
    </div>
  );
};

export default CommentSection;
