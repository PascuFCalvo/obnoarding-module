// src/controllers/docControllers/getManagerWorkerDocuments.js
const fs = require("fs");
const path = require("path");
const users = require("../../data/users");

function getManagerWorkerDocuments(req, res) {
  const workerId = req.params.workerId;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  const manager = users.find(
    (u) => u.id == req.params.managerId && u.role === "manager"
  );
  if (!manager) {
    return res.status(404).json({ message: "Manager no encontrado" });
  }

  // Ajustar la ruta para acceder a la carpeta de documentos del trabajador
  const signedDocsPath = path.join(
    __dirname,
    `../../uploads/society_${worker.societyId}/worker_${workerId}`
  );

  if (!fs.existsSync(signedDocsPath)) {
    return res.json({ documents: [] }); // Devuelve un arreglo vacío si no hay documentos
  }

  const documents = fs.readdirSync(signedDocsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/worker_${workerId}/${file}`,
  }));

  res.json({ documents });
}

module.exports = getManagerWorkerDocuments;
