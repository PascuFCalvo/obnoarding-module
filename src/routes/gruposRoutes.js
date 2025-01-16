const express = require("express");
const router = express.Router();
const {
  deleteUserFromGroup,
  addUserToGroup,
  getGruposBySociedad,
  getAllUserGroups, // Asegúrate de usar el nombre correcto
  createGrupo,
} = require("../controllers/gruposController");

// Rutas protegidas con authMiddleware
router.get("/sociedad/:sociedadId", getGruposBySociedad);
router.post("/", createGrupo);
router.get("/usuarioGrupo", getAllUserGroups);
router.post("/addUser", addUserToGroup)
router.post("/deleteUser", deleteUserFromGroup)

module.exports = router;
