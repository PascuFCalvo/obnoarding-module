"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Documentacion", "sociedad_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // Cambia a false si es obligatorio
      references: {
        model: "Sociedad", // Asegúrate de que este nombre coincida con el nombre de tu modelo de Sociedad
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Cambia esto según tus necesidades
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Documentacion", "sociedad_id");
  },
};
