// src/routes/authRoutes.js
const express = require("express");
const loginController = require("../controllers/authControllers/loginController");
const ssoLogin = require("../controllers/authControllers/ssoController");

const router = express.Router();

// Ruta de login
router.post("/login", loginController);
router.post("/ssologin", ssoLogin);

module.exports = router;
