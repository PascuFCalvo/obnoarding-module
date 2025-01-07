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
          firmasUtilizadas: 3,
          firmasDisponibles: 100,
          DocumentosSubidos: 1,
          DocumentosDisponibles: 100,
          LicenciasUtilizadas: 20,
          LicenciasDisponibles: 40,
        },
        {
          nombre: "GreenEnergy",
          descripcion: "Compañía de energías renovables y sostenibles",
          firmasUtilizadas: 2,
          firmasDisponibles: 200,
          DocumentosSubidos: 6,
          DocumentosDisponibles: 300,
          LicenciasUtilizadas: 30,
          LicenciasDisponibles: 100,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Marca", null, {});
  },
};
