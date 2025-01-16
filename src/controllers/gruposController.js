const { Grupo, Departamento, UsuarioGrupo, Usuario } = require("../models");

async function getGruposBySociedad(req, res) {
  const sociedadId = req.params.sociedadId;

  try {
    // Obtener departamentos asociados a la sociedad
    const departamentos = await Departamento.findAll({
      where: { sociedad_id: sociedadId },
      attributes: ["id"], // Solo necesitamos los IDs de los departamentos
    });

    const departamentoIds = departamentos.map((dep) => dep.id);

    // Obtener grupos filtrados por los IDs de los departamentos
    const grupos = await Grupo.findAll({
      where: { departamento_id: departamentoIds },
      include: [
        {
          model: Departamento,
          as: "departamento",
          attributes: ["nombre"], // Incluir nombre del departamento si es necesario
        },
      ],
    });

    res.json(grupos);
  } catch (error) {
    console.error("Error al obtener grupos:", error);
    res.status(500).json({ message: "Error al obtener grupos" });
  }
}

async function getAllUserGroups(req, res) {
  try {
    // Obtener todos los registros de UsuarioGrupo con las relaciones de Usuario y Grupo
    const grupos = await UsuarioGrupo.findAll({
      include: [
        {
          model: Usuario,
          as: "usuario", // Nombre del alias si fue definido en las asociaciones
          attributes: ["id", "nombre", "apellido", "email"],
        },
        {
          model: Grupo,
          as: "grupo", // Nombre del alias si fue definido en las asociaciones
          attributes: ["id", "nombre", "departamento_id"],
        },
      ],
    });

    if (grupos.length === 0) {
      return res.status(404).json({ message: "No se encontraron grupos" });
    }

    res.json(grupos);
  } catch (error) {
    console.error("Error al obtener los grupos:", error);
    res.status(500).json({ message: "Error al obtener los grupos" });
  }
}

async function createGrupo(req, res) {
  const { nombre, departamento_id, sociedad_id } = req.body;

  try {
    // Verificar que el departamento pertenece a la sociedad
    const departamento = await Departamento.findOne({
      where: { id: departamento_id, sociedad_id: sociedad_id },
    });

    if (!departamento) {
      return res.status(400).json({
        message: "El departamento no pertenece a la sociedad especificada.",
      });
    }

    // Crear la entrada en la tabla Grupo
    const grupo = await Grupo.create({
      nombre,
      departamento_id,
    });

    res.status(201).json({ message: "Grupo creado exitosamente", grupo });
  } catch (error) {
    console.error("Error al crear grupo:", error);
    res.status(500).json({ message: "Error al crear grupo" });
  }
}

async function addUserToGroup(req, res) {
  try {
    const { id_usuario, grupo_id } = req.body;

    // Valida que ambos parámetros estén presentes
    if (!id_usuario || !grupo_id) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // Crea la relación en la tabla `UsuarioGrupo`
    await UsuarioGrupo.create({ id_usuario, grupo_id });

    res.status(201).json({ message: "Usuario agregado al grupo exitosamente" });
  } catch (error) {
    console.error("Error al agregar usuario al grupo:", error);
    res.status(500).json({ message: "Error al agregar usuario al grupo" });
  }
}
async function deleteUserFromGroup(req, res) {
  try {
    const { id_usuario, grupo_id } = req.body;

    // Valida que ambos parámetros estén presentes
    if (!id_usuario || !grupo_id) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // Elimina la relación en la tabla `UsuarioGrupo`
    await UsuarioGrupo.destroy({ where: { id_usuario, grupo_id } });

    res.json({ message: "Usuario eliminado del grupo exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario del grupo:", error);
    res.status(500).json({ message: "Error al eliminar usuario del grupo" });
  }
}

module.exports = {
  addUserToGroup,
};

module.exports = {
  getGruposBySociedad,
  createGrupo,
  getAllUserGroups,
  addUserToGroup,
  deleteUserFromGroup,
};
