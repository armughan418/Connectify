const jwt = require("jsonwebtoken");

const getAccess = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const headerToken = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const cookieToken = req.cookies?.token;
    const token = headerToken || cookieToken;

    if (!token)
      return res
        .status(401)
        .json({ message: "No token provided", status: false });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    res.status(200).json({
      message: "Valid Token",
      status: true,
      email: decoded.email,
      isAdmin: decoded.isAdmin || false,
    });
  } catch (error) {
    console.log("Error in getAccess controller:", error);
    res.status(401).json({ message: "Invalid Token", status: false });
  }
};

module.exports = getAccess;
