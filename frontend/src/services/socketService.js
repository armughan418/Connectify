import io from "socket.io-client";

let socket = null;

const socketService = {
  connect: (userId) => {
    socket = io("http://localhost:5000", {
      query: { userId },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("register", { userId });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => socket,

  sendMessage: (data) => {
    if (socket) {
      socket.emit("sendMessage", data);
    }
  },

  onMessage: (callback) => {
    if (socket) {
      socket.on("message", callback);
    }
  },

  onTyping: (callback) => {
    if (socket) {
      socket.on("typing", callback);
    }
  },

  sendTyping: (data) => {
    if (socket) {
      socket.emit("typing", data);
    }
  },

  stopTyping: (data) => {
    if (socket) {
      socket.emit("stopTyping", data);
    }
  },

  onStopTyping: (callback) => {
    if (socket) {
      socket.on("stopTyping", callback);
    }
  },

  removeListener: (eventName) => {
    if (socket) {
      socket.removeListener(eventName);
    }
  },

  removeAllListeners: () => {
    if (socket) {
      socket.removeAllListeners();
    }
  },
};

export default socketService;
