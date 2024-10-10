const express = require("express");
const router = express.Router();
const documentacionController = require("../controllers/documentacionController");

router.get("/", documentacionController.obtenerDocumentacion);
router.get("/:id", documentacionController.obtenerDocumento);
router.post("/", documentacionController.crearDocumento);
router.put("/:id", documentacionController.actualizarDocumento);
router.delete("/:id", documentacionController.eliminarDocumento);

module.exports = router;
