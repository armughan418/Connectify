import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import messageService from "../services/messageService";
import socketService from "../services/socketService";

const MessageThread = ({ friendId, friendName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
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

  useEffect(() => {
    loadMessages();
  }, [friendId]);

  // Listen to real-time messages from socket
  useEffect(() => {
    const handleSocketMessage = (socketMsg) => {
      // Only handle messages for this friend
      if (
        socketMsg.receiverId === currentUserId &&
        socketMsg.senderId === friendId
      ) {
        setMessages((prev) => {
          // Normalize message format - use socketMsg.message if available, otherwise socketMsg
          const messageToAdd = socketMsg.message || socketMsg;
          const normalizedMessage = {
            _id: messageToAdd._id,
            content: messageToAdd.content || socketMsg.content,
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

          // Avoid duplicates
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

    // Use socketService to listen for messages
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
      // Normalize messages from API response
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      receiverId: friendId,
    };

    try {
      const response = await messageService.sendMessage(messageData);
      const savedMessage = response.data?.message;
      
      // Send via socket with proper format
      sendMessage({
        senderId: currentUserId,
        receiverId: friendId,
        content: newMessage,
        message: savedMessage,
      });
      
      // Add to local messages state
      if (savedMessage) {
        setMessages([
          ...messages,
          {
            ...savedMessage,
            senderId: savedMessage.sender?._id || currentUserId,
            receiverId: savedMessage.receiver?._id || friendId,
            content: savedMessage.content,
            createdAt: savedMessage.createdAt,
          },
        ]);
      }
      setNewMessage("");
      stopTyping({ receiverId: friendId });
    } catch (error) {
      console.error("Error sending message:", error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">{friendName}</h3>
        <p className="text-xs text-gray-500">Online</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => {
          // Handle both populated objects and plain IDs
          const senderId =
            msg.senderId ||
            msg.sender?._id ||
            (msg.sender && typeof msg.sender === "string" ? msg.sender : null);
          const isCurrentUser = senderId === currentUserId || msg.sender === currentUserId;

          return (
            <div
              key={msg._id || idx}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString()
                    : ""}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <button type="button" className="p-2 hover:bg-gray-100 rounded">
          <Paperclip size={20} className="text-gray-600" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageThread;
