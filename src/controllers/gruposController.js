const { Grupo, Departamento } = require("../models");

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

    console.log("Grupos encontrados:", grupos);

    res.json(grupos);
  } catch (error) {
    console.error("Error al obtener grupos:", error);
    res.status(500).json({ message: "Error al obtener grupos" });
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

module.exports = { getGruposBySociedad, createGrupo };
