"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "TiposDocumento",
      [
        {
          nombre: "Contrato",
          descripcion: "Documento legal entre cliente y empresa",
        },
        {
          nombre: "Política de Seguridad",
          descripcion: "Directrices de seguridad de la empresa",
        },
        {
          nombre: "Informe Técnico",
          descripcion: "Documento técnico detallado sobre servicios prestados",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TiposDocumento", null, {});
  },
};
