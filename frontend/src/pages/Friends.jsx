import React, { useState, useEffect } from "react";
import { Users, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import friendService from "../services/friendService";
import FriendCard from "../components/FriendCard";
import userService from "../services/userService";
import authService from "../services/authService";

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast.error("Please login to view friends");
      navigate("/login");
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [friendsRes, usersRes] = await Promise.all([
        friendService.getFriends().catch((err) => {
          console.error("Error loading friends:", err);
          return { data: { friends: [] } };
        }),
        userService.getAllUsers().catch((err) => {
          console.error("Error loading users:", err);
          return { users: [], data: { users: [] } };
        }),
      ]);

      const friendsList =
        friendsRes?.data?.friends ||
        friendsRes?.friends ||
        (Array.isArray(friendsRes) ? friendsRes : []);

      const usersList =
        usersRes?.users ||
        usersRes?.data?.users ||
        (Array.isArray(usersRes) ? usersRes : []);

      setFriends(Array.isArray(friendsList) ? friendsList : []);
      setAllUsers(Array.isArray(usersList) ? usersList : []);
    } catch (error) {
      console.error("Error loading data:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load data";
      toast.error(errorMessage);

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        authService.logoutUser();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFriendUpdate = () => {
    loadData();
  };

  const isFriend = (userId) => {
    if (!userId) return false;
    return friends.some((f) => {
      const friendId = f._id || f.id;
      return String(friendId) === String(userId);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const currentUserId =
    authService.getCurrentUser()?._id || authService.getCurrentUser()?.id;
  const suggestedUsers = allUsers.filter((u) => {
    const userId = u._id || u.id;
    return (
      userId && String(userId) !== String(currentUserId) && !isFriend(userId)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
          </div>
          <p className="text-gray-600">
            Connect with people and expand your network
          </p>
        </div>

        <div className="mb-6 flex gap-2 border-b border-gray-200 bg-white rounded-t-lg">
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-6 py-3 font-semibold border-b-2 transition duration-200 ${
              activeTab === "friends"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`px-6 py-3 font-semibold border-b-2 transition duration-200 ${
              activeTab === "suggestions"
                ? "border-purple-500 text-purple-600 bg-purple-50"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Suggestions ({suggestedUsers.length})
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === "friends" ? (
            friends.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">
                  You don't have any friends yet
                </p>
                <p className="text-gray-500 text-sm">
                  Check out the suggestions tab to find people to connect with
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends
                  .filter((friend) => friend && (friend._id || friend.id))
                  .map((friend) => (
                    <FriendCard
                      key={friend._id || friend.id}
                      user={friend}
                      isFriend={true}
                      onFriendUpdate={handleFriendUpdate}
                    />
                  ))}
              </div>
            )
          ) : suggestedUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">
                No more suggestions available
              </p>
              <p className="text-gray-500 text-sm">
                You're already connected with all available users
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedUsers
                .filter((user) => user && (user._id || user.id))
                .map((user) => (
                  <FriendCard
                    key={user._id || user.id}
                    user={user}
                    isFriend={false}
                    onFriendUpdate={handleFriendUpdate}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
