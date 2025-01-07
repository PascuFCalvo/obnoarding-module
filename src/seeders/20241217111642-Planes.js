"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Planes",
      [
        {
          Plan: "Basic",
          Firmas: 10,
          Documentos: 50,
          Licencias: 5,
        },
        {
          Plan: "Premium",
          Firmas: 20,
          Documentos: 100,
          Licencias: 10,
        },
        {
          Plan: "Enterprise",
          Firmas: 50,
          Documentos: 500,
          Licencias: 50,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Planes", null, {});
  },
};
