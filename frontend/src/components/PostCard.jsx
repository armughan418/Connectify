import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Trash2,
  Edit2,
  Flag,
  Share2,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import ReportModal from "./ReportModal";
import postService from "../services/postService";
import CommentSection from "./CommentSection";

const PostCard = ({ post, onDelete, onUpdate, currentUserId }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(currentUserId) ||
      post.likes?.some((id) => id.toString() === currentUserId?.toString())
  );
  const [likesCount, setLikesCount] = useState(
    post.likesCount || post.likes?.length || 0
  );
  const [commentsCount, setCommentsCount] = useState(
    post.commentsCount || post.comments?.length || 0
  );
  const [showComments, setShowComments] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCommentCountUpdate = (newCount) => {
    setCommentsCount(newCount);
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postService.unlikePost(post._id);
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      } else {
        await postService.likePost(post._id);
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
          onClick={() => {
            const authorId = post.author?._id || post.author;
            if (authorId) {
              navigate(`/user-profile/${authorId}`);
            }
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
            {post.author?.profilePhoto ? (
              <img
                src={post.author.profilePhoto}
                alt={post.author?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {post.author?.name
                  ? post.author.name.charAt(0).toUpperCase()
                  : "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm hover:text-blue-600 transition">
              {post.author?.name || "Unknown User"}
            </p>
            <p className="text-xs text-gray-500">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        </div>
        {currentUserId?.toString() === post.author?._id?.toString() ||
        currentUserId?.toString() === post.author?.toString() ? (
          <div className="flex gap-2">
            {onUpdate && (
              <button
                onClick={() => onUpdate && onUpdate(post)}
                className="p-2 hover:bg-gray-100 rounded"
                title="Edit post"
              >
                <Edit2 size={16} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-gray-100 rounded text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded"
              title="More"
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-20">
                <button
                  onClick={() => {
                    setShowReport(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-50"
                >
                  <Flag size={16} /> Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-800 mb-3">{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full h-auto rounded-lg mb-3 max-h-96 object-cover"
        />
      )}

      {post.video && (
        <video
          src={post.video}
          controls
          className="w-full h-auto rounded-lg mb-3 max-h-96"
        >
          Your browser does not support the video tag.
        </video>
      )}

      {post.category && (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
          {post.category}
        </span>
      )}

      <div className="flex items-center justify-between pt-3 border-t text-gray-600">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
            isLiked ? "text-red-500" : ""
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span className="text-sm">{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
        >
          <MessageCircle size={18} />
          <span className="text-sm">{commentsCount}</span>
        </button>
        <button
          onClick={async () => {
            try {
              const shareUrl = window.location.origin + "/post/" + post._id;
              const shareText = `${
                post.content || ""
              } \n\nView post: ${shareUrl}`;
              if (navigator.share) {
                await navigator.share({
                  title: post.author?.name || "Post",
                  text: shareText,
                  url: shareUrl,
                });
              } else {
                const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  shareText
                )}`;
                window.open(wa, "_blank");
              }
            } catch (err) {
              console.error("Share failed", err);
            }
          }}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
        >
          <Share2 size={18} />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          onCommentCountChange={handleCommentCountUpdate}
        />
      )}

      {showReport && (
        <ReportModal
          postId={post._id}
          onClose={() => setShowReport(false)}
          onSubmit={() => {
            setShowReport(false);
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
