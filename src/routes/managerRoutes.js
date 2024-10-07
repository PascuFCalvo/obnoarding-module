const express = require("express");
const getDocumentsSociety = require("../controllers/managerControllers/getDocumentsSociety");
const getManagerWorkerDocuments = require("../controllers/docControllers/getManagerWorkerDocuments");
const router = express.Router();

// Asegúrate de que el workerId se pase como parámetro en la ruta
router.get("/documentsSociety/:societyId", getDocumentsSociety); // Cambia esto para incluir el parámetro
router.get("/worker-documents/:managerId/:workerId", getManagerWorkerDocuments);

module.exports = router;
