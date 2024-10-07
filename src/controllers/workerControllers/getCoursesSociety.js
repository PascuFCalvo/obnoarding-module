// src/controllers/workerControllers/getCoursesSociety.js
const fs = require("fs");
const path = require("path");
const users = require("../../data/users"); // Importar la lista de usuarios

function getCoursesSociety(req, res) {
  const workerId = req.params.workerId; // Asegúrate de que workerId se pase como parámetro en la URL
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  const societyDocumentsPath = path.join(
    __dirname,
    `../../../uploads/society_${worker.societyId}`
  ); // Ruta para acceder a los documentos de la sociedad

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ societyDocuments: [] }); // Devuelve un arreglo vacío si no hay documentos
  }

  const documents = fs.readdirSync(societyDocumentsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/${file}`,
  }));

  res.json({ societyDocuments: documents });
}

module.exports = getCoursesSociety; // Exportar la función
