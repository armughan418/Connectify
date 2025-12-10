import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserMinus, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import friendService from "../services/friendService";

const FriendCard = ({ user, isFriend, onFriendUpdate }) => {
  const navigate = useNavigate();
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  if (!user || (!user._id && !user.id)) {
    return null;
  }

  const userId = user._id || user.id;

  const handleAddFriend = async () => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    setIsAddingFriend(true);
    try {
      if (isFriend) {
        await friendService.removeFriend(userId);
        toast.success("Friend removed successfully");
      } else {
        await friendService.addFriend(userId);
        toast.success("Friend request sent");
      }
      if (onFriendUpdate) {
        onFriendUpdate();
      }
    } catch (error) {
      console.error("Error updating friend status:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update friend status";
      toast.error(errorMessage);
    } finally {
      setIsAddingFriend(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div
        className="flex items-center gap-3 cursor-pointer flex-1"
        onClick={() => {
          if (userId) {
            navigate(`/user-profile/${userId}`);
          }
        }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <p className="font-semibold hover:text-blue-600 transition">
            {user.name}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddFriend();
          }}
          disabled={isAddingFriend}
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isFriend
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } disabled:opacity-50`}
        >
          {isFriend ? (
            <>
              <UserMinus size={16} />
              Remove
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Add Friend
            </>
          )}
        </button>
        {isFriend && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (userId) {
                navigate(`/messages?friendId=${userId}`);
              }
            }}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            <MessageCircle size={16} />
            Message
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
