const adminMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: false,
      message: "Authentication required: Please login first",
    });
  }

  const userRole = req.user.role?.toLowerCase()?.trim();
  const isAdminFromToken = req.user.isAdmin === true || userRole === "admin";

  if (isAdminFromToken) {
    return next();
  }

  try {
    const User = require("../models/user");
    const user = await User.findById(req.user.id).select("role");

    if (user && user.role?.toLowerCase()?.trim() === "admin") {
      req.user.role = user.role;
      req.user.isAdmin = true;
      return next();
    }
  } catch (error) {
    console.error("Error verifying admin from database:", error);
  }

  console.log("Admin access denied for user:", {
    userId: req.user.id,
    email: req.user.email,
    role: req.user.role,
    isAdmin: req.user.isAdmin,
  });

  return res.status(403).json({
    status: false,
    message:
      "Access denied: This action requires administrator privileges. Only admins can access this resource. Please login again if you were recently granted admin access.",
  });
};

module.exports = adminMiddleware;
