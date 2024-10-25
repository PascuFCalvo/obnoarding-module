const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

function signDocument(req, res) {
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
  console.log("Nueva Firma Registrada:", newSignature);

  // Enviar respuesta con el identificador único
  res.status(201).json({ uniqueIdentifier });
}

module.exports = { signDocument };
