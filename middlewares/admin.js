const jwt = require("jsonwebtoken");
const { JWT_SECRET_ADMIN } = require("../config");

function adminMiddleware(req, res, next) {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(403).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET_ADMIN);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: "You are not signed in" });
  }
}

module.exports = { adminMiddleware };
