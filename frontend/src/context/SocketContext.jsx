import React, { createContext, useContext, useState, useEffect } from "react";
import socketService from "../services/socketService";

const SocketContext = createContext();

export const SocketProvider = ({ children, userId }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (userId) {
      const socket = socketService.connect(userId);

      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      const handleMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      };
      socket.on("message", handleMessage);
      socket.on("receiveMessage", handleMessage);

      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("userTyping", (data) => {
        setTypingUsers((prev) => ({
          ...prev,
          [data.senderId]: true,
        }));
      });

      socket.on("userStoppedTyping", (data) => {
        setTypingUsers((prev) => ({
          ...prev,
          [data.senderId]: false,
        }));
      });

      return () => {
        socket.off("message", handleMessage);
        socket.off("receiveMessage", handleMessage);
        socket.off("userTyping");
        socket.off("userStoppedTyping");
        socketService.disconnect();
      };
    }
  }, [userId]);

  const sendMessage = (data) => {
    socketService.sendMessage(data);
  };

  const sendTyping = (data) => {
    socketService.sendTyping(data);
  };

  const stopTyping = (data) => {
    socketService.stopTyping(data);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        messages,
        onlineUsers,
        typingUsers,
        sendMessage,
        sendTyping,
        stopTyping,
        clearMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export default SocketContext;
