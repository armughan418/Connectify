const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Authentication required: Please login to access this resource",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decoded; // id, email, role
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        message: "Session expired: Please login again",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        status: false,
        message: "Invalid authentication token",
      });
    }

    return res.status(403).json({
      status: false,
      message: "Authentication failed",
    });
  }
};

module.exports = authMiddleware;
