// src/routes/documentRoutes.js
const express = require("express");
const uploadController = require("../controllers/docControllers/uploadController");
const signDocument = require("../controllers/docControllers/signDocument");
const getSocietyDocuments = require("../controllers/docControllers/getSocietyDocuments");
const getManagerDocuments = require("../controllers/docControllers/getManagerDocuments");
const getWorkerDocuments = require("../controllers/docControllers/getWorkerDocuments");
const getSignedDocuments = require("../controllers/docControllers/getSignedDocuments");
const getManagerWorkerDocuments = require("../controllers/docControllers/getManagerWorkerDocuments");

const router = express.Router();

// Rutas para manejar documentos
router.post("/upload-info", async (req, res) => {
  // Aquí puedes guardar la información en la sesión o en un estado temporal
  // Suponiendo que estás usando express-session
  req.session.societyId = req.body.societyId; // Ejemplo de uso de session, deberás implementar express-session
  req.session.department = req.body.department;
  req.session.block = req.body.block;

  res.json({ message: "Información de sociedad y departamento recibida." });
});

// Ruta para subir el archivo
router.post(
  "/upload-file",
  uploadController.upload.single("document"),
  uploadController.uploadDocument
);
router.get("/society-documents/:societyId", getSocietyDocuments);
router.get("/manager/society-documents/:managerId", getManagerDocuments);
router.get("/documents/:workerId", getWorkerDocuments);
router.get("/worker/signed-documents/:workerId", getSignedDocuments);
router.get(
  "/manager/worker-documents/:managerId/:workerId",
  getSignedDocuments
);
router.post("/sign-document", getManagerWorkerDocuments);

module.exports = router;
