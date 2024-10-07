// src/controllers/docControllers/getWorkerDocuments.js
const fs = require("fs");
const path = require("path");
const users = require("../../data/users"); // Asegúrate de que la ruta sea correcta

function getWorkerDocuments(req, res) {
  const workerId = req.params.workerId;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  // Ajustar la ruta para acceder a la carpeta de documentos de la sociedad
  const societyDocumentsPath = path.join(
    __dirname,
    `../../uploads/society_${worker.societyId}` // Ajusta para acceder a los documentos de la sociedad
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ societyDocuments: [] }); // Devuelve un arreglo vacío si no hay documentos
  }

  const documents = fs.readdirSync(societyDocumentsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/${file}`,
  }));

  res.json({ societyDocuments: documents });
}

module.exports = getWorkerDocuments;
