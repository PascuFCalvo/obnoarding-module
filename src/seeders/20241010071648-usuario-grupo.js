"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UsuarioGrupo",
      [
        { usuario_id: 1, grupo_id: 1 },
        { usuario_id: 2, grupo_id: 2 },
        { usuario_id: 3, grupo_id: 3 },
        { usuario_id: 4, grupo_id: 4 },
        { usuario_id: 5, grupo_id: 5 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsuarioGrupo", null, {});
  },
};
