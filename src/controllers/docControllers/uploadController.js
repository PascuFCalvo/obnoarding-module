// controllers/uploadController.js
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const societyId = req.body.societyId || 1;
    const uploadDir = path.join(__dirname, `../uploads/society_${societyId}`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No se ha subido ningún archivo." });
  }
  const societyId = req.body.societyId;
  const documentPath = path.join(
    `/uploads/society_${societyId}`,
    req.file.originalname
  );
  res.json({
    message: "Documento subido correctamente",
    filePath: documentPath,
  });
}

// Exportar el middleware y la función
module.exports = {
  upload,
  uploadDocument,
};
