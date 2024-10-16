// Importar los modelos y otros módulos necesarios
const {
  Sociedad,
  Usuario,
  Documentacion,
  UsuarioDocumentacion,
} = require("../models");
const fs = require("fs").promises;
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const { v4: uuidv4 } = require("uuid");

const attachSignatureToDocument = async (req, res) => {
  const { name, dni, signatureData, usuarioId, sociedadId, documentName } =
    req.body;

  console.log("Datos recibidos en el backend:", {
    name,
    dni,
    signatureData,
    usuarioId,
    sociedadId,
    documentName,
  });

  if (!name || !dni || !signatureData || !sociedadId || !documentName) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const sociedad = await Sociedad.findOne({
      where: { id: sociedadId },
      attributes: ["nombre"],
    });

    if (!sociedad) {
      return res.status(404).json({ error: "Sociedad no encontrada" });
    }

    const usuario = await Usuario.findOne({
      where: { id: usuarioId },
      attributes: ["nombre", "apellido"],
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const documento = await Documentacion.findOne({
      where: { nombre: documentName },
      attributes: ["id"],
    });

    if (!documento) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    const usuarioDocumentacion = await UsuarioDocumentacion.findOne({
      where: { id_usuario: usuarioId, documento_id: documento.id },
    });

    if (!usuarioDocumentacion) {
      return res
        .status(404)
        .json({ error: "Registro de UsuarioDocumentacion no encontrado" });
    }

    // Procesar el documento y agregar la firma
    const sociedadEncontrada = sociedad.nombre;
    const usuarioEncontrado = `${usuario.nombre} ${usuario.apellido}`;
    const documentPath = path.join(
      __dirname,
      "../uploads",
      sociedadEncontrada,
      documentName
    );
    const userFolder = path.join(
      __dirname,
      "../uploads",
      sociedadEncontrada,
      usuarioEncontrado
    );
    const userDocumentPath = path.join(userFolder, documentName);

    await fs.access(documentPath);
    await fs.mkdir(userFolder, { recursive: true });
    await fs.copyFile(documentPath, userDocumentPath);

    const pdfBytes = await fs.readFile(userDocumentPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawText(`Nombre: ${name}`, {
      x: 50,
      y: firstPage.getHeight() - 50,
      size: 12,
    });
    firstPage.drawText(`DNI: ${dni}`, {
      x: 50,
      y: firstPage.getHeight() - 70,
      size: 12,
    });

    const encodedSignatureData = signatureData.split(",")[1];
    const signatureBuffer = Buffer.from(encodedSignatureData, "base64");
    const signatureImage = await pdfDoc.embedPng(signatureBuffer);
    const signatureDims = signatureImage.scale(0.5);

    firstPage.drawImage(signatureImage, {
      x: 50,
      y: firstPage.getHeight() - 130,
      width: signatureDims.width,
      height: signatureDims.height,
    });

    const updatedPdfBytes = await pdfDoc.save();
    await fs.writeFile(userDocumentPath, updatedPdfBytes);

    await UsuarioDocumentacion.update(
      {
        firma: true,
        fecha_firma: new Date(),
        firma_uuid: uuidv4(),
        updatedAt: new Date(),
      },
      {
        where: { id_usuario: usuarioId, documento_id: documento.id },
      }
    );

    console.log("Documento firmado y registro actualizado exitosamente.");
    res.status(200).json({
      message: "Documento encontrado y firma adjuntada",
      usuario: usuarioEncontrado,
      sociedad: sociedadEncontrada,
    });
  } catch (error) {
    console.error("Error al procesar la solicitud", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

module.exports = { attachSignatureToDocument };
