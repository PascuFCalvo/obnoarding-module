"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UsuarioRoles",
      [
        { usuario_id: 1, rol_id: 1 }, // Maria Gomez es Admin
        { usuario_id: 2, rol_id: 2 }, // Pedro Lopez es Manager
        { usuario_id: 3, rol_id: 3 }, // Laura Ramirez es Empleado
        { usuario_id: 4, rol_id: 2 }, // Ana Martinez es Manager
        { usuario_id: 5, rol_id: 3 }, // Carlos Morales es Empleado
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsuarioRoles", null, {});
  },
};
