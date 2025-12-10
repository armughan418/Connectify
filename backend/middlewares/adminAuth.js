const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      message: "Admin authentication required: No token provided",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Access denied: Admin only",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired admin token",
    });
  }
};

module.exports = adminAuth;
