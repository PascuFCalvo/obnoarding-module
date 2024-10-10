"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UsuarioDocumentacion",
      [
        {
          usuario_id: 1,
          documento_id: 1,
          acceso: true,
          firma: false,
          fecha_acceso: "2024-01-16 10:30:00",
          firma_uuid: "UUID1",
        },
        {
          usuario_id: 2,
          documento_id: 2,
          acceso: true,
          firma: true,
          fecha_acceso: "2024-02-11 14:00:00",
          fecha_firma: "2024-02-11 14:30:00",
          firma_uuid: "UUID2",
        },
        {
          usuario_id: 3,
          documento_id: 3,
          acceso: true,
          firma: true,
          fecha_acceso: "2024-03-02 09:00:00",
          fecha_firma: "2024-03-02 09:45:00",
          firma_uuid: "UUID3",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsuarioDocumentacion", null, {});
  },
};
