import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Smile,
  X,
  Image as ImageIcon,
  File,
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import messageService from "../services/messageService";
import socketService from "../services/socketService";
import uploadService from "../services/uploadService";
import authService from "../services/authService";
import { toast } from "react-toastify";

const MessageThread = ({ friendId, friendName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [friendProfilePhoto, setFriendProfilePhoto] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const { sendMessage, sendTyping, stopTyping } = useSocket();

  const getCurrentUserId = () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return null;
      const parsed = JSON.parse(user);
      return parsed?._id || parsed?.id || null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };
  const currentUserId = getCurrentUserId();
  const currentUser = authService.getCurrentUser();

  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "👍",
    "👎",
    "❤️",
    "💯",
    "🔥",
    "🎉",
    "✅",
    "❌",
  ];

  useEffect(() => {
    loadMessages();
    loadFriendProfile();
  }, [friendId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadFriendProfile = async () => {
    try {
      const userService = (await import("../services/userService")).default;
      const userRes = await userService.getUserById(friendId);
      if (userRes.status && userRes.user) {
        setFriendProfilePhoto(userRes.user.profilePhoto);
      }
    } catch (error) {
      console.error("Error loading friend profile:", error);
    }
  };

  useEffect(() => {
    const handleSocketMessage = (socketMsg) => {
      if (
        socketMsg.receiverId === currentUserId &&
        socketMsg.senderId === friendId
      ) {
        setMessages((prev) => {
          const messageToAdd = socketMsg.message || socketMsg;
          const normalizedMessage = {
            _id: messageToAdd._id,
            content: messageToAdd.content || socketMsg.content,
            attachment: messageToAdd.attachment || socketMsg.attachment,
            createdAt: messageToAdd.createdAt || socketMsg.createdAt,
            senderId:
              messageToAdd.sender?._id ||
              messageToAdd.senderId ||
              socketMsg.senderId,
            receiverId:
              messageToAdd.receiver?._id ||
              messageToAdd.receiverId ||
              socketMsg.receiverId,
            sender: messageToAdd.sender,
            receiver: messageToAdd.receiver,
          };

          const exists = prev.some(
            (msg) =>
              msg._id === normalizedMessage._id ||
              (msg.content === normalizedMessage.content &&
                new Date(msg.createdAt || 0).getTime() ===
                  new Date(normalizedMessage.createdAt || 0).getTime())
          );
          if (!exists) {
            return [...prev, normalizedMessage];
          }
          return prev;
        });
      }
    };

    const socket = socketService.getSocket();
    if (socket) {
      socket.on("message", handleSocketMessage);
      socket.on("receiveMessage", handleSocketMessage);

      return () => {
        socket.off("message", handleSocketMessage);
        socket.off("receiveMessage", handleSocketMessage);
      };
    }
  }, [friendId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      const response = await messageService.getMessages(friendId);
      const apiMessages = response.data?.messages || response.data || [];
      const normalizedMessages = apiMessages.map((msg) => ({
        ...msg,
        senderId: msg.sender?._id || msg.sender || msg.senderId,
        receiverId: msg.receiver?._id || msg.receiver || msg.receiverId,
      }));
      setMessages(normalizedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Please select an image file");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    let attachmentUrl = null;

    if (selectedFile) {
      setUploading(true);
      try {
        attachmentUrl = await uploadService.uploadFile(selectedFile);
        toast.success("File uploaded successfully");
      } catch (uploadError) {
        toast.error(uploadError || "Failed to upload file");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const messageData = {
      content: newMessage.trim() || (attachmentUrl ? "📎 Attachment" : ""),
      receiverId: friendId,
      ...(attachmentUrl ? { attachment: attachmentUrl } : {}),
    };

    try {
      const response = await messageService.sendMessage(messageData);
      const savedMessage = response.data?.message;

      sendMessage({
        senderId: currentUserId,
        receiverId: friendId,
        content: messageData.content,
        attachment: attachmentUrl,
        message: savedMessage,
      });

      if (savedMessage) {
        setMessages([
          ...messages,
          {
            ...savedMessage,
            senderId: savedMessage.sender?._id || currentUserId,
            receiverId: savedMessage.receiver?._id || friendId,
            content: savedMessage.content,
            attachment: savedMessage.attachment || attachmentUrl,
            createdAt: savedMessage.createdAt,
          },
        ]);
      }
      setNewMessage("");
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      stopTyping({ receiverId: friendId });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    sendTyping({ receiverId: friendId });

    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => {
        stopTyping({ receiverId: friendId });
        setIsTyping(false);
      }, 2000);
    }
  };

  const insertEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[800px] bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
          {friendProfilePhoto ? (
            <img
              src={friendProfilePhoto}
              alt={friendName}
              className="w-full h-full object-cover"
            />
          ) : friendName ? (
            <span className="text-blue-600">
              {friendName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <span className="text-blue-600">U</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{friendName}</h3>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => {
          const senderId =
            msg.senderId ||
            msg.sender?._id ||
            (msg.sender && typeof msg.sender === "string" ? msg.sender : null);
          const isCurrentUser =
            senderId === currentUserId || msg.sender === currentUserId;
          const senderProfilePhoto = isCurrentUser
            ? currentUser?.profilePhoto || null
            : msg.sender?.profilePhoto || friendProfilePhoto || null;
          const senderName = isCurrentUser
            ? currentUser?.name || "You"
            : msg.sender?.name || friendName || "User";

          return (
            <div
              key={msg._id || idx}
              className={`flex items-start gap-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                  {senderProfilePhoto ? (
                    <img
                      src={senderProfilePhoto}
                      alt={senderName}
                      className="w-full h-full object-cover"
                    />
                  ) : senderName ? (
                    <span className="text-blue-600">
                      {senderName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-white">U</span>
                  )}
                </div>
              )}

              <div
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                } max-w-xs`}
              >
                {!isCurrentUser && (
                  <p className="text-xs text-gray-600 mb-1 px-1">
                    {senderName}
                  </p>
                )}

                <div
                  className={`px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.attachment && (
                    <div className="mb-2">
                      <img
                        src={msg.attachment}
                        alt="Attachment"
                        className="max-w-full h-auto rounded"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}

                  {msg.content && (
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  )}

                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "opacity-70" : "text-gray-500"
                    }`}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </div>

              {isCurrentUser && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                  {currentUser?.profilePhoto ? (
                    <img
                      src={currentUser.profilePhoto}
                      alt={currentUser?.name || "You"}
                      className="w-full h-full object-cover"
                    />
                  ) : currentUser?.name ? (
                    <span className="text-blue-600">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-blue-600">U</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {preview && (
        <div className="px-4 py-2 border-t bg-gray-50 relative">
          <div className="flex items-center gap-2">
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Image attachment</p>
              <p className="text-xs text-gray-400">
                {selectedFile?.name || "image.jpg"}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t flex gap-2 items-end"
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Attach file"
        >
          <Paperclip size={20} className="text-gray-600" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="relative" ref={emojiPickerRef}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Add emoji"
          >
            <Smile size={20} className="text-gray-600" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 max-h-48 overflow-y-auto z-10">
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-1 hover:bg-gray-100 rounded text-lg transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        />
        <button
          type="submit"
          disabled={uploading || (!newMessage.trim() && !selectedFile)}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {uploading ? (
            <span className="text-xs">Uploading...</span>
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageThread;
