// src/controllers/docControllers/getManagerDocuments.js
const fs = require("fs");
const path = require("path");
const users = require("../../data/users");

function getManagerDocuments(req, res) {
  const managerId = req.params.managerId;
  const manager = users.find((u) => u.id == managerId && u.role === "manager");

  if (!manager) {
    return res.status(404).json({ message: "Manager no encontrado" });
  }

  const societyDocumentsPath = path.join(
    __dirname,
    `../../uploads/society_${manager.societyId}`
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ documents: [] });
  }

  const documents = fs.readdirSync(societyDocumentsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${manager.societyId}/${file}`,
  }));

  res.json({ documents });
}

module.exports = getManagerDocuments;
