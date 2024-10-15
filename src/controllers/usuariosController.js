const { Usuario, UsuarioRoles, Roles, Login } = require("../models");

async function getUsuariosBySociedad(req, res) {
  const sociedadId = req.params.sociedadId;

  try {
    // Obtener usuarios filtrados por sociedad_id y asociar los roles
    const usuarios = await Usuario.findAll({
      where: { sociedad_id: sociedadId }, // Filtrar por sociedad_id
      attributes: { exclude: ["grupo_id"] }, // Excluir grupo_id si es necesario
      include: [
        {
          model: UsuarioRoles,
          as: "usuarioRoles", // Asegúrate de que este alias esté configurado correctamente en tu modelo
          include: [
            {
              model: Roles,
              as: "rol", // Asegúrate de que este alias esté configurado correctamente en tu modelo
              attributes: ["id", "nombre"], // Solo traer los campos necesarios
            },
          ],
        },
      ],
    });

    // Transformar el resultado para incluir el rol
    const usuariosConRol = usuarios.map((usuario) => {
      const roles = usuario.usuarioRoles.map(
        (usuarioRol) => usuarioRol.rol.nombre
      );
      return {
        ...usuario.dataValues,
        roles: roles.length > 0 ? roles : [], // Asegúrate de manejar el caso en que no hay roles
      };
    });

    // Responder con la lista de usuarios
    res.json(usuariosConRol);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
}

async function createUsuario(req, res) {
  const {
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    sociedad_id,
    rol_id,
    marca_id,
  } = req.body;

  // Construir el nombre de usuario como 'nombre.apellido'
  const username = `${nombre.toLowerCase()}.${apellido.toLowerCase()}`;

  try {
    // Primero, crear la entrada en la tabla Login
    const login = await Login.create({
      username,
      password: "1234", // Asignar contraseña por defecto
      last_login: new Date(),
      is_active: true,
    });

    // Luego, crear la entrada en la tabla Usuario
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      marca_id,
      sociedad_id,
      login_id: login.id, // Asignar el login_id recién creado
    });

    // Asignar el rol al nuevo usuario en la tabla UsuarioRoles
    await UsuarioRoles.create({
      id_usuario: usuario.id,
      rol_id: rol_id, // Asumimos que rol_id se envía desde el formulario
    });

    res.status(201).json({ message: "Usuario creado exitosamente", usuario });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
}

module.exports = { getUsuariosBySociedad, createUsuario };
