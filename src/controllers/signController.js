const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { Documentacion, UsuarioDocumentacion } = require("../models"); // Asegúrate de que el modelo esté correctamente importado

async function signDocument(req, res) {
  const { name, dni, signatureData, user, deviceInfo, location, biometrics } =
    req.body;

  if (!name || !dni || !signatureData || !user) {
    return res
      .status(400)
      .json({ error: "Faltan datos necesarios para la firma" });
  }

  const signatureId = uuidv4();
  const timestamp = Date.now();

  // Concatena toda la información en un string para generar el hash único
  const dataString = `${signatureId}${name}${dni}${signatureData}${user.id}${
    user.username
  }${user.role}${user.sociedadId}${user.marcaId}${deviceInfo}${
    location.latitude
  }${location.longitude}${timestamp}${JSON.stringify(biometrics)}`;
  const uniqueIdentifier = crypto
    .createHash("sha256")
    .update(dataString)
    .digest("hex");

  // Agregar biometrics al objeto de la firma
  const newSignature = {
    signatureId,
    name,
    dni,
    signatureData,
    user,
    deviceInfo,
    location,
    timestamp,
    biometrics, // Añadir biometría al objeto de la firma
    uniqueIdentifier,
  };

  // Registro en consola para verificar

  // Enviar respuesta con el identificador único
  res.status(201).json({ uniqueIdentifier });
}

async function signAndSaveDcoument(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }

    // Decodificar metadatos del frontend
    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
    const { id: id_usuario, documento_id, sociedadNombre } = metadata;

    if (!id_usuario || !documento_id || !sociedadNombre) {
      console.error("Faltan datos necesarios para procesar el documento.");
      return res
        .status(400)
        .json({ error: "Faltan datos necesarios para procesar el documento" });
    }

    
    // Crear la carpeta del usuario si no existe
    const userDirectory = path.join(
      __dirname,
      `../uploads/${sociedadNombre}/${id_usuario}`
    );
    if (!fs.existsSync(userDirectory)) {
      fs.mkdirSync(userDirectory, { recursive: true });
    }

    // Generar el nombre del archivo
    const extension = path.extname(req.file.originalname);
    const fileName = `signed_${Date.now()}${extension}`;
    const filePath = path.join(userDirectory, fileName);

    // Guardar el archivo
    fs.writeFileSync(filePath, req.file.buffer);


    // Generar la URL del archivo
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const newFileUrl = `${baseUrl}/uploads/${sociedadNombre}/${id_usuario}/${fileName}`;

    // Actualizar el campo firma y la URL en UsuarioDocumentacion
    const [updatedRows] = await UsuarioDocumentacion.update(
      { firma: 1, url: newFileUrl }, // Actualiza firma y URL
      { where: { id_usuario, documento_id } } // Asegúrate de usar el documento_id correcto
    );

    

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró la documentación para actualizar" });
    }

    res.status(201).json({
      message: "Documento firmado y actualizado correctamente",
      filePath,
      newFileUrl,
    });
  } catch (error) {
    console.error("Error al procesar el documento:", error);
    res.status(500).json({ error: "Error interno al procesar el documento" });
  }
}


module.exports = { signAndSaveDcoument };

module.exports = { signAndSaveDcoument };

module.exports = { signDocument, signAndSaveDcoument };
