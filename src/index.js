const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");

// Inicialización del servidor
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para servir archivos subidos (estáticos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", express.static(path.join(__dirname, "public")));

// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const societyId = req.body.societyId || 1; // Cambiar según la lógica de la sociedad
    const uploadDir = `./uploads/society_${societyId}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Simulación de usuarios para autenticación
const users = [
  {
    id: 1,
    name: "Trabajador1",
    username: "worker1",
    password: "1234",
    role: "worker",
    societyId: 1,
  },
  {
    id: 2,
    name: "Trabajador2",
    username: "worker2",
    password: "1234",
    role: "worker",
    societyId: 1,
  },
  {
    id: 2,
    name: "Manager1",
    username: "manager1",
    password: "1234",
    role: "manager",
    societyId: 1,
  },
];

// Ruta de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ message: "Login exitoso", user });
  } else {
    res.status(401).json({ message: "Credenciales incorrectas" });
  }
});

// Subida de documentos por el manager
app.post("/upload", upload.single("document"), (req, res) => {
  const societyId = req.body.societyId; // Obtener el societyId del cuerpo de la solicitud
  const uploadDir = `./uploads/society_${societyId}`; // Directorio para esta sociedad

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const documentPath = `/uploads/society_${societyId}/${req.file.originalname}`;
  res.json({
    message: "Documento subido correctamente",
    filePath: documentPath,
  });
});

app.get("/society-documents/:societyId", (req, res) => {
  const societyId = req.params.societyId; // Obtener el societyId de los parámetros de la URL
  const societyDocumentsPath = path.join(
    __dirname,
    `uploads/society_${societyId}`
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ documents: [] }); // Si la carpeta no existe, devolver una lista vacía
  }

  // Leer los archivos de la carpeta "society_<societyId>"
  const documents = fs.readdirSync(societyDocumentsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${societyId}/${file}`,
  }));

  res.json({ documents });
});

// Ruta para que el manager vea los documentos que ha subido
app.get("/manager/society-documents/:managerId", (req, res) => {
  const managerId = req.params.managerId;
  const manager = users.find((u) => u.id == managerId && u.role === "manager");

  if (!manager) {
    return res.status(404).json({ message: "Manager no encontrado" });
  }

  // Ruta donde están los documentos de la sociedad
  const societyDocumentsPath = path.join(
    __dirname,
    `uploads/society_${manager.societyId}`
  );

  // Si la carpeta no existe, devolver lista vacía
  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ documents: [] });
  }

  // Leer los archivos de la carpeta de la sociedad
  const documents = fs.readdirSync(societyDocumentsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${manager.societyId}/${file}`,
  }));

  res.json({ documents });
});

// Ruta para que el trabajador vea los documentos subidos por el manager
app.get("/documents/:workerId", (req, res) => {
  const workerId = req.params.workerId;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  const societyDocumentsPath = path.join(
    __dirname,
    `uploads/society_${worker.societyId}`
  );

  if (!fs.existsSync(societyDocumentsPath)) {
    return res.json({ societyDocuments: [] });
  }

  const documents = fs.readdirSync(societyDocumentsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/${file}`,
  }));

  res.json({ societyDocuments: documents });
});

// Ruta para que el trabajador vea sus documentos firmados
app.get("/worker/signed-documents/:workerId", (req, res) => {
  const workerId = req.params.workerId;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  const signedDocsPath = path.join(
    __dirname,
    `uploads/society_${worker.societyId}/worker_${workerId}`
  );

  if (!fs.existsSync(signedDocsPath)) {
    return res.json({ signedDocuments: [] });
  }

  const signedDocuments = fs.readdirSync(signedDocsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/worker_${workerId}/${file}`,
  }));

  res.json({ signedDocuments });
});

// Ruta para que el manager vea los documentos firmados de sus trabajadores
// Ruta para que el manager vea los documentos firmados de sus trabajadores
app.get("/manager/worker-documents/:workerId", (req, res) => {
  const workerId = req.params.workerId;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  // Directorio donde están los documentos firmados por el trabajador
  const signedDocsPath = path.join(
    __dirname,
    `uploads/society_${worker.societyId}/worker_${workerId}`
  );

  // Verificar si la carpeta de documentos firmados existe
  if (!fs.existsSync(signedDocsPath)) {
    return res.json({ documents: [] }); // Si no existe, devolver lista vacía
  }

  // Leer los archivos dentro de la carpeta de documentos firmados del trabajador
  const signedDocuments = fs.readdirSync(signedDocsPath).map((file) => ({
    fileName: file,
    filePath: `/uploads/society_${worker.societyId}/worker_${workerId}/${file}`,
  }));

  res.json({ documents: signedDocuments });
});

// Firma de documentos por el trabajador
app.post("/sign-document", async (req, res) => {
  const { workerId, documentName, signatureDataUrl, name, DNI, date } =
    req.body;
  const worker = users.find((u) => u.id == workerId && u.role === "worker");

  if (!worker) {
    return res.status(404).json({ message: "Trabajador no encontrado" });
  }

  const documentPath = path.join(
    __dirname,
    `uploads/society_${worker.societyId}/${documentName}`
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
    `uploads/society_${worker.societyId}/worker_${workerId}`,
    `signed_${documentName}`
  );
  if (!fs.existsSync(path.dirname(signedFilePath))) {
    fs.mkdirSync(path.dirname(signedFilePath), { recursive: true });
  }

  const signedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(signedFilePath, signedPdfBytes);

  const publicUrl = `/uploads/society_${worker.societyId}/worker_${workerId}/signed_${documentName}`;
  res.json({ message: "Documento firmado correctamente", filePath: publicUrl });
});

// Ruta para que el manager vea la lista de trabajadores
app.get("/manager/worker-list/:managerId", (req, res) => {
  const managerId = req.params.managerId;
  const manager = users.find((u) => u.id == managerId && u.role === "manager");

  if (!manager) {
    return res.status(404).json({ message: "Manager no encontrado" });
  }

  const workers = users
    .filter((u) => u.societyId == manager.societyId && u.role === "worker")
    .map((worker) => ({
      id: worker.id,
      name: worker.name,
    }));

  res.json({ workers });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
