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
    console.log("No existe la carpeta de documentos firmados."); // Mensaje de depuración
    return res.json({ signedDocuments: [] }); // Si no existe, devolver lista vacía
  }

  const signedDocuments = {};

  // Leer los archivos dentro de la carpeta de documentos firmados del trabajador
  fs.readdirSync(signedDocsPath).forEach((file) => {
    const filePath = path.join(signedDocsPath, file);
    console.log("Archivo encontrado:", file); // Para depuración
    if (fs.lstatSync(filePath).isFile()) {
      // Extraer información para construir la estructura
      const [department, block] = file.split("_"); // Asumiendo que el nombre del archivo contiene información estructurada

      // Asegurarse de que la estructura existe
      if (!signedDocuments[department]) {
        signedDocuments[department] = {};
      }
      if (!signedDocuments[department][block]) {
        signedDocuments[department][block] = [];
      }

      signedDocuments[department][block].push({
        fileName: file,
        filePath: `/uploads/society_${worker.societyId}/worker_${workerId}/${file}`,
      });
    }
  });

  console.log("Documentos firmados estructurados:", signedDocuments); // Para depuración
  res.json({ signedDocuments });
}

module.exports = getSignedDocuments;
