"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Marca", "LicenciasDisponibles", {
      type: Sequelize.STRING,
      allowNull: true, // Cambia a false si es obligatorio
      onDelete: "SET NULL", // Cambia esto según tus necesidades
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Marca", "LicenciasDisponibles");
  },
};
