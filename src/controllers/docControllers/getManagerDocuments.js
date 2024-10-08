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
    `../../../uploads/society_${manager.societyId}`
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
            filePath: `/uploads/society_${manager.societyId}/${department}/${block}/${file}`,
          }));

          blockAcc[block] = files; // Asigna archivos al bloque correspondiente
          return blockAcc;
        }, {});

      acc[department] = blocks; // Asigna bloques al departamento correspondiente
      return acc;
    }, {});

  res.json({ documents: departments }); // Envía la estructura completa
}

module.exports = getManagerDocuments;
