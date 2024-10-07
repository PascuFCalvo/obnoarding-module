// src/controllers/docControllers/getSocietyDocuments.js
const fs = require("fs");
const path = require("path");
const users = require("../../data/users");

function getSocietyDocuments(req, res) {
  const societyId = req.params.societyId;
  const societyDocumentsPath = path.join(
    __dirname,
    `../../uploads/society_${societyId}`
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ documents: [] });
  }

  const documents = fs.readdirSync(societyDocumentsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${societyId}/${file}`,
  }));

  res.json({ documents });
}

module.exports = getSocietyDocuments;
