const express = require("express");
const router = express.Router();
const { getGruposBySociedad } = require("../controllers/gruposController");
const { createGrupo } = require("../controllers/gruposController");

// Rutas protegidas con authMiddleware
router.get("/sociedad/:sociedadId", getGruposBySociedad);
router.post("/", createGrupo);

module.exports = router;
