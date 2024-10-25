"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UsuarioRoles",
      [
        { id_usuario: 1, rol_id: 3 }, // Maria Gomez es Admin
        { id_usuario: 2, rol_id: 2 }, // Pedro Lopez es Manager
        { id_usuario: 3, rol_id: 3 }, // Laura Ramirez es Empleado
        { id_usuario: 4, rol_id: 2 }, // Ana Martinez es Manager
        { id_usuario: 5, rol_id: 3 }, // Carlos Morales es Empleado
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsuarioRoles", null, {});
  },
};
