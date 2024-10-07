const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const workerRoutes = require("./routes/workerRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve contenido estático desde 'public' y 'uploads'
app.use(express.static(path.join(__dirname, "public"))); // Sirve archivos de public
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Ajuste aquí

app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);
app.use("/workers", workerRoutes);

app.listen(3000, () => console.log("Servidor escuchando en el puerto 3000"));
