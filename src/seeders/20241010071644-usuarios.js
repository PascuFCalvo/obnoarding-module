"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Usuarios",
      [
        {
          nombre: "Maria",
          apellido: "Gomez",
          email: "maria.gomez@techsolutions.com",
          telefono: "600111222",
          direccion: "Calle Real 23, Madrid",
          login_id: 1,
          marca_id: 1,
          sociedad_id: 1,
        },
        {
          nombre: "Pedro",
          apellido: "Lopez",
          email: "pedro.lopez@techsolutions.com",
          telefono: "600333444",
          direccion: "Av. Principal 15, Madrid",
          login_id: 2,
          marca_id: 1,
          sociedad_id: 1,
        },
        {
          nombre: "Laura",
          apellido: "Ramirez",
          email: "laura.ramirez@techsolutions.com",
          telefono: "610555666",
          direccion: "Calle Secundaria 8, Sevilla",
          login_id: 3,
          marca_id: 1,
          sociedad_id: 2,
        },
        {
          nombre: "Ana",
          apellido: "Martinez",
          email: "ana.martinez@greenenergy.com",
          telefono: "620777888",
          direccion: "Plaza Mayor 9, Sevilla",
          login_id: 4,
          marca_id: 2,
          sociedad_id: 3,
        },
        {
          nombre: "Carlos",
          apellido: "Morales",
          email: "carlos.morales@greenenergy.com",
          telefono: "630999000",
          direccion: "Camino Verde 45, Sevilla",
          login_id: 5,
          marca_id: 2,
          sociedad_id: 3,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Usuarios", null, {});
  },
};
