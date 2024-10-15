// multerConfig.js
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo
  },
});

// Configuración de multer
const upload = multer({ storage });

module.exports = upload;
