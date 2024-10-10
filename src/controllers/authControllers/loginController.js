const jwt = require("jsonwebtoken");
const { Login, Usuario, UsuarioRoles, Roles } = require("../../models");
const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_jwt";

async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    // Buscar el usuario en la tabla Login
    const loginUser = await Login.findOne({ where: { username } });
    if (!loginUser || loginUser.password !== password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Obtener el usuario asociado con el rol, excluyendo grupo_id
    const usuario = await Usuario.findOne({
      where: { login_id: loginUser.id },
      include: [
        {
          model: Roles,
          as: "roles",
          through: { attributes: [] }, // No incluir atributos de la tabla intermedia
        },
      ],
      attributes: { exclude: ["grupo_id"] }, // Excluir grupo_id
    });

    // Verificar si se encontró el usuario
    if (!usuario) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    // Obtener el rol del usuario
    const roles = usuario.roles.map((role) => role.nombre);
    let roleToAdd = "";
    const sociedadId = usuario.sociedad_id;
    const marcaId = usuario.marca_id; // Asegúrate de tener este campo en el modelo Usuario

    // Verificar los roles y establecer el rol correspondiente
    if (roles.includes("Manager")) {
      roleToAdd = "manager";
    } else if (roles.includes("Empleado")) {
      roleToAdd = "empleado";
    } else if (roles.includes("Admin")) {
      roleToAdd = "admin";
    } else {
      return res
        .status(403)
        .json({ message: "Acceso denegado: rol desconocido" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        username: loginUser.username,
        role: roleToAdd,
        sociedadId: sociedadId,
        marcaId: marcaId,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Responder con el token y el rol
    res.json({ token, role: roleToAdd });
  } catch (error) {
    console.error("Error en el login:", error); // Esto mostrará el error completo
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
}

module.exports = loginController;
