// src/controllers/docControllers/getSocietyDocuments.js
const fs = require("fs");
const path = require("path");

function getSocietyDocuments(req, res) {
  const societyId = req.params.societyId;
  const societyDocumentsPath = path.join(
    __dirname,
    `../../../uploads/society_${societyId}`
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ documents: {} }); // Cambia a un objeto vacío para la estructura
  }

  const departments = fs
    .readdirSync(societyDocumentsPath)
    .filter((dir) =>
      fs.statSync(path.join(societyDocumentsPath, dir)).isDirectory()
    )
    .reduce((acc, department) => {
      // Crea una estructura para cada departamento
      const departmentPath = path.join(societyDocumentsPath, department);
      const blocks = fs
        .readdirSync(departmentPath)
        .filter((block) =>
          fs.statSync(path.join(departmentPath, block)).isDirectory()
        )
        .reduce((blockAcc, block) => {
          const blockPath = path.join(departmentPath, block);
          const files = fs.readdirSync(blockPath).map((file) => ({
            fileName: file,
            filePath: `/uploads/society_${societyId}/${department}/${block}/${file}`,
          }));

          blockAcc[block] = files; // Asigna archivos al bloque correspondiente
          return blockAcc;
        }, {});

      acc[department] = blocks; // Asigna bloques al departamento correspondiente
      return acc;
    }, {});

  res.json({ documents: departments }); // Envía la estructura completa
}

module.exports = getSocietyDocuments;
