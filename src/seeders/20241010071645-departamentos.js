"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Departamentos",
      [
        { nombre: "Desarrollo", sociedad_id: 1 },
        { nombre: "Soporte Técnico", sociedad_id: 1 },
        { nombre: "Ventas", sociedad_id: 2 },
        { nombre: "Operaciones", sociedad_id: 3 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Departamentos", null, {});
  },
};
