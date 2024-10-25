"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("UsuarioDocumentacion", "url", {
      type: Sequelize.STRING,
      allowNull: true, // Permitir valores nulos inicialmente, ajusta según necesidades
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("UsuarioDocumentacion", "url");
  },
};
