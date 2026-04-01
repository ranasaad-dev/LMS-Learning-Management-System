const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const notificationController = require("../controllers/notificationController");

router.get("/", notificationController.getNotification);
router.post("/", protect(["instructor", "admin"]) , notificationController.createNotification);
router.put("/:id", protect(["instructor", "admin"]) , notificationController.updateNotification);
router.delete("/:id", protect(["instructor", "admin"]) , notificationController.deleteNotification)
module.exports = router;