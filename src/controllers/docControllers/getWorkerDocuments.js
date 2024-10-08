const fs = require("fs");
const path = require("path");
const users = require("../../data/users");

function getWorkerDocuments(req, res) {
  const workerId = req.params.workerId;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  const societyDocumentsPath = path.join(
    __dirname,
    `../../../uploads/society_${worker.societyId}`
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ documents: [] });
  }

  const documentsByDepartment = {};
  const allowedDepartments = [worker.department]; // Asumiendo que el trabajador tiene un campo 'department'

  // Leer las carpetas dentro de la carpeta de la sociedad
  fs.readdirSync(societyDocumentsPath).forEach((department) => {
    // Verifica si el departamento es uno de los permitidos
    if (allowedDepartments.includes(department) || department === "general") {
      const departmentPath = path.join(societyDocumentsPath, department);
      if (fs.lstatSync(departmentPath).isDirectory()) {
        documentsByDepartment[department] = {};

        // Leer los bloques dentro de cada departamento
        fs.readdirSync(departmentPath).forEach((block) => {
          const blockPath = path.join(departmentPath, block);
          if (fs.lstatSync(blockPath).isDirectory()) {
            documentsByDepartment[department][block] = [];

            // Leer los archivos dentro de cada bloque
            fs.readdirSync(blockPath).forEach((file) => {
              documentsByDepartment[department][block].push({
                fileName: file,
                filePath: `/uploads/society_${worker.societyId}/${department}/${block}/${file}`,
              });
            });
          }
        });
      }
    }
  });

  res.json({ documents: documentsByDepartment });
}

module.exports = getWorkerDocuments;
