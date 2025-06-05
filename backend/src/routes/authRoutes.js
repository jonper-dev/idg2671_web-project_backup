const express = require("express");
const authController = require("../controllers/authController"); // Import the whole object

const router = express.Router();

// Debugging: Log the imported authController object
console.log("authController:", authController);

router.post('/register', authController.registerResearcher);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);

module.exports = router;
