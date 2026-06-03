const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { freeModel, premiumModel, purgeCache } = require("../controllers/aiController");

const router = express.Router();

router.get("/free-model", protect, freeModel);
router.post("/premium-model", protect, restrictTo("Premium_User", "Admin"), premiumModel);
router.delete("/purge-cache", protect, restrictTo("Admin"), purgeCache);

module.exports = router;
