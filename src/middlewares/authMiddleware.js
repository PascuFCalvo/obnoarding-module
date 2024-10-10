const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_jwt";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token no válido" });
    }

    console.log("Usuario autenticado:", user);

    // Solo permite el acceso si el rol es "Manager"
    if (user.role !== "Manager") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    req.user = user; // Agrega el usuario a la solicitud
    next();
  });
}

module.exports = authMiddleware;
