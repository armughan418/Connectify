const api = () => {
  const local = "http://localhost:5000";

  const list = {
    registerUser: `${local}/api/user/register`,
    loginUser: `${local}/api/user/login`,
    forgetPassword: `${local}/api/user/forget/password`,
    verifyOtp: `${local}/api/user/otp/verify`,
    updatePassword: `${local}/api/user/update/password`,
    getAcess: `${local}/api/user/get/access`,
    adminStat: `${local}/api/admin/stats`,

    getUsers: `${local}/api/user/`,
    updateUser: (id) => `${local}/api/user/${id}`,
    deleteUser: (id) => `${local}/api/user/${id}`,

    addProduct: `${local}/api/products/add`,
    getProducts: `${local}/api/products`,
    getSingleProduct: (id) => `${local}/api/products/${id}`,
    updateProduct: (id) => `${local}/api/products/update/${id}`,
    deleteProduct: (id) => `${local}/api/products/delete/${id}`,

    // Cart
    addToCart: `${local}/api/cart/add`,
    getCart: `${local}/api/cart`,
    updateCartItem: `${local}/api/cart/update`,
    removeFromCart: (productId) => `${local}/api/cart/remove/${productId}`,

    getOrders: `${local}/api/orders`,
    getMyOrders: `${local}/api/orders/myorders`,
    createOrder: `${local}/api/orders/create`,
    getOrder: (id) => `${local}/api/orders/${id}`,
    updateOrder: (id) => `${local}/api/orders/${id}`,
    updateOrderStatus: (id) => `${local}/api/orders/${id}/status`,
    deleteOrder: (id) => `${local}/api/orders/${id}`,

    getReviews: (productId) => `${local}/api/reviews/${productId}`,
    addReview: `${local}/api/reviews`,
    deleteReview: (id) => `${local}/api/reviews/${id}`,
    // Carousel
    getCarousel: `${local}/api/carousel`,
    addCarouselImage: `${local}/api/carousel/add`,
    updateCarouselImage: (id) => `${local}/api/carousel/update/${id}`,
    deleteCarouselImage: (id) => `${local}/api/carousel/delete/${id}`,
    // example api() shape (you already have a util)
    // forgetPassword: "/api/user/forget-password",
    // verifyOtp: "/api/user/verify-otp",
    // updatePassword: "/api/user/update-password", // adjust if your route differs
    getUserProfile: `${local}/api/user/profile`,
    updateUserProfile: `${local}/api/user/profile`,
  };

  return list;
};

export default api;
