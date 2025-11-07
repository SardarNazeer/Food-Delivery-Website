import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    console.log("🧾 Token received:", token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    req.user = decoded; // attach user id or data to request
    next();

  } catch (error) {
    console.log("Auth Middleware Error:", error.message);
    return res.status(403).json({ success: false, message: "Invalid token", error: error.message });
  }
};

export default authMiddleware;
