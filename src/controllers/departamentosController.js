const { Departamento } = require("../models");

async function getDepartamentosBySociedad(req, res) {
  const sociedadId = req.params.sociedadId;

  try {
    // Obtener departamentos filtrados por sociedad_id
    const departamentos = await Departamento.findAll({
      where: { sociedad_id: sociedadId }, // Filtrar por sociedad_id
    });

    // Responder con la lista de departamentos
    res.json(departamentos);
  } catch (error) {
    console.error("Error al obtener departamentos:", error);
    res.status(500).json({ message: "Error al obtener departamentos" });
  }
}

async function createDepartamento(req, res) {
  const { nombre, sociedad_id } = req.body;

  try {
    // Crear la entrada en la tabla Departamento
    const departamento = await Departamento.create({
      nombre,
      sociedad_id,
    });

    res
      .status(201)
      .json({ message: "Departamento creado exitosamente", departamento });
  } catch (error) {
    console.error("Error al crear departamento:", error);
    res.status(500).json({ message: "Error al crear departamento" });
  }
}

module.exports = { getDepartamentosBySociedad, createDepartamento };
