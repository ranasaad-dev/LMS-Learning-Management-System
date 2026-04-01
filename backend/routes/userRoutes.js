const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect(["admin"]), userController.getUsers);

router.get("/:id", protect(["admin"]), userController.getUserById);

router.post("/", protect(["admin"]), userController.createUser);

router.put("/:id", protect(["admin"]), userController.updateUser);

router.delete("/:id", protect(["admin"]), userController.deleteUser);

module.exports = router;
