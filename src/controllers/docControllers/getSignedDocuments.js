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

  const signedDocsPath = path.join(
    __dirname,
    `../../uploads/society_${worker.societyId}/worker_${workerId}`
  );

  if (!fs.existsSync(signedDocsPath)) {
    return res.json({ signedDocuments: [] });
  }

  const signedDocuments = fs.readdirSync(signedDocsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/worker_${workerId}/${file}`,
  }));

  res.json({ signedDocuments });
}

module.exports = getSignedDocuments;
