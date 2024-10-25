const jwt = require("jsonwebtoken");
const {
  Login,
  Usuario,
  UsuarioGrupo,
  Grupo,
  Departamento,
  Sociedad,
  Roles,
} = require("../../models");
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
        {
          model: Grupo,
          as: "gruposAsociados", // Asumiendo el alias configurado
          through: { model: UsuarioGrupo, attributes: [] },
          include: [
            {
              model: Departamento,
              as: "departamento", // Alias en el modelo Departamento
              attributes: ["id", "nombre"],
              include: [
                {
                  model: Sociedad,
                  as: "sociedad", // Alias en el modelo Sociedad
                  attributes: ["id", "nombre"],
                },
              ],
            },
          ],
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

    // Obtener los detalles del grupo y departamento
    const grupo = usuario.gruposAsociados?.[0] || null; // Se asume un usuario pertenece a un solo grupo
    const departamento = grupo ? grupo.departamento : null;
    const sociedad = departamento ? departamento.sociedad : null;

    // Generar el token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        username: loginUser.username,
        role: roleToAdd,
        grupoId: grupo ? grupo.id : null,
        grupoNombre: grupo ? grupo.nombre : null,
        departamentoId: departamento ? departamento.id : null,
        departamentoNombre: departamento ? departamento.nombre : null,
        sociedadId: sociedad ? sociedad.id : null,
        sociedadNombre: sociedad ? sociedad.nombre : null,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Responder con el token y el rol
    res.json({ token, role: roleToAdd });
  } catch (error) {
    console.error("Error en el login:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
}

module.exports = loginController;
