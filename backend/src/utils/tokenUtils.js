const jwt = require("jsonwebtoken");

const buildPayload = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role
});

const generateAccessToken = (user) => {
  return jwt.sign(buildPayload(user), process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m"
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(buildPayload(user), process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d"
  });
};

module.exports = {
  buildPayload,
  generateAccessToken,
  generateRefreshToken
};
