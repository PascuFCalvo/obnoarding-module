const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const authMiddleware = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Sirve contenido estático desde 'public' y 'uploads'
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rutas protegidas con authMiddleware
app.use("/managers", authMiddleware, require("./routes/managerRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/documents", require("./routes/documentRoutes"));
app.use("/workers", require("./routes/workerRoutes"));
app.use("/usuarios", require("./routes/usuariosRoutes"));
app.use("/roles", require("./routes/rolesRoutes"));
app.use("/departamentos", require("./routes/departamentosRoutes"));
app.use("/grupos", require("./routes/gruposRoutes"));
app.use("/notificaciones", require("./routes/notificacionesRoutes"));

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
