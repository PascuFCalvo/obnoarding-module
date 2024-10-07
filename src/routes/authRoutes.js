// src/routes/authRoutes.js
const express = require("express");
const loginController = require("../controllers/authControllers/loginController");

const router = express.Router();

// Ruta de login
router.post("/login", loginController);

module.exports = router;
