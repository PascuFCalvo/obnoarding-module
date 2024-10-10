const express = require("express");
const router = express.Router();
const {
  getDepartamentosBySociedad,
  createDepartamento,
} = require("../controllers/departamentosController");

// Rutas protegidas con authMiddleware
router.get("/sociedad/:sociedadId", getDepartamentosBySociedad);
router.post("/", createDepartamento);

module.exports = router;
