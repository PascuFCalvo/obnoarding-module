const { signDocument } = require("../controllers/signController");
const { attachSignatureToDocument } = require("../controllers/signatureController");
const express = require("express");
const router = express.Router();

// Ruta para firmar un documento
router.post("/", signDocument);
router.post("/attachSignatureToDocument", attachSignatureToDocument);  

// Exporta el router para su uso en el servidor principal
module.exports = router;
