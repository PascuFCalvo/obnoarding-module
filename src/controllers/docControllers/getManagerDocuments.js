const fs = require("fs");
const path = require("path");
const blocks = require("../../data/blocks"); // Asumiendo que este archivo contiene los bloques

// Obtener nombres de los bloques válidos y añadir "general" manualmente
const validBlocks = blocks.map((block) => block.name);
validBlocks.push("general");

function getSocietyDocuments(req, res) {
  const societyId = req.params.societyId;
  const societyDocumentsPath = path.join(
    __dirname,
    `../../../uploads/society_${societyId}`
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ documents: {} }); // Retornar un objeto vacío si no existen documentos
  }

  const departments = fs
    .readdirSync(societyDocumentsPath)
    .filter((dir) =>
      fs.statSync(path.join(societyDocumentsPath, dir)).isDirectory()
    )
    .reduce((acc, department) => {
      const departmentPath = path.join(societyDocumentsPath, department);

      // Iterar sobre los bloques dentro del departamento y filtrar los válidos
      const blocks = fs
        .readdirSync(departmentPath)
        .filter(
          (block) =>
            fs.statSync(path.join(departmentPath, block)).isDirectory() &&
            validBlocks.includes(block) // Verifica si el bloque es válido
        )
        .reduce((blockAcc, block) => {
          const blockPath = path.join(departmentPath, block);
          const files = fs
            .readdirSync(blockPath)
            .filter((file) => fs.statSync(path.join(blockPath, file)).isFile()) // Verifica que sean archivos
            .map((file) => ({
              fileName: file,
              filePath: `/uploads/society_${societyId}/${department}/${block}/${file}`,
            }));

          blockAcc[block] = files; // Asigna archivos al bloque correspondiente
          return blockAcc;
        }, {});

      if (Object.keys(blocks).length > 0) {
        acc[department] = blocks; // Solo añadir si hay bloques con archivos
      }
      return acc;
    }, {});

  res.json({ documents: departments }); // Enviar la estructura completa
}

module.exports = getSocietyDocuments;
