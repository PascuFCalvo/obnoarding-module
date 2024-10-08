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
  const workerDocumentsPath = path.join(
    __dirname,
    `../../../uploads/society_${worker.societyId}`
  );

  if (!fs.existsSync(workerDocumentsPath)) {
    return res.json({ documents: {} }); // Devuelve un objeto vacío si no hay documentos
  }

  const departments = fs
    .readdirSync(workerDocumentsPath)
    .filter((dir) =>
      fs.statSync(path.join(workerDocumentsPath, dir)).isDirectory()
    )
    .reduce((acc, department) => {
      // Crea una estructura para cada departamento
      const departmentPath = path.join(workerDocumentsPath, department);
      const blocks = fs
        .readdirSync(departmentPath)
        .filter((block) =>
          fs.statSync(path.join(departmentPath, block)).isDirectory()
        )
        .reduce((blockAcc, block) => {
          const blockPath = path.join(departmentPath, block);
          const files = fs.readdirSync(blockPath).map((file) => ({
            fileName: file,
            filePath: `/uploads/society_${worker.societyId}/${department}/${block}/${file}`,
          }));

          blockAcc[block] = files; // Asigna archivos al bloque correspondiente
          return blockAcc;
        }, {});

      acc[department] = blocks; // Asigna bloques al departamento correspondiente
      return acc;
    }, {});

  res.json({ documents: departments }); // Envía la estructura completa
}

module.exports = getManagerWorkerDocuments;
