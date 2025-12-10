const api = () => {
  const local = "http://localhost:5000";

  const list = {
    registerUser: `${local}/api/user/register`,
    loginUser: `${local}/api/user/login`,
    forgetPassword: `${local}/api/user/forget/password`,
    verifyOtp: `${local}/api/user/otp/verify`,
    updatePassword: `${local}/api/user/update/password`,
    getAcess: `${local}/api/user/get/access`,

    getUserProfile: `${local}/api/user/profile`,
    updateUserProfile: `${local}/api/user/profile`,
    getUserById: (id) => `${local}/api/user/${id}`,
    searchUsers: (query) =>
      `${local}/api/user/search?query=${encodeURIComponent(query)}`,
    getUsers: `${local}/api/auth/users`,
    updateUser: (id) => `${local}/api/auth/users/${id}`,
    deleteUser: (id) => `${local}/api/auth/users/${id}`,

    addFriend: `${local}/api/friend/add`,
    removeFriend: `${local}/api/friend/remove`,
    getFriends: `${local}/api/friend/list`,
    acceptFriend: `${local}/api/friend/accept`,

    createPost: `${local}/api/post/create`,
    getAllPosts: `${local}/api/post/all`,
    getPostById: (id) => `${local}/api/post/${id}`,
    updatePost: (id) => `${local}/api/post/${id}/update`,
    deletePost: (id) => `${local}/api/post/${id}/delete`,
    likePost: (id) => `${local}/api/post/${id}/like`,
    unlikePost: (id) => `${local}/api/post/${id}/unlike`,

    createComment: `${local}/api/comment/create`,
    getCommentsByPost: (postId) => `${local}/api/comment/post/${postId}`,
    getCommentById: (id) => `${local}/api/comment/${id}`,
    updateComment: (id) => `${local}/api/comment/${id}/update`,
    deleteComment: (id) => `${local}/api/comment/${id}/delete`,

    sendMessage: `${local}/api/message/send`,
    getMessages: (friendId) => `${local}/api/message/${friendId}`,
    getConversations: `${local}/api/message/conversations`,
    getUnreadCount: `${local}/api/message/unread/count`,

    reportPost: `${local}/api/report`,
    getPendingReports: `${local}/api/report/pending`,
    getAllReports: `${local}/api/report/all`,
    resolveReport: (id) => `${local}/api/report/${id}`,

    adminStat: `${local}/api/auth/stats`,

    getUploadSignature: `${local}/api/cloudinary/signature`,
    uploadFile: `${local}/api/cloudinary/upload`,
  };

  return list;
};

export default api;
