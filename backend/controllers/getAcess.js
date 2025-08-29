const jwt = require("jsonwebtoken");

const getAcess = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided", status: false });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    return res
      .status(200)
      .json({ message: "Valid Token", status: true, email: decoded.email });
  } catch (error) {
    console.log("Error in getAcess controller => ", error);
    return res.status(401).json({ message: "Invalid Token", status: false });
  }
};

module.exports = getAcess;
