const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const authMiddleware = require("./middlewares/authMiddleware");

dotenv.config();
const app = express();

app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // Origen permitido (tu aplicación front-end)
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



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

// Rutas protegidas con authMiddleware
app.use("/auth", require("./routes/authRoutes"));
app.use("/usuarios", require("./routes/usuariosRoutes"));
app.use("/roles", require("./routes/rolesRoutes"));
app.use("/departamentos", require("./routes/departamentosRoutes"));
app.use("/grupos", require("./routes/gruposRoutes"));
app.use("/notificaciones", require("./routes/notificacionesRoutes"));
app.use("/turiscool", require("./routes/turiscoolRoutes"));
app.use("/documentacion", require("./routes/documentacionRoutes"));
app.use("/sign", require("./routes/signRoutes"));

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
