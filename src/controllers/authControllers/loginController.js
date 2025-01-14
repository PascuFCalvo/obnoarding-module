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

    // Verificar usuario en la tabla Login
    const loginUser = await Login.findOne({ where: { username } });
    if (!loginUser || loginUser.password !== password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Obtener detalles del usuario desde la tabla Usuario
    const usuario = await Usuario.findOne({
      where: { login_id: loginUser.id },
      include: [
        {
          model: Roles,
          as: "roles",
          through: { attributes: [] },
        },
        {
          model: Grupo,
          as: "gruposAsociados",
          through: { model: UsuarioGrupo, attributes: [] },
          include: [
            {
              model: Departamento,
              as: "departamento",
              attributes: ["id", "nombre"],
              include: [
                {
                  model: Sociedad,
                  as: "sociedad",
                  attributes: ["id", "nombre"],
                },
              ],
            },
          ],
        },
        {
          model: Sociedad,
          as: "sociedad", // Relación directa con Sociedad
          attributes: ["id", "nombre"],
        },
      ],
    });

    if (!usuario) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    console.log("Usuario encontrado:", JSON.stringify(usuario, null, 2));

    // Determinar rol del usuario
    const roles = usuario.roles.map((role) => role.nombre.toLowerCase());
    let roleToAdd = roles.includes("admin")
      ? "admin"
      : roles.includes("manager")
      ? "manager"
      : roles.includes("empleado")
      ? "empleado"
      : null;

    if (!roleToAdd) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: rol desconocido" });
    }

    // Determinar grupo, departamento y sociedad asociados
    const grupo = usuario.gruposAsociados?.[0] || null;
    const departamento = grupo?.departamento || null;
    const sociedad = usuario.sociedad || departamento?.sociedad || null;

    console.log("Datos asociados:");
    console.log("Grupo:", grupo);
    console.log("Departamento:", departamento);
    console.log("Sociedad:", sociedad);

    // Generar el token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        username: loginUser.username,
        role: roleToAdd,
        grupoId: grupo?.id || null,
        grupoNombre: grupo?.nombre || null,
        departamentoId: departamento?.id || null,
        departamentoNombre: departamento?.nombre || null,
        sociedadId: sociedad?.id || null,
        sociedadNombre: sociedad?.nombre || null,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token generado con éxito.");

    // Responder con el token y el rol
    return res.status(200).json({ token, role: roleToAdd });
  } catch (error) {
    console.error("Error en el login:", error);
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
}

module.exports = loginController;
