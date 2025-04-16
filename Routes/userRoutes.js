const express = require("express");
const router = express.Router();

const { registerUser} = require("../Controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");



router.post('/register', registerUser);


module.exports = router;