const express = require("express");
const {
  getUsuariosBySociedad,
  createUsuario,
  deleteUsuario,
  updateUsuario,
  changeUserName
} = require("../controllers/usuariosController");
const router = express.Router();

// Ruta para obtener usuarios por sociedad
router.get("/sociedad/:sociedadId", getUsuariosBySociedad);
router.post("/", createUsuario);
router.delete("/:id", deleteUsuario);
router.put("/:id", updateUsuario);
router.put("/updateName/:id", changeUserName);

module.exports = router;
