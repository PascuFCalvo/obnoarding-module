"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ConfiguracionLectura",
      [
        { documento_id: 1, tiempo_minimo_segundos: 300 },
        { documento_id: 2, tiempo_minimo_segundos: 600 },
        { documento_id: 3, tiempo_minimo_segundos: 900 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ConfiguracionLectura", null, {});
  },
};
