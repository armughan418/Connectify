const config = {
  API_BASE_URL: "http://localhost:5000",
  SOCKET_URL: "http://localhost:5000",

  ENDPOINTS: {
    AUTH: {
      REGISTER: "/api/user/register",
      LOGIN: "/api/user/login",
      LOGOUT: "/api/user/logout",
      FORGET_PASSWORD: "/api/user/forget/password",
      VERIFY_OTP: "/api/user/otp/verify",
      UPDATE_PASSWORD: "/api/user/update/password",
      GET_ACCESS: "/api/user/get/access",
    },
    USER: {
      PROFILE: "/api/user/profile",
      UPDATE_PROFILE: "/api/user/profile",
      GET_ALL_USERS: "/api/auth/users",
      UPDATE_USER: "/api/auth/users/:id",
      DELETE_USER: "/api/auth/users/:id",
    },
    FRIENDS: {
      ADD_FRIEND: "/api/friend/add",
      REMOVE_FRIEND: "/api/friend/remove",
      GET_FRIENDS: "/api/friend/list",
      ACCEPT_FRIEND: "/api/friend/accept",
    },
    POSTS: {
      CREATE_POST: "/api/post/create",
      GET_ALL_POSTS: "/api/post/all",
      GET_POST_BY_ID: "/api/post/:id",
      UPDATE_POST: "/api/post/:id/update",
      DELETE_POST: "/api/post/:id/delete",
      LIKE_POST: "/api/post/:id/like",
      UNLIKE_POST: "/api/post/:id/unlike",
    },
    COMMENTS: {
      CREATE_COMMENT: "/api/comment/create",
      GET_COMMENTS_BY_POST: "/api/comment/post/:postId",
      GET_COMMENT_BY_ID: "/api/comment/:id",
      UPDATE_COMMENT: "/api/comment/:id/update",
      DELETE_COMMENT: "/api/comment/:id/delete",
    },
    MESSAGES: {
      SEND_MESSAGE: "/api/message/send",
      GET_MESSAGES: "/api/message/:friendId",
      GET_CONVERSATIONS: "/api/message/conversations",
      GET_UNREAD_COUNT: "/api/message/unread/count",
    },
    REPORTS: {
      REPORT_POST: "/api/report/report",
      GET_PENDING_REPORTS: "/api/report/pending",
      GET_ALL_REPORTS: "/api/report/all",
      RESOLVE_REPORT: "/api/report/:id/resolve",
    },
    ADMIN: {
      GET_STATS: "/api/auth/stats",
    },
    CLOUDINARY: {
      GET_SIGNATURE: "/api/cloudinary/signature",
      UPLOAD: "/api/cloudinary/upload",
    },
  },

  FEATURES: {
    REAL_TIME_MESSAGING: true,
    FRIEND_SYSTEM: true,
    POST_CREATION: true,
    COMMENTS: true,
    REPORTS: true,
    ADMIN_PANEL: true,
    FILE_UPLOAD: true,
  },

  SOCKET_EVENTS: {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    REGISTER: "register",
    SEND_MESSAGE: "sendMessage",
    RECEIVE_MESSAGE: "message",
    TYPING: "typing",
    STOP_TYPING: "stopTyping",
    USER_TYPING: "userTyping",
    USER_STOPPED_TYPING: "userStoppedTyping",
    ONLINE_USERS: "onlineUsers",
  },
};

export default config;
