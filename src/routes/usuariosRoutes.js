const express = require("express");
const {
  getUsuariosBySociedad,
  createUsuario,
  deleteUsuario,
  updateUsuario,
  changeUserName,
  changeUserPassword,
  changeUserMail
} = require("../controllers/usuariosController");
const router = express.Router();

// Ruta para obtener usuarios por sociedad
router.get("/sociedad/:sociedadId", getUsuariosBySociedad);
router.post("/", createUsuario);
router.delete("/:id", deleteUsuario);
router.put("/:id", updateUsuario);
router.put("/updateName/:id", changeUserName);
router.put("/updatePassword/:id", changeUserPassword);
router.put("/updateMail/:id", changeUserMail);
module.exports = router;
