require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI-Genius secure auth API is running.",
    availableRoutes: ["/api/auth/login", "/api/auth/refresh", "/api/ai/free-model"]
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AI-Genius backend running on http://localhost:${PORT}`);
});
