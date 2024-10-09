// src/controllers/docControllers/signDocument.js
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const users = require("../../data/users"); // Importar la lista de usuarios

async function signDocument(req, res) {
  const { workerId, documentName, signatureDataUrl, name, DNI, date } =
    req.body;

  console.log("Request Body:", req.body); // Para verificar la información recibida

  // Buscar el trabajador
  const worker = users.find((u) => u.id == workerId && u.role === "worker");
  if (!worker) {
    console.error("Trabajador no encontrado:", workerId); // Mensaje de error
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }
  console.log("Trabajador encontrado:", worker); // Información del trabajador

  // Ruta base de la sociedad
  const societyBasePath = path.join(
    __dirname,
    `../../../uploads/society_${worker.societyId}`
  );

  // Función para buscar el documento en las subcarpetas
  function findDocument(dir, fileName) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        // Llamar a la función recursivamente si es un directorio
        const foundPath = findDocument(filePath, fileName);
        if (foundPath) return foundPath; // Si se encontró, devolver la ruta
      } else if (file === fileName) {
        // Si se encontró el archivo, devolver la ruta
        return filePath;
      }
    }
    return null; // Retornar null si no se encuentra el archivo
  }

  // Buscar el documento
  const documentPath = findDocument(societyBasePath, documentName);
  if (!documentPath) {
    console.error("Documento no encontrado en las subcarpetas:", documentName); // Mensaje de error
    return res.status(404).json({ message: "Documento no encontrado" });
  }

  console.log("Ruta del documento:", documentPath); // Para verificar la ruta del documento

  // Verificar si el documento es un PDF
  const fileExtension = path.extname(documentName).toLowerCase();
  if (fileExtension !== ".pdf") {
    console.log("El archivo no es un PDF, se creará un justificante.");

    // Crear un PDF justificante
    const justificationDoc = await PDFDocument.create();
    const page = justificationDoc.addPage([600, 400]);
    page.drawText(`Justificante de visualización`, { x: 50, y: 350, size: 24 });
    page.drawText(`Has visualizado el video: ${documentName}`, {
      x: 50,
      y: 300,
      size: 16,
    });
    page.drawText(`Firmado por: ${name}`, { x: 50, y: 250, size: 16 });
    page.drawText(`DNI: ${DNI}`, { x: 50, y: 230, size: 16 });
    page.drawText(`Fecha: ${date}`, { x: 50, y: 210, size: 16 });

    // Insertar la firma en el justificante
    const pngImage = await justificationDoc.embedPng(
      signatureDataUrl.replace(/^data:image\/png;base64,/, "")
    );
    page.drawImage(pngImage, { x: 50, y: 150, width: 200, height: 50 });

    // Guardar el justificante
    const justificationFileName =
      documentName.replace(fileExtension, "") + "_justificante.pdf";
    const justificationFilePath = path.join(
      __dirname,
      `../../../uploads/society_${worker.societyId}/worker_${workerId}`,
      justificationFileName
    );

    // Crear la carpeta del trabajador si no existe
    if (!fs.existsSync(path.dirname(justificationFilePath))) {
      fs.mkdirSync(path.dirname(justificationFilePath), { recursive: true });
      console.log("Directorio creado:", path.dirname(justificationFilePath)); // Confirmación de creación de directorio
    }

    const justificationPdfBytes = await justificationDoc.save();
    fs.writeFileSync(justificationFilePath, justificationPdfBytes);
    console.log("Documento justificante guardado correctamente");

    // Devolver la ruta pública del justificante
    const publicUrl = `/uploads/society_${worker.societyId}/worker_${workerId}/${justificationFileName}`;
    return res.json({
      message: "Documento justificante creado correctamente",
      filePath: publicUrl,
    });
  }

  // Si es un PDF, proceder con la firma
  const pdfBytes = fs.readFileSync(documentPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  console.log("Documento PDF cargado correctamente"); // Confirmación de carga

  // Insertar la firma en el PDF
  const pngImage = await pdfDoc.embedPng(
    signatureDataUrl.replace(/^data:image\/png;base64,/, "")
  );
  const firstPage = pdfDoc.getPages()[0];
  firstPage.drawImage(pngImage, { x: 50, y: 50, width: 200, height: 50 });
  firstPage.drawText(`Firmado por: ${name}`, { x: 50, y: 120, size: 12 });
  firstPage.drawText(`DNI: ${DNI}`, { x: 50, y: 100, size: 12 });
  firstPage.drawText(`Fecha: ${date}`, { x: 50, y: 80, size: 12 });

  // Guardar el documento firmado
  const signedDirectoryPath = path.join(
    __dirname,
    `../../../uploads/society_${worker.societyId}/worker_${workerId}`
  );
  const signedFilePath = path.join(
    signedDirectoryPath,
    `signed_${documentName}`
  );
  console.log("Ruta del documento firmado:", signedFilePath); // Ruta para guardar el documento firmado

  // Crear la carpeta del trabajador si no existe
  if (!fs.existsSync(signedDirectoryPath)) {
    fs.mkdirSync(signedDirectoryPath, { recursive: true });
    console.log("Directorio creado:", signedDirectoryPath); // Confirmación de creación de directorio
  }

  const signedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(signedFilePath, signedPdfBytes);
  console.log("Documento firmado guardado correctamente"); // Confirmación de guardado

  // Devolver la ruta pública del documento firmado
  const publicUrl = `/uploads/society_${worker.societyId}/worker_${workerId}/signed_${documentName}`;
  res.json({ message: "Documento firmado correctamente", filePath: publicUrl });
}

module.exports = signDocument; // Exportar la función
