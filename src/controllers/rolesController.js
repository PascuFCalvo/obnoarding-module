// src/controllers/rolesController.js
const { Roles } = require("../models");

async function getRoles(req, res) {
  try {
    const roles = await Roles.findAll(); // Obtener todos los roles
    res.json(roles); // Responder con la lista de roles
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ message: "Error al obtener roles" });
  }
}

module.exports = { getRoles };
