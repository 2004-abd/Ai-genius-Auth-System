const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users, refreshTokenWhitelist } = require("../database/mockDB");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required."
    });
  }

  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokenWhitelist.push(refreshToken);

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
};

const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token cookie not found. Please login again."
    });
  }

  if (!refreshTokenWhitelist.includes(refreshToken)) {
    return res.status(403).json({
      success: false,
      message: "Refresh token is not whitelisted or has been revoked."
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

    return res.status(200).json({
      success: true,
      message: "New access token generated successfully.",
      accessToken: newAccessToken,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token. Please login again."
    });
  }
};

const logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const tokenIndex = refreshTokenWhitelist.indexOf(refreshToken);
    if (tokenIndex !== -1) {
      refreshTokenWhitelist.splice(tokenIndex, 1);
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful. Refresh token revoked."
  });
};

const me = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated user profile fetched successfully.",
    user: req.user
  });
};

module.exports = {
  login,
  refresh,
  logout,
  me
};
