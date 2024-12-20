"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Documentacion", "linkCourse", {
      type: Sequelize.STRING,
      allowNull: true, // Cambia a false si es obligatorio
      onDelete: "SET NULL", // Cambia esto según tus necesidades
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Documentacion", "linkCourse");
  },
};
