// controllers/uploadController.js
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const societyId = req.session.societyId; // Obtener el societyId de la sesión
    const department = req.session.department || "general"; // Obtener el departamento de la sesión
    const block = req.session.block; // Obtener el bloque de la sesión

    console.log("department", department); // Para depuración
    console.log("societyId", societyId);
    console.log("bloque", block); // Para depuración

    // Si el manager elige un departamento al que asignar el documento
    if (department && department !== "general") {
      const uploadDir = path.join(
        __dirname,
        `../../../uploads/society_${societyId}/${department}/${block}`
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } else {
      const uploadDir = path.join(
        __dirname,
        `../../../uploads/society_${societyId}/general/${block}`
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Middleware de multer
const upload = multer({ storage: storage });

function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No se ha subido ningún archivo." });
  }
  const societyId = req.session.societyId; // Usar el id de la sesión
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
