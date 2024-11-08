const express = require("express");
const {
  getUsuariosBySociedad,
  createUsuario,
  deleteUsuario,
  updateUsuario,
} = require("../controllers/usuariosController");
const router = express.Router();

// Ruta para obtener usuarios por sociedad
router.get("/sociedad/:sociedadId", getUsuariosBySociedad);
router.post("/", createUsuario);
router.delete("/:id", deleteUsuario);
router.put("/:id", updateUsuario);

module.exports = router;
