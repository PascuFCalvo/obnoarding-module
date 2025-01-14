const express = require("express");
const { signAndSaveDcoument } = require("../controllers/signController");
const upload = require("../middlewares/multerConfig");
const router = express.Router();

// Ruta para obtener usuarios por sociedad
router.post("/signAndSave", upload.single("file"), signAndSaveDcoument);

module.exports = router;
