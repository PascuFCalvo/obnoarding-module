const express = require("express");
const {
  getUsuariosBySociedad,
  createUsuario,
} = require("../controllers/usuariosController");
const router = express.Router();

// Ruta para obtener usuarios por sociedad
router.get("/sociedad/:sociedadId", getUsuariosBySociedad);
router.post("/", createUsuario);

module.exports = router;
