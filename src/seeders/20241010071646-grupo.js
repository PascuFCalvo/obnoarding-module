"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Grupo",
      [
        { nombre: "Backend", departamento_id: 1 },
        { nombre: "Frontend", departamento_id: 1 },
        { nombre: "Atención al Cliente", departamento_id: 2 },
        { nombre: "Comercial", departamento_id: 3 },
        { nombre: "Instalaciones", departamento_id: 4 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Grupo", null, {});
  },
};
