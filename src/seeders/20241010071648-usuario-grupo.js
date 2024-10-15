"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UsuarioGrupo",
      [
        { id_usuario: 1, grupo_id: 1 },
        { id_usuario: 2, grupo_id: 2 },
        { id_usuario: 3, grupo_id: 3 },
        { id_usuario: 4, grupo_id: 4 },
        { id_usuario: 5, grupo_id: 5 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsuarioGrupo", null, {});
  },
};
