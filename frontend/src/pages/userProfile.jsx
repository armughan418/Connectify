import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  User,
  FileText,
  Users,
  Grid3x3,
  Loader,
  MessageCircle,
  UserPlus,
  UserMinus,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import userService from "../services/userService";
import postService from "../services/postService";
import friendService from "../services/friendService";
import PostCard from "../components/PostCard";
import authService from "../services/authService";

function UserProfile() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const userId = paramId || queryId;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [userFriends, setUserFriends] = useState([]);
  const currentUserId =
    authService.getCurrentUser()?._id || authService.getCurrentUser()?.id;

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    } else {
      toast.error("User ID not provided");
      navigate("/feed");
    }
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      const userRes = await userService.getUserById(userId);
      const allPostsRes = await postService.getAllPosts();
      const friendsRes = await friendService.getFriends();

      if (userRes.status && userRes.user) {
        setUser(userRes.user);
      } else {
        toast.error("User not found");
        navigate("/feed");
        return;
      }

      if (allPostsRes.data) {
        const userPosts = allPostsRes.data.filter(
          (post) =>
            post.author?._id?.toString() === userId?.toString() ||
            post.author?.toString() === userId?.toString() ||
            post.author?._id?.toString() === userId?.toString()
        );
        setPosts(userPosts);
      }

      if (friendsRes.data && Array.isArray(friendsRes.data)) {
        const friend = friendsRes.data.find((f) => {
          const friendId = f._id || f.id;
          return String(friendId) === String(userId);
        });
        setIsFriend(!!friend);

        setUserFriends(friendsRes.data.slice(0, 9));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load user profile";
      toast.error(errorMessage);

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        authService.logoutUser();
        navigate("/login");
      } else {
        navigate("/feed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFriendAction = async () => {
    if (!userId) return;

    try {
      if (isFriend) {
        await friendService.removeFriend(userId);
        setIsFriend(false);
        toast.success("Friend removed");
      } else {
        await friendService.addFriend(userId);
        setIsFriend(true);
        toast.success("Friend request sent");
      }
      loadUserProfile();
    } catch (error) {
      toast.error(error.message || "Failed to update friendship");
    }
  };

  const handleMessage = () => {
    if (userId) {
      navigate(`/messages?friendId=${userId}`);
    } else {
      toast.error("User ID not found");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">User not found</p>
          <button
            onClick={() => navigate("/feed")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-64 bg-gray-200">
        {user.coverPhoto ? (
          <img
            src={user.coverPhoto}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        )}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-white transition flex items-center gap-2 text-sm font-medium shadow-lg"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="absolute -top-20 left-6 w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : user.name ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={64} className="text-white" />
            </div>
          )}
        </div>
        <div className="mt-24 ml-48 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user.name || "User"}</h1>
            <p className="text-gray-600">{userFriends.length} friends</p>
          </div>
          {currentUserId !== userId && (
            <div className="mt-4 sm:mt-0 flex gap-2">
              <button
                onClick={handleMessage}
                className="px-4 py-2 rounded flex items-center gap-1 transition bg-blue-600 text-white hover:bg-blue-700"
              >
                <MessageCircle size={16} />
                Message
              </button>
              <button
                onClick={handleFriendAction}
                className={`px-4 py-2 rounded flex items-center gap-1 transition ${
                  isFriend
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isFriend ? (
                  <>
                    <Users size={16} />
                    Friends
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Add Friend
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 max-w-4xl mx-auto bg-white rounded-lg shadow">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: "posts", label: "Posts", icon: FileText },
            { id: "about", label: "About", icon: User },
            { id: "friends", label: "Friends", icon: Users },
            { id: "photos", label: "Photos", icon: Grid3x3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-6 py-3 border-b-2 font-medium transition ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "posts" &&
            (posts.length === 0 ? (
              <p className="text-gray-500">No posts yet</p>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUserId}
                  onDelete={async (postId) => {
                    try {
                      await postService.deletePost(postId);
                      setPosts(posts.filter((p) => p._id !== postId));
                      toast.success("Post deleted");
                    } catch (error) {
                      toast.error("Failed to delete post");
                    }
                  }}
                />
              ))
            ))}

          {activeTab === "about" && (
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user.email || "Not set"}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "Not set"}
              </p>
              <p>
                <strong>Address:</strong> {user.address || "Not set"}
              </p>
              {user.createdAt && (
                <p>
                  <strong>Member Since:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {activeTab === "friends" &&
            (!Array.isArray(userFriends) || userFriends.length === 0 ? (
              <p className="text-gray-500">No friends yet</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {userFriends
                  .filter((f) => f && (f._id || f.id))
                  .map((f) => {
                    const friendId = f._id || f.id;
                    const friendName = f.name || "Unknown";

                    return (
                      <div
                        key={friendId}
                        className="flex flex-col items-center cursor-pointer hover:opacity-80 transition"
                        onClick={() => {
                          if (friendId) {
                            navigate(`/user-profile/${friendId}`);
                          }
                        }}
                      >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shadow-md">
                          {f.profilePhoto ? (
                            <img
                              src={f.profilePhoto}
                              alt={friendName}
                              className="w-full h-full object-cover"
                            />
                          ) : f.name ? (
                            <span className="text-2xl font-bold text-white">
                              {f.name.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <User size={32} className="text-white" />
                          )}
                        </div>
                        <p className="text-sm mt-1 text-center truncate w-full px-1">
                          {friendName}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ))}

          {activeTab === "photos" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {posts.filter((p) => p.image || p.video).length === 0 ? (
                <p className="text-gray-500">No photos yet</p>
              ) : (
                posts
                  .filter((p) => p.image || p.video)
                  .map((p) => (
                    <div
                      key={p._id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => navigate(`/feed`)}
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt="post"
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : p.video ? (
                        <video
                          src={p.video}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
