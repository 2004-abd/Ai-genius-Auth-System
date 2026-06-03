const bcrypt = require("bcryptjs");

// Mock database for assignment purpose.
// Passwords are salted and hashed using bcrypt, not stored as plaintext.
const users = [
  {
    id: "u-admin-001",
    email: "admin@aigenius.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "Admin"
  },
  {
    id: "u-premium-001",
    email: "premium@aigenius.com",
    password: bcrypt.hashSync("premium123", 10),
    role: "Premium_User"
  },
  {
    id: "u-free-001",
    email: "free@aigenius.com",
    password: bcrypt.hashSync("free123", 10),
    role: "Free_User"
  }
];

// Refresh token whitelist. In production, store hashed refresh tokens in a database.
const refreshTokenWhitelist = [];

module.exports = {
  users,
  refreshTokenWhitelist
};
