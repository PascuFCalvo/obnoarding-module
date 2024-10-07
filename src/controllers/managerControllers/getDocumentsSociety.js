const fs = require("fs");
const path = require("path");
const users = require("../../data/users"); // Importar la lista de usuarios desde la ruta correcta

function getCoursesSociety(req, res) {
  const workerId = req.params.workerId;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  const societyDocumentsPath = path.join(
    __dirname,
    `uploads/society_${worker.societyId}`
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ societyDocuments: [] });
  }

  const documents = fs.readdirSync(societyDocumentsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/${file}`,
  }));

  res.json({ societyDocuments: documents });
}

module.exports = getCoursesSociety; // Exportar la función
