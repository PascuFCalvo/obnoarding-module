"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Sociedad",
      [
        {
          marca_id: 1,
          nombre: "TechSolutions - España",
          direccion: "Calle Innovación 12, Madrid",
          telefono: "912345678",
        },
        {
          marca_id: 1,
          nombre: "TechSolutions - USA",
          direccion: "123 Silicon Valley, California",
          telefono: "16505551234",
        },
        {
          marca_id: 2,
          nombre: "GreenEnergy - España",
          direccion: "Av. Renovable 45, Sevilla",
          telefono: "955678901",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Sociedad", null, {});
  },
};
