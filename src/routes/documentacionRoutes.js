// src/routes/documentacionRoutes.js
const express = require("express");
const upload = require("../config/multerConfig"); // Asegúrate de que la configuración de Multer esté bien importada
const {
  uploadDocumentacion,
  getDocumentosPorUsuarioYsociedad,
  getDocumentacionPorSociedad,
  getDocumentosPorDepartamentoYsociedad,
  getDocumentosPorGrupoYsociedad,
} = require("../controllers/documentacionController");
const router = express.Router();

// Ruta para subir la documentación
router.post("/upload", upload.single("file"), uploadDocumentacion);
router.get(
  "/sociedad/:sociedadId/documentacionUsuarios",
  getDocumentosPorUsuarioYsociedad
);
router.get(
  "/sociedad/:sociedadId/documentacionSociedad",
  getDocumentacionPorSociedad
); // Nueva ruta para obtener toda la documentación por sociedad
router.get(
  "/sociedad/:sociedadId/documentacionGrupos",
  getDocumentosPorGrupoYsociedad
);
router.get(
  "/sociedad/:sociedadId/documentacionDepartamentos",
  getDocumentosPorDepartamentoYsociedad
);

module.exports = router;
