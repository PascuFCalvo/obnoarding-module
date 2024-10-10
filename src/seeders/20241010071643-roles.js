"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Roles",
      [{ nombre: "Admin" }, { nombre: "Manager" }, { nombre: "Empleado" }],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
