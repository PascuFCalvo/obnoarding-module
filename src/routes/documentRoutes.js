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
router.post(
  "/upload",
  uploadController.upload.single("document"),
  uploadController.uploadDocument
);
router.get("/society-documents/:societyId", getSocietyDocuments);
router.get("/manager/society-documents/:managerId", getManagerDocuments);
router.get("/documents/:workerId", getWorkerDocuments);
router.get("/worker/signed-documents/:workerId", getSignedDocuments);
router.get("/manager/worker-documents/:workerId", getManagerWorkerDocuments);
router.post("/sign-document", signDocument);

module.exports = router;
