const { Notificaciones, Usuario } = require("../models");

async function getNotificacionesBySociedad(req, res) {
  const sociedadId = req.params.sociedadId;

  try {
    // Obtener notificaciones filtradas por sociedad_id
    const notificaciones = await Notificaciones.findAll({
      where: { sociedad_id: sociedadId }, // Asegúrate de que esto coincida con tu modelo
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["nombre", "apellido"], // Incluir solo los atributos necesarios
        },
      ],
    });

    console.log("Notificaciones encontradas:", notificaciones);

    res.json(notificaciones);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
}

module.exports = { getNotificacionesBySociedad };
