import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Loader, Plus } from "lucide-react";
import authService from "../services/authService";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      navigate("/feed");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">📱 Connectify</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 bg-blue-700 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20 flex gap-6">
        <div className="flex-1 max-w-3xl">
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <div className="w-24 h-36 bg-white shadow-md rounded-xl flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-full mb-2">
                <Plus size={28} />
              </div>
              <p className="text-sm font-medium text-gray-700">Add Story</p>
            </div>
            {stories.map((story) => (
              <div
                key={story.id}
                className="w-24 h-36 bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={story.image}
                  alt="story"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white shadow-md rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{post.user}</h3>
                    <p className="text-sm text-gray-500">{post.username}</p>
                  </div>
                </div>
                {post.type === "image" && (
                  <img
                    src={post.media}
                    alt="post"
                    className="w-full rounded-xl mb-3"
                  />
                )}
                {post.type === "video" && (
                  <video controls className="w-full rounded-xl mb-3">
                    <source src={post.media} />
                  </video>
                )}
                <div className="flex justify-around text-gray-600 pt-3 border-t">
                  <button className="flex items-center gap-2 hover:text-red-500 transition">
                    <Heart size={20} /> Like
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition">
                    <MessageCircle size={20} /> Comment
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-600 transition">
                    <Share2 size={20} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-72 bg-white shadow-md rounded-xl h-fit p-4 sticky top-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Chats</h2>
          <div className="flex flex-col gap-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <p className="font-medium text-gray-800">{chat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
