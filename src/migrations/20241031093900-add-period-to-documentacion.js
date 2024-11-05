"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Documentacion", "periodo", {
      type: Sequelize.DATE,
      allowNull: true, // Cambia a false si quieres que sea obligatorio
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Documentacion", "periodo");
  },
};
