// src/controllers/docControllers/signDocument.js
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const users = require("../../data/users"); // Importar la lista de usuarios

async function signDocument(req, res) {
  const { workerId, documentName, signatureDataUrl, name, DNI, date } =
    req.body;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  const documentPath = path.join(
    __dirname,
    `../../uploads/society_${worker.societyId}/${documentName}`
  );
  if (!fs.existsSync(documentPath)) {
    return res.status(404).json({ message: "Documento no encontrado" });
  }

  const pdfBytes = fs.readFileSync(documentPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Insertar la firma en el PDF
  const pngImage = await pdfDoc.embedPng(signatureDataUrl);
  const firstPage = pdfDoc.getPages()[0];
  firstPage.drawImage(pngImage, { x: 50, y: 50, width: 200, height: 50 });
  firstPage.drawText(`Firmado por: ${name}`, { x: 50, y: 120, size: 12 });
  firstPage.drawText(`DNI: ${DNI}`, { x: 50, y: 100, size: 12 });
  firstPage.drawText(`Fecha: ${date}`, { x: 50, y: 80, size: 12 });

  const signedFilePath = path.join(
    __dirname,
    `../../uploads/society_${worker.societyId}/worker_${workerId}`,
    `signed_${documentName}`
  );
  if (!fs.existsSync(path.dirname(signedFilePath))) {
    fs.mkdirSync(path.dirname(signedFilePath), { recursive: true });
  }

  const signedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(signedFilePath, signedPdfBytes);

  const publicUrl = `/uploads/society_${worker.societyId}/worker_${workerId}/signed_${documentName}`;
  res.json({ message: "Documento firmado correctamente", filePath: publicUrl });
}

module.exports = signDocument; // Exportar la función
