const express = require("express");
const getDocumentsSociety = require("../controllers/managerControllers/getDocumentsSociety");
const router = express.Router();

// Asegúrate de que el workerId se pase como parámetro en la ruta
router.get("/documentsSociety/:societyId", getDocumentsSociety); // Cambia esto para incluir el parámetro

module.exports = router;
