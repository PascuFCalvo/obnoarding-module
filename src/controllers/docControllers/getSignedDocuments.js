// src/controllers/docControllers/getSignedDocuments.js
const fs = require("fs");
const path = require("path");
const users = require("../../data/users");

function getSignedDocuments(req, res) {
  const workerId = req.params.workerId;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  // Ajustar la ruta para acceder a la carpeta de documentos firmados
  const signedDocsPath = path.join(
    __dirname,
    `../../../uploads/society_${worker.societyId}/worker_${workerId}`
  );

  // Verificar si la carpeta de documentos firmados existe
  if (!fs.existsSync(signedDocsPath)) {
    return res.json({ signedDocuments: [] }); // Si no existe, devolver lista vacía
  }

  // Leer los archivos dentro de la carpeta de documentos firmados del trabajador
  const signedDocuments = fs.readdirSync(signedDocsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/worker_${workerId}/${file}`,
  }));

  res.json({ signedDocuments });
}

module.exports = getSignedDocuments;
