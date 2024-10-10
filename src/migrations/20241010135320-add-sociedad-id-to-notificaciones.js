"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Notificaciones", "sociedad_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "sociedad", // Nombre correcto de la tabla
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Cambia esto si quieres un comportamiento diferente
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Notificaciones", "sociedad_id");
  },
};
