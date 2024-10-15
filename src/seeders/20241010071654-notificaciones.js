"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Notificaciones",
      [
        {
          id_usuario: 1,
          documento_id: 1,
          sociedad_id: 1,
          fecha_envio: "2024-01-15 08:00:00",
          fecha_entrega: "2024-01-15 08:05:00",
          fecha_confirmacion: "2024-01-15 08:10:00",
          tipo_notificacion: "Email",
          estado: "CONFIRMADA",
        },
        {
          id_usuario: 2,
          documento_id: 2,
          sociedad_id: 1,
          fecha_envio: "2024-02-10 09:00:00",
          fecha_entrega: "2024-02-10 09:05:00",
          fecha_confirmacion: "2024-02-10 09:15:00",
          tipo_notificacion: "Email",
          estado: "CONFIRMADA",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Notificaciones", null, {});
  },
};
