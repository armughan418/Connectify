const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  // Check both cookie and Authorization header
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  
  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "User authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    // Allow both user and admin roles for user profile (admin can view user profiles too)
    if (!decoded.role || (decoded.role !== "user" && decoded.role !== "admin")) {
      return res.status(403).json({
        status: false,
        message: "Access denied: Invalid account type",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        message: "Session expired: Please login again",
      });
    }
    return res.status(401).json({
      status: false,
      message: "Invalid or expired user token",
    });
  }
};

module.exports = userAuth;
