import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Edit2,
  Users,
  FileText,
  Grid3x3,
  User,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import userService from "../../services/userService";
import postService from "../../services/postService";
import friendService from "../../services/friendService";
import uploadService from "../../services/uploadService";
import PostCard from "../../components/PostCard";

function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!authService.isAuthenticated()) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const profileRes = await userService.getProfile();
        const postsRes = await postService.getAllPosts();
        const friendsRes = await friendService.getFriends();

        if (profileRes.status) {
          setUser(profileRes.user);
          setEditForm({
            name: profileRes.user.name || "",
            email: profileRes.user.email || "",
            phone: profileRes.user.phone || "",
            address: profileRes.user.address || "",
          });
        }

        const currentUserId =
          authService.getCurrentUser()?._id || authService.getCurrentUser()?.id;

        setPosts(
          postsRes.data?.filter(
            (p) => p.author?._id === currentUserId || p.author === currentUserId
          ) || []
        );

        const friendsData =
          friendsRes.data?.friends ||
          friendsRes.data ||
          friendsRes.friends ||
          (Array.isArray(friendsRes) ? friendsRes : []);
        setFriends(Array.isArray(friendsData) ? friendsData : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleCoverUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const url = await uploadService.uploadFile(file);
      await userService.updateProfile({ coverPhoto: url });
      setUser({ ...user, coverPhoto: url });
      toast.success("Cover photo updated!");
    } catch (error) {
      console.error("Cover upload error:", error);
      toast.error(error.message || "Failed to upload cover photo");
    }
  };

  const handleProfileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const url = await uploadService.uploadFile(file);
      await userService.updateProfile({ profilePhoto: url });
      setUser({ ...user, profilePhoto: url });
      toast.success("Profile photo updated!");
    } catch (error) {
      console.error("Profile upload error:", error);
      toast.error(error.message || "Failed to upload profile photo");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await userService.updateProfile(editForm);
      if (res && (res.status === true || res.success === true)) {
        setUser((prev) => ({ ...prev, ...editForm }));
        setShowEditModal(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-64 bg-gray-200">
        {user.coverPhoto && (
          <img
            src={user.coverPhoto}
            alt="cover"
            className="w-full h-full object-cover"
          />
        )}
        <label className="absolute top-4 right-4 cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <Camera size={20} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </label>
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
          <label className="absolute bottom-0 right-0 cursor-pointer bg-blue-600 p-2 rounded-full">
            <Camera size={16} className="text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileUpload}
            />
          </label>
        </div>
        <div className="mt-24 ml-48 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{friends.length} friends</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
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
                  currentUserId={
                    authService.getCurrentUser()?._id ||
                    authService.getCurrentUser()?.id
                  }
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
            </div>
          )}

          {activeTab === "friends" &&
            (!Array.isArray(friends) || friends.length === 0 ? (
              <p className="text-gray-500">No friends yet</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {friends
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
              {posts.filter((p) => p.image).length === 0 ? (
                <p className="text-gray-500">No photos yet</p>
              ) : (
                posts
                  .filter((p) => p.image)
                  .map((p) => (
                    <img
                      key={p._id}
                      src={p.image}
                      alt="post"
                      className="w-full h-24 object-cover rounded"
                    />
                  ))
              )}
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
