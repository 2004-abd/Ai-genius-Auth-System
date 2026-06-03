const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Bearer token is missing."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "ACCESS_TOKEN_EXPIRED",
        message: "Access token expired. Please refresh your token."
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or malformed access token."
    });
  }
};

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in request."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}.`
      });
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
