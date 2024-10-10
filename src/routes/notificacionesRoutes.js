const express = require("express");
const {
  getNotificacionesBySociedad, // Asegúrate de que esta función esté definida en el controlador
} = require("../controllers/notificacionesController");
const router = express.Router();

// Ruta para obtener notificaciones por sociedad
router.get("/sociedad/:sociedadId", getNotificacionesBySociedad);

module.exports = router;
