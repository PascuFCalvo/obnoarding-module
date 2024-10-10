const express = require("express");
const { getRoles } = require("../controllers/rolesController");
const router = express.Router();

// Ruta para obtener usuarios por sociedad
router.get("/roles", getRoles);

module.exports = router;
