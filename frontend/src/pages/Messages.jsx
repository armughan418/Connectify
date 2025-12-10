import React, { useState, useEffect } from "react";
import { MessageSquare, Loader } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import messageService from "../services/messageService";
import MessageThread from "../components/MessageThread";
import authService from "../services/authService";
import userService from "../services/userService";

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast.error("Please login to view messages");
      navigate("/login");
      return;
    }
    loadData();

    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    const friendIdParam = searchParams.get("friendId");
    if (friendIdParam) {
      const match = conversations.find(
        (conv) => String(conv._id) === String(friendIdParam)
      );
      if (match) {
        setSelectedFriend(match);
      } else {
        const fetchUserDetails = async () => {
          try {
            const userRes = await userService.getUserById(friendIdParam);
            if (userRes.status && userRes.user) {
              setSelectedFriend({
                _id: friendIdParam,
                name: userRes.user.name || "User",
                profilePhoto: userRes.user.profilePhoto || null,
              });
            } else {
              setSelectedFriend({
                _id: friendIdParam,
                name: "User",
              });
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
            setSelectedFriend({
              _id: friendIdParam,
              name: "User",
            });
          }
        };
        fetchUserDetails();
      }
    }
  }, [searchParams, conversations]);

  const loadData = async () => {
    try {
      const convRes = await messageService.getConversations();

      const rawConvs =
        convRes?.data?.conversations ||
        convRes?.conversations ||
        (Array.isArray(convRes?.data) ? convRes.data : []) ||
        [];

      const normalized = rawConvs
        .filter((c) => c && (c.friendId || c.friend?._id || c._id))
        .map((c) => ({
          _id: c.friendId || c.friend?._id || c._id,
          name: c.friendName || c.friend?.name || "Unknown User",
          profilePhoto:
            c.friendProfilePhoto ||
            c.friend?.profilePhoto ||
            c.profilePhoto ||
            null,
          lastMessage: c.lastMessage || c.content || "",
          lastMessageTime: c.lastMessageTime || c.createdAt,
          unreadCount: c.unreadCount || 0,
        }));

      setConversations(normalized);

      const friendIdParam = searchParams.get("friendId");
      if (friendIdParam && !selectedFriend) {
        const match = normalized.find(
          (x) => String(x._id) === String(friendIdParam)
        );
        if (match) {
          setSelectedFriend(match);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load messages";
      toast.error(errorMessage);

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        authService.logoutUser();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6 px-4">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-fit">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold flex items-center gap-2">
                <MessageSquare size={20} />
                Messages
              </div>

              <div className="divide-y max-h-[600px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare
                      size={32}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p>No conversations yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Start a conversation with a friend
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv._id}
                      onClick={() => {
                        setSelectedFriend(conv);
                        navigate(`/messages?friendId=${conv._id}`, {
                          replace: true,
                        });
                      }}
                      className={`w-full p-4 text-left hover:bg-blue-50 border-l-4 transition duration-200 ${
                        selectedFriend?._id === conv._id
                          ? "border-l-blue-500 bg-blue-50"
                          : "border-l-transparent hover:border-l-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                          {conv.profilePhoto ? (
                            <img
                              src={conv.profilePhoto}
                              alt={conv.name}
                              className="w-full h-full object-cover"
                            />
                          ) : conv.name ? (
                            <span className="text-blue-600">
                              {conv.name.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-blue-600">U</span>
                          )}
                        </div>

                        <div className="flex items-start justify-between gap-2 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {conv.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage || "No messages yet"}
                            </p>
                            {conv.lastMessageTime && (
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(
                                  conv.lastMessageTime
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {(conv.unreadCount || 0) > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0 font-semibold">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedFriend ? (
              <MessageThread
                friendId={selectedFriend._id}
                friendName={selectedFriend.name}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center h-96 flex items-center justify-center">
                <div>
                  <MessageSquare
                    size={48}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <p className="text-gray-500 font-medium mb-2">
                    Select a conversation to start messaging
                  </p>
                  <p className="text-sm text-gray-400">
                    Choose a friend from the list to begin chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
