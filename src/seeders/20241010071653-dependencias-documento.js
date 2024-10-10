"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "DependenciasDocumento",
      [
        { documento_id: 1, documento_predecesor_id: 2 },
        { documento_id: 3, documento_predecesor_id: 2 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("DependenciasDocumento", null, {});
  },
};
