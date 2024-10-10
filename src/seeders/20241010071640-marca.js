"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Marca",
      [
        {
          nombre: "TechSolutions",
          descripcion:
            "Empresa de tecnología especializada en software empresarial",
        },
        {
          nombre: "GreenEnergy",
          descripcion: "Compañía de energías renovables y sostenibles",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Marca", null, {});
  },
};
