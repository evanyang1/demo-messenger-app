const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to the request object, excluding the password
    req.user = await userModel.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Request is not authorized" });
  }
};
module.exports = authMiddleware;