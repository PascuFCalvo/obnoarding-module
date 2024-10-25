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

  if (!name || !dni || !signatureData || !sociedadId || !documentName) {
    console.error("Faltan datos requeridos para el proceso de firma");
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    console.log(
      "Iniciando el proceso de firma para el documento:",
      documentName
    );

    // Obtén la sociedad
    const sociedad = await Sociedad.findOne({
      where: { id: sociedadId },
      attributes: ["nombre"],
    });

    if (!sociedad) {
      console.error("Sociedad no encontrada con ID:", sociedadId);
      return res.status(404).json({ error: "Sociedad no encontrada" });
    }

    // Obtén el usuario
    const usuario = await Usuario.findOne({
      where: { id: usuarioId },
      attributes: ["nombre", "apellido"],
    });

    if (!usuario) {
      console.error("Usuario no encontrado con ID:", usuarioId);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtén el documento
    const documento = await Documentacion.findOne({
      where: { nombre: documentName },
      attributes: ["id"],
    });

    if (!documento) {
      console.error("Documento no encontrado con nombre:", documentName);
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    // Verifica la entrada en UsuarioDocumentacion
    const usuarioDocumentacion = await UsuarioDocumentacion.findOne({
      where: { id_usuario: usuarioId, documento_id: documento.id },
    });

    if (!usuarioDocumentacion) {
      console.error(
        "Registro de UsuarioDocumentacion no encontrado para usuario:",
        usuarioId,
        "y documento:",
        documento.id
      );
      return res
        .status(404)
        .json({ error: "Registro de UsuarioDocumentacion no encontrado" });
    }

    // Rutas de archivo
    const sociedadNombre = sociedad.nombre;
    const usuarioNombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
    const documentPath = path.join(
      __dirname,
      "../uploads",
      sociedadNombre,
      documentName
    );
    const userFolder = path.join(
      __dirname,
      "../uploads",
      sociedadNombre,
      usuarioNombreCompleto
    );
    const userDocumentPath = path.join(userFolder, documentName);

    // Verifica que el archivo original exista
    await fs.access(documentPath);
    await fs.mkdir(userFolder, { recursive: true });
    await fs.copyFile(documentPath, userDocumentPath);

    // Procesa y firma el PDF
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

    // Generar la URL para almacenar
    const userDocumentUrl = `uploads/${sociedadNombre}/${usuarioNombreCompleto}/${documentName}`;
    console.log("URL generada para el documento firmado:", userDocumentUrl);

    // Actualizar la base de datos con la URL
    await UsuarioDocumentacion.update(
      {
        firma: true,
        fecha_firma: new Date(),
        firma_uuid: uuidv4(),
        url: userDocumentUrl, // Agregar la URL aquí
        updatedAt: new Date(),
      },
      {
        where: { id_usuario: usuarioId, documento_id: documento.id },
      }
    );

    console.log(
      "Registro de UsuarioDocumentacion actualizado con éxito, incluida la URL."
    );

    // Responder con éxito
    res.status(200).json({
      message: "Documento encontrado y firma adjuntada",
      usuario: usuarioNombreCompleto,
      sociedad: sociedadNombre,
    });
    console.log(
      "Documento encontrado y firma adjuntada para el usuario:",
      usuarioNombreCompleto
    );
  } catch (error) {
    console.error("Error inesperado al procesar la solicitud:", error);
    res
      .status(500)
      .json({ error: "Error inesperado al procesar la solicitud" });
  }
};

module.exports = { attachSignatureToDocument };
