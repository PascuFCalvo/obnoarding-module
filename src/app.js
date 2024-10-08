const express = require("express");
const cors = require("cors");
const session = require("express-session"); // Importar express-session

const path = require("path");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const workerRoutes = require("./routes/workerRoutes");
const managerRoutes = require("./routes/managerRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de express-session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Sirve contenido estático desde 'public' y 'uploads'
app.use(express.static(path.join(__dirname, "public"))); // Sirve archivos de public
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/managers", managerRoutes);
app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);
app.use("/workers", workerRoutes);

app.listen(3000, () => console.log("Servidor escuchando en el puerto 3000"));
