require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIO = require("socket.io");
const getConnection = require("./utils/getConnection");

const userRoutes = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const adminRoutes = require("./routes/adminRoute");
const cloudinaryRoute = require("./routes/cloudinaryRoute");
const friendRoute = require("./routes/friendRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const messageRoute = require("./routes/messageRoute");
const reportRoute = require("./routes/reportRoute");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ---------- ROUTES ----------
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/cloudinary", cloudinaryRoute);
app.use("/api/friend", friendRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api/message", messageRoute);
app.use("/api/report", reportRoute);

const userSockets = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (data) => {
    const userId = typeof data === "string" ? data : data?.userId || data;
    if (userId) {
      userSockets[userId] = socket.id;
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    }
  });

  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, content, message } = data;
    const receiverSocketId = userSockets[receiverId];

    if (receiverSocketId) {
      const messageData = {
        senderId,
        receiverId,
        content,
        createdAt: new Date(),
        message,
      };
      io.to(receiverId).emit("receiveMessage", messageData);
      io.to(receiverId).emit("message", messageData);
      console.log(`Message sent from ${senderId} to ${receiverId}`);
    } else {
      console.log(`Receiver ${receiverId} is offline`);
    }
  });

  socket.on("typing", (data) => {
    const { senderId, receiverId } = data;
    io.to(receiverId).emit("userTyping", { senderId });
  });

  socket.on("stopTyping", (data) => {
    const { senderId, receiverId } = data;
    io.to(receiverId).emit("userStoppedTyping", { senderId });
  });

  socket.on("disconnect", () => {
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

getConnection();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
