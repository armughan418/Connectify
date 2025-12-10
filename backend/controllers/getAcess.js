const jwt = require("jsonwebtoken");

const getAccess = async (req, res) => {
  try {
    const userCookieToken = req.cookies?.token;

    const headerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = headerToken || userCookieToken;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    const isAdmin = headerToken && decoded.role === "admin" ? true : false;

    if (!headerToken && decoded.role === "admin") {
      return res.status(403).json({
        status: false,
        message: "Admin access requires login",
      });
    }

    res.status(200).json({
      status: true,
      message: "Valid Token",
      email: decoded.email,
      id: decoded.id,
      role: decoded.role,
      isAdmin,
    });
  } catch (error) {
    console.error("Error in getAccess:", error);
    res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = getAccess;
