const { Usuario, UsuarioRoles, Roles, Login } = require("../models");

async function getUsuariosBySociedad(req, res) {
  const sociedadId = req.params.sociedadId;

  try {
    const usuarios = await Usuario.findAll({
      where: { sociedad_id: sociedadId },
      attributes: { exclude: ["grupo_id"] },
      include: [
        {
          model: UsuarioRoles,
          as: "usuarioRoles",
          include: [
            {
              model: Roles,
              as: "rol",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });

    // Transformar el resultado para incluir los nombres de los roles
    const usuariosConRol = usuarios.map((usuario) => {
      const roles = usuario.usuarioRoles.map(
        (usuarioRol) => usuarioRol.rol.nombre
      );
      return {
        ...usuario.dataValues,
        roles: roles.length > 0 ? roles : [], // Manejamos el caso en que no haya roles
      };
    });

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

  // Generar el nombre de usuario como 'nombre.apellido'
  const username = `${nombre.toLowerCase()}.${apellido.toLowerCase()}`;

  try {
    // Verificar si el email o el username ya existen
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    const existingUsername = await Login.findOne({ where: { username } });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso" });
    }

    // Crear la entrada en la tabla Login
    const login = await Login.create({
      username,
      password: 1234,
      last_login: new Date(),
      is_active: true,
    });

    // Crear la entrada en la tabla Usuario
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      marca_id: marca_id || null,
      sociedad_id: sociedad_id || null,
      login_id: login.id, // Asignar el login_id recién creado
    });

    // Asignar el rol al nuevo usuario en la tabla UsuarioRoles si rol_id está presente
    if (rol_id) {
      await UsuarioRoles.create({
        id_usuario: usuario.id,
        rol_id: rol_id,
      });
    }

    res.status(201).json({ message: "Usuario creado exitosamente", usuario });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
}
async function deleteUsuario(req, res) {
  const id = req.params.id;

  try {
    // Buscar y eliminar el usuario
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await usuario.destroy();

    // Buscar y eliminar la entrada en la tabla login
    const login = await Login.findByPk(id);
    if (!login) {
      return res.status(404).json({ message: "Login no encontrado" });
    }
    await login.destroy();

    res.json({ message: "Usuario y Login eliminados exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario o login:", error);
    res.status(500).json({ message: "Error al eliminar usuario o login" });
  }
}

async function updateUsuario(req, res) {
  const id = req.params.id;
  const {
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    rol_id,
    marca_id,
    login,
    password,
  } = req.body;

  try {
    // Buscar el usuario
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los datos del usuario
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.email = email;
    usuario.telefono = telefono;
    usuario.direccion = direccion;
    usuario.marca_id = marca_id || null;
    await usuario.save();

    const loginUsuario = await Login.findByPk(id);
    if (!loginUsuario) {
      return res.status(404).json({ message: "Login no encontrado" });
    }

    loginUsuario.username = login;
    loginUsuario.password = password;
    await loginUsuario.save();

    // Actualizar el rol del usuario en la tabla UsuarioRoles
    const usuarioRol = await UsuarioRoles.findOne({
      where: { id_usuario: id },
    });
    if (usuarioRol) {
      usuarioRol.rol_id = rol_id;
      await usuarioRol.save();
    } else {
      await UsuarioRoles.create({ id_usuario: id, rol_id });
    }

    res.json({ message: "Usuario actualizado exitosamente", usuario });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
}

module.exports = {
  getUsuariosBySociedad,
  createUsuario,
  deleteUsuario,
  updateUsuario,
};
